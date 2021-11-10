import { Token } from "../Main"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import Box from '@mui/material/Box'
import { Button, Input } from '@mui/material';
import React, { useState } from "react"
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
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)

    }

    const { approveAndStake, approveErc20State } = useStakeTokens(tokenAddres)

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    return (
        <>
            <Input
                onChange={handleInputChange}
            />
            <Button variant="contained" color="secondary" size="large" style={sx.container}
                onClick={handleStakeSubmit}>Stake!!</Button>
        </>

    )

}