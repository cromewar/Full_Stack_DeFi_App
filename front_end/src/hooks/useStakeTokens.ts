import {useContractFunction, useEthers} from '@usedapp/core'
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants, utils} from "ethers"
// import {Contract} from '@ethersproject/contracts'
import {Contract} from '@usedapp/core/node_modules/@ethersproject/contracts'
import {useEffect, useState} from "react"

export const useStakeTokens = (tokenAddress: string) => {
    // chainId 
    const {chainId} = useEthers()
    // abi
    const {abi} = TokenFarm
    // address
    // const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    // approve
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    // approve
    const { send: approveErc20Send, state: approveAndStakeErc20State } =
        useContractFunction(erc20Contract, "approve", {
            transactionName: "Approve ERC20 transfer",
        })
    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }

    const {send: stakeSend, state: stakeState} = useContractFunction(tokenFarmContract, "stakeTokens", {transactionName: "Stake Tokens"})

    const [amountToStake, setAmountToStake] = useState("0")

    //useEffect
    useEffect(() => {
        if(approveAndStakeErc20State.status === "Success"){
            // stake function
            stakeSend(amountToStake, tokenAddress)
        }
    }, [approveAndStakeErc20State, amountToStake ,tokenAddress])

    const [state, setState] = useState(approveAndStakeErc20State)

    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success"){
            setState(stakeState)
        }else{
            setState(approveAndStakeErc20State)
        }
    }, [approveAndStakeErc20State, stakeState])

    return {approveAndStake, state}

}