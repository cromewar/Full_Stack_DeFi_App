from brownie import network, config, accounts

LOCAL_BLOCKCHAIN_ENVIRONMETS = ["development", "mainnet-fork"]
FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-fev"]


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMETS
        or network.show_active() in FORKED_LOCAL_ENVIRONMENTS
    ):
        return accounts[0]
    return network.add(config["wallets"]["from_key"])
