// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import { Pool, PoolConfig } from "../Pool.sol";

contract RetroFunding is Pool, Context, AccessControl, ReentrancyGuard {
    constructor(string memory _name, string memory _schema, PoolConfig memory _config) Pool(_name, _schema, _config) {
        _grantRole(DEFAULT_ADMIN_ROLE, config.owner);
        for (uint256 i = 0; i < config.admins.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, config.admins[i]);
        }
    }

    function initialize(PoolConfig memory _config, bytes calldata data) public override {
        // super.initialize(_config, data);
        _grantRole(DEFAULT_ADMIN_ROLE, _config.owner);
        for (uint256 i = 0; i < _config.admins.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, _config.admins[i]);
        }
    }

    // constructor(PoolConfig memory _config) Pool(_config) {
    //     config = _config;

    // _grantRole(DEFAULT_ADMIN_ROLE, config.owner);
    // for (uint256 i = 0; i < config.admins.length; i++) {
    //     _grantRole(DEFAULT_ADMIN_ROLE, config.admins[i]);
    // }
    // }

    // MetadataURI contain details about project application
    function register(address project, string memory _metadataURI, bytes memory data) external {
        _register(project, _metadataURI, data);
    }

    function reject(
        address project,
        string memory _metadataURI,
        bytes memory data
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _reject(project, _metadataURI, data);
    }

    // MetadataURI can contain Review information
    function approve(
        address project,
        string memory _metadataURI,
        bytes memory data
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _approve(project, _metadataURI, data);
    }

    function update(address project, string memory _metadataURI, bytes memory data) external {
        _update(project, _metadataURI, data);
    }

    function allocate(
        address[] memory recipients,
        uint256[] memory amounts,
        address token,
        bytes[] memory data
    ) external nonReentrant {
        require(
            token == config.allocationToken || token == config.distributionToken,
            "Allocations to projects must be allocation or distribution token"
        );

        _allocate(recipients, amounts, token, data);
    }

    function distribute(
        address[] memory recipients,
        uint256[] memory amounts,
        address token,
        bytes[] memory data
    ) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(token == config.distributionToken, "Distributions must be distribution token");
        _distribute(recipients, amounts, token, data);
    }

    function _beforeAllocate(address recipient, uint256 amount, address token, bytes memory data) internal override {
        require(
            recipient == address(this) || registrations[recipient].status == Status.approved,
            "Recipient is not approved"
        );

        if (token == config.distributionToken) {
            uint256 balance = IERC20(token).balanceOf(address(this));
            require(config.maxAmount == 0 || amount + balance <= config.maxAmount  , "Max amount reached");
        }
    }

    function _beforeDistribute(address recipient, uint256 amount, address token, bytes memory data) internal override {
        require(registrations[recipient].status == Status.approved, "Recipient is not approved");
    }
}
