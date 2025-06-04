// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {Pool, PoolConfig} from "../Pool.sol";

contract QuadraticFunding is Pool, Context, AccessControl, ReentrancyGuard {

    constructor(string memory _name, string memory _schema, PoolConfig memory _config) Pool(_name, _schema, _config) {
        // strategyName = _name;
        // schema = _schema;
        // metadataURI = _metadataURI;
        // id = keccak256(abi.encode(strategyName));
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

}
