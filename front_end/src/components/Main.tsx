import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../img/dapp.png"
import eth from "../img/eth.png"
import dai from "../img/dai.png"
import { YourWallet } from "./yourWallet/"
import { Box } from '@mui/material'


export type Token = {
    image: string
    address: string
    name: string
}



export const Main = () => {


    // Show the token values from the wallet

    // Get the address of different tokens
    // Get the balance of the users wallet

    const { chainId, error } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"

    // Getting the addresses for the tokens
    // Getting the DappTokenAddress from the Map.json at deployment.
    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    // Getting the eth toekens from brownie-config
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

    const supportedTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }
    ]


    return (
        <Box>

            <Box component="div" sx={{
                color: "white",
                textAlign: "center",
                padding: 4
            }}>
                <h2> Dapp Token App</h2>
            </Box>
            <YourWallet supportedTokens={supportedTokens} />
        </Box>
    )
}