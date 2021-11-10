import { Token } from "../Main"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import Box from '@mui/material/Box'
import { Button, Input, CircularProgress, Snackbar, Alert } from '@mui/material';
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
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStakeTokenSuccess, setStakeTokenSuccess] = useState(false)
    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setStakeTokenSuccess(false)
    }


    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve ERC20 transfer").length > 0) {
            setShowErc20ApprovalSuccess(true)
            setStakeTokenSuccess(false)
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake Tokens").length > 0) {
            setShowErc20ApprovalSuccess(false)
            setStakeTokenSuccess(true)

        }


    }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess])

    return (
        <>
            <div>
                <Input
                    onChange={handleInputChange}
                />
                <Button variant="contained" color="secondary" size="large" style={sx.container}
                    onClick={handleStakeSubmit}
                    disabled={isMining}
                >
                    {isMining ? <CircularProgress size={26} color="secondary" /> : "Stake!!!"}

                </Button>
            </div>
            <Snackbar open={showErc20ApprovalSuccess} autoHideDuration={5000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    ERC-20 token transer approved! Now approve the 2nd transaction
                </Alert>
            </Snackbar>
            <Snackbar open={showStakeTokenSuccess} autoHideDuration={5000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Token Staked!
                </Alert>
            </Snackbar>
        </>

    )

}