//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
contract WhiteList {
    // masx number of addresses allowed
    uint8 public maxWhitelistedAddresses ;
    
    // create a mapping of whitelisted addresses
    // if an address is whitelistedm we would set it to truem it is fasel by default
    mapping(address => bool) public whitelistedAddresses ; 

    // this variable use to keep tracj of how many address have been whitelisted
    uint8 public numAddressesWhitelisted ; 

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses ; 

    }

    // this function add the sender address to the whitlist
    function addAddressToWhiteList()  public {
        // check if the user has already been whitelisted
        require(!whitelistedAddresses[msg.sender], "sender has already been white listed!");

        // check if the numAddress < max ; if not throw an error
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses can be added, limit reached bra");

        // add the adress into the whit list
        whitelistedAddresses[msg.sender] = true ;
        numAddressesWhitelisted += 1 ;
    }
}