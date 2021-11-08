import { Token } from "../Main"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import Box from '@mui/material/Box'
import { Button } from '@mui/material';

interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddres, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(tokenAddres, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    return (
        <Box component="div">
            <Button variant="contained" color="secondary" size="large">Stake!!</Button>
        </Box>
    )

}