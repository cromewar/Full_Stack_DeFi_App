import { useEthers } from "@usedapp/core"
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';





export const Header = () => {

    const sx = {
        container: {
            display: "flex",
            justifyContent: "flex-end",
            padding: 4,
            gap: 1
        },
        butt: {
            color: "white",
            border: "1px solid white"
        }

    }

    const { account, activateBrowserWallet, deactivate } = useEthers()


    // set the variable if the account is defined
    const isConnected = account !== undefined


    return (

        <Box component="div"
            sx={sx.container}>
            {isConnected ? (
                <Button onClick={deactivate} variant="outlined" color="secondary" sx={sx.butt}>
                    Disconnect
                </Button>
            ) : (
                <Button onClick={() => activateBrowserWallet()} variant="contained" color="secondary">
                    Connect
                </Button>
            )}

        </Box>
    )
}