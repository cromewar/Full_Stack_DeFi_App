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
    //mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;

    //mapping address -> uint256
    mapping(address => uint256) public uniqueTokensStaked;

    //Array for the allowed token addresses
    address[] public allowedTokens;

    //Array for all the stakers
    address[] public stakers;

    // reward the user fot stake them tokens
    function issueTokens() public onlyOwner {
        // needs a list of all the stakers
    }

    function stakeTokens(uint256 _amount, address _token) public {
        // what token can they stake?
        // how much can they stake?
        require(_amount > 0, "Amount must be more tha 0");
        // require the token is on the allowed list
        require(
            tokenIsAllowed(_token),
            "This token is not allowed at the moment"
        );
        // transferFrom (IERC20 Token standard from openzeppelin)
        // transferFrom takes: address sender, address recipient, uint256 amount
        // we send from the user account address to this contract.
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        // we need to track the amount of the tokens the user send
        // how many unique tokens the user has?
        updateUniqueTokensStaked(msg.sender, _token);
        // add to whatever the user already had before the new staked amount
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;

        // check if is the first time the staker add funds to the pool and add it to the stakers list
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        // have an idea about how many unique tokens the user has
        // if the user has one unique token is added to the list,
        // if has more means them already been added

        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    // Add allowed tokens to the list (just the owner should do this)
    function addAllowedToken(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    //Verify if the token is on the allowed list

    function tokenIsAllowed(address _token) public view returns (bool) {
        // loop the allowedTokens list a look if the token is there
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
