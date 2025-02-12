import { useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useState } from "react";

function Bridge() {
    const { wallets } = useWallets();
    const [provider, setProvider] = useState<any>(null);
    const [widget, setWidget] = useState<any>(null);

    useEffect(() => {
        const fetchProvider = async () => {
            console.log(wallets);
            if (wallets.length == 0) return;
            const provider = await wallets[0].getEthereumProvider();
            setProvider(provider);
        };
        fetchProvider();
    }, [wallets]);

    useEffect(() => {
        if(!provider || !widget) return;
        widget.setExternalEVMWallet({
            provider: provider,
            name: 'Privy Embedded Wallet',
            imageSrc: 'URL_TO_WALLET_ICON', // Optional
        });
    }, [provider, widget]);

    useEffect(() => {
        let valid = true;

        const fetchWidget = async () => {
            if (!window.deBridge) return;
            if (!valid) return;
            const _widget = await window.deBridge.widget({"v":"1","element":"debridgeWidget","title":"","description":"","width":"600","height":"600","r":null,"supportedChains":"{\"inputChains\":{\"1\":\"all\",\"10\":\"all\",\"56\":\"all\",\"100\":\"all\",\"137\":\"all\",\"146\":\"all\",\"250\":\"all\",\"388\":\"all\",\"998\":\"all\",\"1088\":\"all\",\"2741\":\"all\",\"4158\":\"all\",\"7171\":\"all\",\"8453\":\"all\",\"42161\":\"all\",\"43114\":\"all\",\"59144\":\"all\",\"80094\":\"all\",\"7565164\":\"all\",\"245022934\":\"all\"},\"outputChains\":{\"146\":\"all\"}}","inputChain":56,"outputChain":146,"inputCurrency":"","outputCurrency":"","address":"","showSwapTransfer":true,"amount":"","outputAmount":"","isAmountFromNotModifiable":false,"isAmountToNotModifiable":false,"lang":"en","mode":"deswap","isEnableCalldata":false,"styles":"eyJwcmltYXJ5IjoiI2VjZWNlYyIsInNlY29uZGFyeSI6IiMyYzI2MjgiLCJwcmltYXJ5QnRuQmciOiIjNkM1OTY0Iiwic2Vjb25kYXJ5QnRuQmciOiIjMmMyNjI4In0=","theme":"dark","isHideLogo":false,"logo":"","disabledWallets":[],"disabledElements":[]});
            setWidget(_widget);
        };
        fetchWidget();
    
        return () => {
            valid = false;
        };
    }, [window.deBridge]);
    
    return (
        <div id="debridgeWidget"></div>
    )
}

export default Bridge;