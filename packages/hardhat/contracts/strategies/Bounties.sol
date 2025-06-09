// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {Pool, PoolConfig} from "../Pool.sol";

/*
Bounty Strategy

- Each bounty is a Bounty contract that can be funded
- Users can apply by calling register
- Bounty admin can approve and pay out

*/

contract Bounty is Pool, Context, AccessControl, ReentrancyGuard {
    constructor(string memory _name, string memory _schema, PoolConfig memory _config) Pool(_name, _schema, _config) {}

    function initialize(PoolConfig memory _config, bytes calldata data) public override {
        // super.initialize(_config, data);
        _grantRole(DEFAULT_ADMIN_ROLE, _config.owner);
        for (uint256 i = 0; i < _config.admins.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, _config.admins[i]);
        }
    }

    function review(address project, uint8 status, string memory _metadataURI, bytes memory data) public {
        _review(project, status, _metadataURI, data);

        // If the bounty is approved, immediately transfer the payout
        if (status == 1) {
            // Immediately transfer the payout
            uint256 amount = IERC20(config.distributionToken).balanceOf(address(this));

            address[] memory recipients = new address[](1);
            uint256[] memory amounts = new uint256[](1);
            bytes[] memory dataArr = new bytes[](1);
            recipients[0] = project;
            amounts[0] = amount;
            dataArr[0] = data;
            _distribute(recipients, amounts, config.distributionToken, dataArr);
        }
    }
}
