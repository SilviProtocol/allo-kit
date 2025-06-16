// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct PoolConfig {
    address owner;
    address[] admins;
    address allocationToken;
    address distributionToken;
    uint256 maxAmount;
    uint64[] timestamps;
    string metadataURI;
}

interface IPool {
    enum Status {
        pending,
        approved,
        rejected
    }

    struct Registration {
        Status status;
        address owner;
        string metadataURI;
        bytes data; // Data can contain information that can be accessed later
    }

    function schema() external view returns (string memory);

    event Deployed(string name, address indexed owner, string schema, string metadataURI);
    event Allocate(address indexed from, address indexed to, uint256 amount, address token, bytes data);
    event Register(address indexed project, address indexed owner, string metadataURI, bytes data);
    event Review(address indexed project, uint8 status, address indexed approver, string metadataURI, bytes data);
    event Update(address indexed project, address indexed updater, string metadataURI, bytes data);
    event Configure(address indexed updater, PoolConfig config);

    function initialize(PoolConfig memory config, bytes memory data) external;
    function configure(address updater, PoolConfig memory config) external;
    function register(address project, string memory metadataURI, bytes memory data) external;
    function update(address project, string memory metadataURI, bytes memory data) external;
    function review(address project, uint8 status, string memory metadataURI, bytes memory data) external;
    function allocate(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        external;
    function distribute(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        external;
}

/*
Types of Pools:
DirectGrants - pool manager transfer funds directly to projects
RetroFunding - selected voters vote on projects and pool gets distributed based on the votes
QuadraticFunding - people vote with money tokens and get matching funds from the pool based on quadratic formula
DedicatedDomainAllocation - selected panel of domain experts decide what projects receive matching funds
RFPs
Bounties
Crowdfunding
*/
contract Pool is IPool {
    bool private _initialized;
    PoolConfig public config;
    string public schema;

    mapping(address => Registration) public registrations;

    /**
     * @param _name Name of the Pool Strategy
     * @param _schema Schema of the Pool (uint256 param, string anotherParam) - can be used for passing custom data
     * @param _metadataURI Metadata URI of the Pool (title, description, etc.)
     */
    constructor(string memory _name, string memory _schema, string memory _metadataURI) {
        // Emit an event for the Indexer so Pools can be created with this Strategy
        emit Deployed(_name, msg.sender, _schema, _metadataURI);
        schema = _schema;
    }

    function initialize(PoolConfig memory _config, bytes memory data) public virtual {
        require(!_initialized, "Already initialized");
        _initialized = true;
        config = _config;
    }

    function _configure(address _updater, PoolConfig memory _config) internal virtual {
        // Logic for updating the Pool handled in calling contract
        config = _config;
        emit Configure(_updater, _config);
    }

    // MetadataURI contain details about project application
    function _register(address project, string memory _metadataURI, bytes memory data) internal {
        require(registrations[project].owner == address(0), "Already registered");
        registrations[project] = Registration(Status.pending, msg.sender, _metadataURI, data);
        emit Register(project, msg.sender, _metadataURI, data);
    }

    function _review(address project, uint8 status, string memory _metadataURI, bytes memory data) internal {
        Registration storage registration = registrations[project];
        registration.status = Status(status);
        // MetadataURI can contain information about review, or potential rejection reason
        emit Review(project, status, msg.sender, _metadataURI, data);
    }

    function _update(address project, string memory _metadataURI, bytes memory data) internal {
        require(registrations[project].owner == msg.sender, "Must be owner to update");
        require(registrations[project].status != Status.approved, "Already approved");
        registrations[project].metadataURI = _metadataURI;
        registrations[project].data = data;
        emit Update(project, msg.sender, _metadataURI, data);
    }

    // Allocate tokens to recipients (transfers tokens from caller to recipients)
    // This can be used to transfer tokens to projects, or the contract itself to fund with matching funds for example
    function _allocate(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        internal
    {
        uint256 length = recipients.length;
        require(length > 0 && length == amounts.length, "Mismatched lengths");

        for (uint256 i = 0; i < length; i++) {
            bytes memory _data = i < data.length ? data[i] : bytes("");
            require(recipients[i] != address(0), "Recipient is zero address");
            require(amounts[i] > 0, "Amount is zero");
            _beforeAllocate(recipients[i], amounts[i], token, _data);
            IERC20(token).transferFrom(msg.sender, recipients[i], amounts[i]);
            emit Allocate(msg.sender, recipients[i], amounts[i], token, _data);
        }
    }

    // Distribute tokens to recipients (transfers tokens from the contract to recipients)
    // Can be used to distribute matching funds to projects
    function _distribute(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        internal
    {
        uint256 length = recipients.length;
        require(length > 0 && length == amounts.length, "Mismatched lengths");

        for (uint256 i = 0; i < length; i++) {
            bytes memory _data = i < data.length ? data[i] : bytes("");
            require(recipients[i] != address(0), "Recipient is zero address");
            require(
                amounts[i] > 0 && amounts[i] <= IERC20(token).balanceOf(address(this)),
                "Amount is zero or exceeds balance"
            );
            _beforeDistribute(recipients[i], amounts[i], token, _data);
            IERC20(token).transfer(recipients[i], amounts[i]);
            emit Allocate(address(this), recipients[i], amounts[i], token, _data);
        }
    }

    function _beforeAllocate(address recipient, uint256 amount, address token, bytes memory data) internal virtual {}
    function _beforeDistribute(address recipient, uint256 amount, address token, bytes memory data) internal virtual {}

    function configure(address updater, PoolConfig memory _config) external virtual override {
        _configure(updater, _config);
    }

    function register(address project, string memory metadataURI, bytes memory data) external virtual override {
        _register(project, metadataURI, data);
    }

    function update(address project, string memory metadataURI, bytes memory data) external virtual override {
        _update(project, metadataURI, data);
    }

    function review(address project, uint8 status, string memory metadataURI, bytes memory data)
        external
        virtual
        override
    {
        _review(project, status, metadataURI, data);
    }

    function allocate(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        external
        virtual
        override
    {
        _allocate(recipients, amounts, token, data);
    }

    function distribute(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        external
        virtual
        override
    {
        _distribute(recipients, amounts, token, data);
    }
}
