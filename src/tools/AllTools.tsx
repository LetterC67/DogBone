import { swap } from "./swap/swap";
import { bridge } from "./bridge/bridge";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { depositSilo } from "./silo/depositSilo";
import { wrapNative } from "./utils/wrapNative";
import { depositLST } from "./lst/DepositLST";
import { depositIchi } from "./ichi/depositIchi";
import { depositIchiLPBeefy } from "./beefy/depositIchiLPBeefy";
import { depositMachFi } from "./machfi/depositMachFi";
export const AllTools = () => {
    const {ready, wallets} = useWallets();
    const {exportWallet} = usePrivy();
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
            <button onClick={() => wrapNative({walletClient: wallet, chainId: 146, amount: "0.01"})}>Wrap Native</button>
            <button onClick={() => depositLST({walletClient: wallet, vaultAddress: "0xe25A2B256ffb3AD73678d5e80DE8d2F6022fAb21", amount: "0.001"})}>Origin Sonic</button>
            <button onClick={() => depositLST({walletClient: wallet, vaultAddress: "0xE5DA20F15420aD15DE0fa650600aFc998bbE3955", amount: "0.01"})}>Beets Staked Sonic</button>
            <button onClick={() => depositIchi({walletClient: wallet, vaultAddress: "0xa68D5DbAe00960De66DdEaD4d53faea39f21983b", amount: "0.002"})}>Deposit Ichi</button>
            <button onClick={() => depositIchiLPBeefy({walletClient: wallet, vaultAddress: "0x406568d72B086fA9Ad3ec2512f05BaFB24403911", amount: "0.001"})}>Deposit Beefy</button>
            <button onClick={exportWallet}>Export Wallet</button>
            <button onClick={() => depositMachFi({walletClient: wallet, vaultAddress: "0x9F5d9f2FDDA7494aA58c90165cF8E6B070Fe92e6", amount: "0.001"})}>Deposit MachFi Native</button>
            <button onClick={() => depositMachFi({walletClient: wallet, vaultAddress: "0xbAA06b4D6f45ac93B6c53962Ea861e6e3052DC74", amount: "0.0001"})}>Deposit MachFi stS</button>
        </div>
    )
}