//SPDX-License-Identifier: MIT

// This contract shoulld be able to:
// stakeTokens
// unStakeTokens
// issueTokens
// addAllowedTokens
// getEthValue

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenFarm is Ownable {
    address[] public allowedTokens;

    function stakeTokens(uint256 _amount, address _token) public {
        // What tokens can users stake?
        // how much can the users stake?

        require(_amount > 0, "Amount must be more than 0");
        require(tokenIsAllowed(_token), "Token is currenty not allowed");
        // Call transferFrom (ERC20)
    }

    function addAllowdTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public view returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == _token) {
                return true;
            }
        }
        return false;
    }
}
