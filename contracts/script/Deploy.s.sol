//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import {Fairshare} from "../src/fairshare.sol";

contract DeployFairShare is Script {
    function run() external returns (Fairshare fairshare) {
        // Anvil account #0 private key
        uint256 deployerPrivateKey = vm.envUint("ANVIL_KEY");

        vm.startBroadcast(deployerPrivateKey);
        fairshare = new Fairshare();
        vm.stopBroadcast();

        console.log("Fairshare deployed to:", address(fairshare));
    }
}
