import Box from '@mui/material/Box';


interface BalanceMsgProps {
    label: string
    amount: number
    tokenImgSrc: string
}

export const BalanceMsg = ({ label, amount, tokenImgSrc }: BalanceMsgProps) => {

    const sx = {
        container: {
            display: "inline-grid",
            gridTemplateColumns: "auto auto auto",
            alignItems: "center",
            gap: 1
        },
        tokenImg: {
            width: "32px"
        },
        amount: {
            fontWeight: 700
        }

    }

    return (
        <Box component="div"
            sx={sx.container}>
            <div>{label}</div>
            <Box component="div" sx={sx.amount}>{amount}</Box>
            <img src={tokenImgSrc} alt="token logo" style={sx.tokenImg}></img>
        </Box>
    )

}