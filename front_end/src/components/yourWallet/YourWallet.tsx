import { Token } from "../Main"

interface YourWalletProps {
    supportedTokens: Array<Token>
}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    return (<div>I'm Your wallet</div>)
}