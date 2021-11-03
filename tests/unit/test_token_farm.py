from scripts.helpful_sctips import get_account
from brownie import TokenFarm


def test_can_add_token():
    account = get_account()
    token_farm = TokenFarm.deploy({"from": account})
    token_farm.addAllowedToken(account.address)
    assert token_farm.allowedTokens(0) == account.address


def test_token_is_allowed():
    account = get_account()
    token_farm = TokenFarm.deploy({"from": account})
    token_farm.addAllowedToken(account.address)
    tx = token_farm.tokenIsAllowed(get_account(index=2))
    assert tx == False
