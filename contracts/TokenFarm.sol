//SPDX-License-Identifier: MIT

// This contract shoulld - be able to:
// stakeTokens - DONE
// unStakeTokens - DONE
// issueTokens - DONE
// addAllowedTokens - DONE
// getEthValue - DONE

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    //mapping token address -> staker address -> amount
    // maps the how much tokens the user has based on the token address and the user address
    mapping(address => mapping(address => uint256)) public stakingBalance;

    //mapping address -> uint256
    //maps how much different tokens the user has
    mapping(address => uint256) public uniqueTokensStaked;

    //mapping for the pricefeed address
    mapping(address => address) public tokenPriceFeedMapping;

    //Array for the allowed token addresses
    address[] public allowedTokens;

    //Array for all the stakers
    address[] public stakers;

    // Dapp token for rewards
    IERC20 public dappToken;

    // constructor / dapptoken address

    constructor(address _dappTokenAddress) {
        dappToken = IERC20(_dappTokenAddress);
    }

    // assign the address of the token to the addrres of the priceFeed
    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    // reward the user fot stake them tokens
    function issueTokens() public onlyOwner {
        // needs a list of all the stakers
        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            // send them a toke reward
            // dappToken.transfer(recipient, amount);
            // based on their total value locked
            dappToken.transfer(recipient, userTotalValue);
        }
    }

    // get user total value

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        // make sure the user has staked tokens
        require(uniqueTokensStaked[_user] > 0, "No tokens staked!");
        // loop through the allowed tokens and define how much the user has of each one.
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            // add the total value the amount of the user has
            totalValue =
                totalValue +
                getUserSingleTokenValue(
                    _user,
                    allowedTokens[allowedTokensIndex]
                );
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        // if staked 1 ETH and the price is 2000, make sure it returns 2000
        // if staked DAI and the price is 200, make usre it returns 200

        // If the user has not staked the current coin it returns zero
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        }

        // get the price of the single token and multiply by the stakingBalance[_token][user]
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        // returns the balance of the token based on the latest priceFeed
        // 1000000000000000000 ETH
        // example 100000000 ETH
        // ETH/USD -> 100
        // 10 * 100 = 1000
        return ((stakingBalance[_token][_user] * price) / 100**decimals);
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        //using chainlnk priceFeeds
        //map each token with its associated price feed address.
        // use aggregator v3 interface
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        // Get the latest price and it's decimals
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
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

    function unstakeTokens(address _token) public {
        // Fetch the staking balance of the user
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Staking balance cannot be zero");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
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
