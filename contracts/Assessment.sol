// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Fund(uint256 amount);
    event Redeem(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function fund(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Fund(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 redeemAmount);

    function redeem(uint256 _redeemAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _redeemAmount) {
            revert InsufficientBalance({
                balance: balance,
                redeemAmount: _redeemAmount
            });
        }

        // redeem the given amount
        balance -= _redeemAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _redeemAmount));

        // emit the event
        emit Redeem(_redeemAmount);
    }
}
