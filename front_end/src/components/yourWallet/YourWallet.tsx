import { Token } from "../Main"
import Box from '@mui/material/Box';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from '@mui/material/Tab';
import React, { useState } from "react"
import { WalletBalance } from "./WalletBalance"
import { StakeForm } from "./StakeForm"


interface YourWalletProps {
    supportedTokens: Array<Token>
}



export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }


    return (
        <Box component="div">
            <h1 className="head">Your Wallet!</h1>
            <Box className="box">
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} indicatorColor="secondary" textColor="secondary" aria-label="stake from tabs">
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name}
                                    value={index.toString()}
                                    key={index} />
                            )
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div className="tabContent">
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                                    <StakeForm token={supportedTokens[selectedTokenIndex]} />
                                </div>

                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>
        </Box>
    )
}