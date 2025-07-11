// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "../Pool.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Pool, PoolConfig} from "../Pool.sol";

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IEAS} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";


contract SilviVerificationStrategy is Pool, Context, AccessControl, ReentrancyGuard {
    uint256 private totalFunded = 0;
    uint256 private totalDistributed = 0;

    IEAS public eas;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Constructor that initializes the pool with the provided name, schema, and metadata URI and grants the deployer the default admin role.
    /// @param _name The name of the pool.
    /// @param _schema The schema of the pool.
    /// @param _metadataURI The metadata URI of the pool.
    constructor(string memory _name, string memory _schema, string memory _metadataURI, address easAddress) Pool(_name, _schema, _metadataURI) {
        if (easAddress != address(0)) {
            eas = IEAS(easAddress);
        }
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());   // Grant the deployer the default admin role
        _grantRole(ADMIN_ROLE, _msgSender());   // Also grant the deployer the admin role
    }


    /// ======================================
    /// ========== Permissioning =============
    /// ======================================

    /// @notice Initializes the pool with the provided configuration and grants the admin role to the owner and admins specified in the config.
    /// @param _config The configuration for the pool.
    /// @param data Additional data that can be used during initialization.
    function initialize(PoolConfig memory _config, bytes memory data) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        super.initialize(_config, data);

        // Grant the admin role to the owner and admins specified in the config
        _grantRole(ADMIN_ROLE, _config.owner);
        for (uint256 i = 0; i < _config.admins.length; i++) {
            _grantRole(ADMIN_ROLE, _config.admins[i]);
        }
    }

    /// @notice Configures the pool with the provided configuration and grants the admin role to the owner and admins specified in the config.
    /// @param _config The configuration for the pool.
    function configure(PoolConfig memory _config) public override onlyRole(ADMIN_ROLE) {
        super._configure(_config);

        // Grant the admin role to the owner and admins specified in the config
        _grantRole(ADMIN_ROLE, _config.owner);
        for (uint256 i = 0; i < _config.admins.length; i++) {
            _grantRole(ADMIN_ROLE, _config.admins[i]);
        }
    }


    /// ==============================================
    /// ========== Transaction And Accounting ========
    /// ==============================================

    /// @notice Tops up the pool with the specified amount of tokens configured in either initialize() or configure() then updates the amountDeployed tracking variable.
    /// @param amount The amount of tokens to top up the pool with.
    function fund(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(config.distributionToken != address(0), "Token (distribution token) not set");

        allocate([address(this)], [amount], config.distributionToken, new bytes[](1));

        totalFunded += amount;
    }

    /// @notice Transfers tokens from the contract to recipients.
    /// @dev This function can only be called by the contract owner or admins.
    /// @param recipients The addresses of the recipients to distribute tokens to.
    /// @param amounts The amounts of tokens to distribute to each recipient.
    /// @param data Additional data that can be used during distribution, such as attestation UIDs.
    function distribute(address[] memory recipients, uint256[] memory amounts, bytes[] memory data)
        external
        override
        onlyRole(ADMIN_ROLE)
        nonReentrant
    {
        _distribute(recipients, amounts, config.distributionToken, data);

        for (uint256 i = 0; i < recipients.length; i++) {
            totalDistributed += amounts[i];
        }
    }

    /// @notice Performs necessary checks before distributing tokens to recipients.
    /// @dev This function is called internally before the actual distribution of tokens.
    /// @param recipient The address of the recipient to distribute tokens to.
    /// @param amount The amount of tokens to distribute to the recipient.
    /// @param token The address of the token to distribute.
    /// @param data Additional data that can be used during distribution, such as attestation UIDs.
    function _beforeDistribute(address recipient, uint256 amount, address token, bytes memory data) internal override {
        // decode and unpack data
        (bytes32 claimAttestationUID, bytes32 goalAttestationUID) = abi.decode(data, (bytes32, bytes32));

        // TODO: here, we retrieve the claim attestation, the goal attestation, and confirm the conditions
        // TODO: at the moment zone geofencing conditions are complicated if at all possible because of geojson calculations which are heavylifted by libraries in web2, but not in solidity)
        // TODO: not to mention how much gas it would cost to do this in solidity

        // additional checks
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(amount <= balance, "Amount exceeds balance");
    }

    /// @notice Sends the contract's balance back to the owner.
    /// @dev This function can only be called by the contract owner.
    function liquidate() external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(config.distributionToken != address(0), "Token (distribution token) not set");
        uint256 balance = IERC20(config.distributionToken).balanceOf(address(this));

        if (balance > 0) {
            SafeERC20.safeTransfer(IERC20(config.distributionToken), _msgSender(), balance);
        }
    }


    /// ===============================
    /// ========== Data Access ========
    /// ===============================

    /// @notice Returns the total amount of tokens funded in the pool.
    function getTotalFunded() external view returns (uint256) {
        return totalFunded;
    }

    /// @notice Returns the total amount of tokens distributed from the pool.
    function getTotalDistributed() external view returns (uint256) {
        return totalDistributed;
    }
}
