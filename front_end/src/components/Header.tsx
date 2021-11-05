import {useEthers} from "@usedapp/core"
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';




export const Header = () => {

    
    
    const {account, activateBrowserWallet, deactivate} = useEthers()


    // set the variable if the account is defined
    const isConnected = account !== undefined


    return (
            
        <Box component="span" 
        sx={{ 
            display:"flex",
            justifyContent: "flex-end",
            padding: 4,
            gap: 1
             }}>
        {isConnected ? (
            <Button onClick={deactivate} variant="contained">
                Disconnect
            </Button>
        ):(
            <Button onClick={() => activateBrowserWallet()} variant="contained">
                Connect
            </Button>
        )}

      </Box>
    )
}