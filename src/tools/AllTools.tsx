import { swap } from "./swap/swap";
import { bridge } from "./bridge/bridge";
import { useWallets } from "@privy-io/react-auth";
import { depositSilo } from "./silo/depositSilo";

export const AllTools = () => {
    const {ready, wallets} = useWallets();
    const wallet = wallets[0];

    console.log("Ready", ready);
    console.log("Wallets", wallets);
    console.log("wallet address", wallet?.address);
    return (
        <div>
            <h1 className="text-2xl font-bold">All Tools</h1>
            <div className="flex flex-row space-x-4">
                <div className="bg-gray-200 p-4 rounded-lg w-1/3">
                    <h2 className="text-lg font-bold">Swap</h2>
                    <p>Swap tokens on the blockchain</p>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg w-1/3">
                    <h2 className="text-lg font-bold">Yield</h2>
                    <p>Yield farming on the blockchain</p>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg w-1/3">
                    <h2 className="text-lg font-bold">Bridge</h2>
                    <p>Bridge tokens between chains</p>
                </div>
            </div>
            <button onClick={() => swap({ walletClient: wallet, chainId: 146, tokenIn: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894", tokenOut: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE", amountIn: "0.1"})}>Swap</button>
            <button className="button" onClick={() => bridge({walletClient: wallet, srcChainId: 137, dstChainId: 146, srcChainTokenIn: "0x0000000000000000000000000000000000000000", srcAmountIn: "3", dstChainTokenOut: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE"})}>Bridge</button>
            <button onClick={() => depositSilo({walletClient: wallet, vaultAddress: "0x4E216C15697C1392fE59e1014B009505E05810Df", amount: "0.001", isCollateral: true})}>Deposit Silo</button>
        </div>
    )
}