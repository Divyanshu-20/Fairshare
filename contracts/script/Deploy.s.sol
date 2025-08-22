//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import {Fairshare} from "../src/fairshare.sol";

contract DeployFairShare is Script {
    function run() external returns (Fairshare fairshare) {
        // Anvil account #0 private key
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

        vm.startBroadcast(deployerPrivateKey);
        fairshare = new Fairshare();
        vm.stopBroadcast();

        console.log("Fairshare deployed to:", address(fairshare));
    }
}
