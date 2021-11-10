import { Token } from "../Main"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import Box from '@mui/material/Box'
import { Button, Input, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from "react"
import { useStakeTokens } from "../../hooks/useStakeTokens"
import { utils } from "ethers"

interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token }: StakeFormProps) => {


    const sx = {
        container: {
            margin: 10,

        }
    }

    const { address: tokenAddres, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(tokenAddres, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0


    const { notifications } = useNotifications()


    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)

    }

    const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(tokenAddres)

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const isMining = approveAndStakeErc20State.status === "Mining"


    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve ERC20 transfer").length > 0) {
            console.log("approved")
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake Tokens").length > 0) {
            console.log("staked")

        }


    }, [notifications])

    return (
        <>
            <Input
                onChange={handleInputChange}
            />
            <Button variant="contained" color="secondary" size="large" style={sx.container}
                onClick={handleStakeSubmit}
                disabled={isMining}
            >
                {isMining ? <CircularProgress size={26} color="secondary" /> : "Stake!!!"}

            </Button>
        </>

    )

}