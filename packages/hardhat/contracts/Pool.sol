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

    event Deployed(string name, address indexed owner, string schema, PoolConfig config);
    event Allocate(address indexed from, address indexed to, uint256 amount, address token, bytes data);
    event Register(address indexed project, address indexed owner, string metadataURI, bytes data);
    event Approve(address indexed project, address indexed approver, string metadataURI, bytes data);
    event Reject(address indexed project, address indexed rejecter, string metadataURI, bytes data);
    event Update(address indexed project, address indexed updater, string metadataURI, bytes data);


    function initialize(PoolConfig memory config, bytes memory data) external;

    function _register(address project, string memory metadataURI, bytes memory data) external;
    function _update(address project, string memory metadataURI, bytes memory data) external;
    function _approve(address project, string memory metadataURI, bytes memory data) external;
    function _allocate(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        external;
    function _distribute(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
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

    mapping(address => Registration) public registrations;


    constructor(string memory _name, string memory _schema, PoolConfig memory _config) {
        // strategyName = _name;
        // schema = _schema;
        // metadataURI = _metadataURI;
        // id = keccak256(abi.encode(strategyName));
        emit Deployed(_name, msg.sender, _schema, _config);
    }


  function initialize(PoolConfig memory _config, bytes memory ) external virtual {
    require(!_initialized, "Already initialized");
    _initialized = true;
    config = _config;
  }

    // MetadataURI contain details about project application
    function _register(address project, string memory _metadataURI, bytes memory data) public {
        require(registrations[project].owner == address(0), "Already registered");
        registrations[project] = Registration(Status.pending, msg.sender, _metadataURI, data);
        emit Register(project, msg.sender, _metadataURI, data);
    }

    function _reject(address project, string memory _metadataURI, bytes memory data) public virtual {
        Registration storage registration = registrations[project];
        require(registration.status == Status.pending || registration.status == Status.approved, "Already deregistered");
        registration.status = Status.rejected;
        emit Reject(project, msg.sender, _metadataURI, data);
    }

    // MetadataURI can contain Review information
    function _approve(address project, string memory _metadataURI, bytes memory data) public virtual {
        Registration storage registration = registrations[project];
        require(registration.status == Status.pending, "Already approved or not registered yet");
        registration.status = Status.approved;
        // MetadataURI here is Review information so we don't need to store it
        emit Approve(project, msg.sender, _metadataURI, data);
    }

    function _update(address project, string memory _metadataURI, bytes memory data) public {
        require(registrations[project].status == Status.pending, "Already approved or not registered yet");
        require(registrations[project].owner == msg.sender, "Must be owner to update");
        registrations[project].metadataURI = _metadataURI;
        registrations[project].data = data;
        emit Update(project, msg.sender, _metadataURI, data);
    }

    // Allocate tokens to recipients (transfers tokens from caller to recipients)
    // This can be used to transfer tokens to projects, or the contract itself to fund with matching funds for example
    function _allocate(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        public
        virtual
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
        public
        virtual
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
}
