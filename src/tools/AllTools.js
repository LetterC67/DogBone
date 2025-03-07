import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { swap } from './swap/swap';
import { bridge } from './bridge/bridge';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { depositSilo } from './silo/depositSilo';
import { wrapNative } from './utils/wrapNative';
import { depositLST } from './lst/DepositLST';
import { depositIchi } from './ichi/depositIchi';
import { depositIchiLPBeefy } from './beefy/depositIchiLPBeefy';
import { depositMachFi } from './machfi/depositMachFi';
import { depositRingsNative, depositRingsSC } from './rings/depositRings';
import { DepositLToken } from './yel/depositLToken';
import { depositEggs } from './eggs/depositEggs';
import { depositEggsLeverage } from './eggs/depositEggsLeverage';
import { getLSTAPY } from './lst/getLSTAPY';
import { getBeefyIchiAPR } from './beefy/getBeefyIchiAPR';
import { getSiloAPR } from './silo/getSiloAPR';
import { getMachFiAPR } from './machfi/getMachFiAPR';
import { getLTokenAPY } from './yel/getLTokenAPY';
import { viewLSTPosition } from './lst/viewLSTPosition';
import { viewSiloPosition } from './silo/viewSiloPosition';
import { viewMachFiPosition } from './machfi/viewMachFiPosition';
import { viewBeefyIchiLPPosition } from './beefy/viewBeefyIchiLPPosition';
import { viewLTokenPosition } from './yel/viewLTokenPosition';
import { viewRingsPosition } from './rings/viewRingsPosition';
import { getIchiAPR } from './ichi/getIchiAPR';
import { viewIchiPosition } from './ichi/viewIchiPosition';
import { getVaultAPR, getVaultPosition, depositVault, zap, bridgeAndZap, withdrawVault } from './ToolAPI';
import { getTokenAddressBySymbol } from './utils/getTokenAddressBySymbol.ts';
import { getTokenPriceByAddress, getTokenPriceBySymbol } from './utils/getTokenPrice.ts';
import { dakmim } from './ichi/test.ts';
import { getSonicPoints } from './utils/getSonicPoints.ts';
import { getRingsPoints } from './utils/getRingsPoints.ts';
import { depositPendle } from './pendle/depositPendle.ts';
import { viewPendleAPY } from './pendle/viewPendleAPR.ts';
import { viewPendlePosition } from './pendle/viewPendlePosition.ts';
import { depositAave } from './aave/depositAave.ts';
import { getAaveAPY } from './aave/getAaveAPY.ts';
import { viewAavePosition } from './aave/viewAavePosition.ts';
import { viewVicunaPosition } from './vicuna/viewVicunaPosition.ts';
import { getVicunaAPY } from './vicuna/getVicunaAPY.ts';
import { depositVicuna } from './vicuna/depositVicuna.ts';
import { withdrawAave } from './aave/withdrawAave.ts';
import { withdrawVicuna } from './vicuna/withdrawVicuna.ts';
import { withdrawSilo } from './silo/withdrawSilo.ts';
import { withdrawMachFi } from './machfi/withdrawMachFi.ts';
import { withdrawPendle } from './pendle/withdrawPendle.ts';
export const AllTools = () => {
    const { ready, wallets } = useWallets();
    const { exportWallet } = usePrivy();
    const wallet = wallets[0];
    console.log('Ready', ready);
    console.log('Wallets', wallets);
    console.log('wallet address', wallet?.address);
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "All Tools" }), _jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => swap({
                            walletClient: wallet,
                            chainId: 146,
                            tokenIn: '0x29219dd400f2Bf60E5a23d13Be72B486D4038894',
                            tokenOut: '0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE',
                            amountIn: '0.1',
                        }), children: "Swap" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => bridge({
                            walletClient: wallet,
                            srcChainId: 137,
                            dstChainId: 146,
                            srcChainTokenIn: '0x0000000000000000000000000000000000000000',
                            srcAmountIn: '3',
                            dstChainTokenOut: '0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE',
                        }), children: "Bridge" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositSilo({
                            walletClient: wallet,
                            vaultAddress: '0x4E216C15697C1392fE59e1014B009505E05810Df',
                            amount: '0.001',
                        }), children: "Deposit Silo" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => wrapNative({ walletClient: wallet, chainId: 146, amount: '0.01' }), children: "Wrap Native" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositLST({
                            walletClient: wallet,
                            vaultAddress: '0xe25A2B256ffb3AD73678d5e80DE8d2F6022fAb21',
                            amount: '0.001',
                        }), children: "Origin Sonic" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositLST({
                            walletClient: wallet,
                            vaultAddress: '0xE5DA20F15420aD15DE0fa650600aFc998bbE3955',
                            amount: '0.01',
                        }), children: "Beets Staked Sonic" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositIchi({
                            walletClient: wallet,
                            vaultAddress: '0xa68D5DbAe00960De66DdEaD4d53faea39f21983b',
                            amount: '0.002',
                        }), children: "Deposit Ichi" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositIchiLPBeefy({
                            walletClient: wallet,
                            vaultAddress: '0x406568d72B086fA9Ad3ec2512f05BaFB24403911',
                            amount: '0.001',
                        }), children: "Deposit Beefy" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: exportWallet, children: "Export Wallet" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositMachFi({
                            walletClient: wallet,
                            vaultAddress: '0x9F5d9f2FDDA7494aA58c90165cF8E6B070Fe92e6',
                            amount: '0.001',
                        }), children: "Deposit MachFi Native" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositMachFi({
                            walletClient: wallet,
                            vaultAddress: '0xbAA06b4D6f45ac93B6c53962Ea861e6e3052DC74',
                            amount: '0.0001',
                        }), children: "Deposit MachFi stS" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositRingsNative({
                            walletClient: wallet,
                            vaultAddress: '0x5e39021Ae7D3f6267dc7995BB5Dd15669060DAe0',
                            amount: '0.001',
                        }), children: "Deposit Rings Native" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositRingsSC({
                            walletClient: wallet,
                            vaultAddress: '0x5e39021Ae7D3f6267dc7995BB5Dd15669060DAe0',
                            amount: '0.001',
                        }), children: "Deposit Rings SC" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => DepositLToken({
                            walletClient: wallet,
                            vaultAddress: '0x555733fBa1CA24ec45e7027E00C4B6c5065BaC96',
                            amount: '0.0005',
                        }), children: "Deposit LToken (Yel)" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositEggs({ walletClient: wallet, amount: '0.001' }), children: "Deposit Eggs" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => depositEggsLeverage({ walletClient: wallet, amount: '0.001' }), children: "Deposit Egs Leverage" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => {
                            getLSTAPY("0xe25A2B256ffb3AD73678d5e80DE8d2F6022fAb21")
                                .then((result) => {
                                console.log(result);
                            })
                                .catch((error) => {
                                console.error(error);
                            });
                        }, children: "Get Origin OS APY" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => {
                            getLSTAPY("0xE5DA20F15420aD15DE0fa650600aFc998bbE3955")
                                .then((result) => {
                                console.log(result);
                            })
                                .catch((error) => {
                                console.error(error);
                            });
                        }, children: "Get Beets stS APY" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => getBeefyIchiAPR('0x95c0C8d19d75faF1A287Cb35028ef92cf5e1Ca56'), children: "Get Beefy Ichi APR" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => getSiloAPR('0xE8e1A980a7fc8D47D337d704FA73FBb81eE55C25'), children: "Get Silo APR" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => getMachFiAPR('0x9F5d9f2FDDA7494aA58c90165cF8E6B070Fe92e6'), children: "Get MachFi APY" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => getLTokenAPY("0x92Dd17b19F74E696502Ee9eD478901F24c5d9a9A"), children: "Get LToken APY" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => viewLSTPosition({ vaultAddress: "0xe25A2B256ffb3AD73678d5e80DE8d2F6022fAb21", userAddress: wallet.address }), children: "Get LST Position" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => viewSiloPosition({ vaultAddress: "0x34BB967d21bfED31F2A2Eb4478A520c254b16d2e", userAddress: wallet.address }), children: "View Silo Position" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => viewMachFiPosition({ vaultAddress: "0xbAA06b4D6f45ac93B6c53962Ea861e6e3052DC74", userAddress: wallet.address }), children: "View MachFi Position" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => viewBeefyIchiLPPosition({ vaultAddress: "0x406568d72B086fA9Ad3ec2512f05BaFB24403911", userAddress: wallet.address }), children: "View Beefy Ichi LP Position" }), _jsx("button", { className: "block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onClick: () => viewLTokenPosition({ vaultAddress: "0x555733fBa1CA24ec45e7027E00C4B6c5065BaC96", userAddress: wallet.address }), children: "View LToken Position" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => viewRingsPosition({ vaultAddress: "0x5e39021Ae7D3f6267dc7995BB5Dd15669060DAe0", userAddress: wallet.address }), children: "View Rings Position" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getIchiAPR("0xa68D5DbAe00960De66DdEaD4d53faea39f21983b"), children: "Get ICHI APR" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => viewIchiPosition({ vaultAddress: "0xc4A71981DC8ee8ee704b6217DaebAd6ECe185aeb", userAddress: wallet.address }), children: "View ICHI Position" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getVaultAPR("Beefy SWAPX (Ichi) WS-stS (stS deposit)"), children: "Get APR Based on API Tool" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getVaultPosition(wallet, "SWAPX Ichi wS-oS (oS deposit)"), children: "Get View Position on API Tool" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => depositVault(wallet, "SWAPX Ichi wS-stS (stS deposit)", "0.001"), children: "Deposit on API Tool" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => zap(wallet, "0x0000000000000000000000000000000000000000", "0.001", "Beefy SWAPX (Ichi) WS-stS (stS deposit)"), children: "Zap Native Token (S) into Beefy SWAPX (Ichi) WS-stS (stS deposit) strategy" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => bridgeAndZap(wallet, 137, "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", "0.1", "Silo USDC.e (Market id 20)"), children: "Bridge 0.1 USDT from Polygon to deposit into Silo USDC.e (Market id 20) strategy" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => console.log(getTokenAddressBySymbol("scUSD", 146)), children: "Get token address by symbol" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getTokenPriceBySymbol("DAI"), children: "Get token price by symbol" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getTokenPriceByAddress("0xA04BC7140c26fc9BB1F36B1A604C7A5a88fb0E70", 146), children: "Get token price by address" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => dakmim(), children: "Generate ichi gauge" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getSonicPoints(wallet.address), children: "Get Sonic Points" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getRingsPoints(wallet.address), children: "Get Rings Points" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => depositPendle({
                            walletClient: wallet,
                            vaultAddress: "0x6e4e95fab7db1f0524b4b0a05f0b9c96380b7dfa",
                            amount: "0.05"
                        }), children: "Deposit Pendle" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => viewPendleAPY("0x6e4e95fab7db1f0524b4b0a05f0b9c96380b7dfa"), children: "View Pendle APY" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => viewPendlePosition({ vaultAddress: "0x6e4e95fab7db1f0524b4b0a05f0b9c96380b7dfa", userAddress: wallet.address }), children: "View Pendle Position" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => depositAave({ walletClient: wallet, vaultAddress: "0x29219dd400f2bf60e5a23d13be72b486d4038894", amount: "0.01" }), children: "Deposit Aave" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getAaveAPY("0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38"), children: "Get Aave APY" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => viewAavePosition({ vaultAddress: "0x29219dd400f2bf60e5a23d13be72b486d4038894", userAddress: wallet.address }), children: "View Aave Position" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => depositVicuna({ walletClient: wallet, vaultAddress: "0x29219dd400f2bf60e5a23d13be72b486d4038894", amount: "0.01" }), children: "Deposit Vicuna" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => getVicunaAPY("0xd3dce716f3ef535c5ff8d041c1a41c3bd89b97ae"), children: "Get Vicuna APY" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => viewVicunaPosition({ vaultAddress: "0x9F0dF7799f6FDAd409300080cfF680f5A23df4b1", userAddress: wallet.address }), children: "View Vicuna Position" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => withdrawAave({ walletClient: wallet, vaultAddress: "0x29219dd400f2bf60e5a23d13be72b486d4038894", amount: "0.01" }), children: "Withdraw Aave" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => withdrawVicuna({ walletClient: wallet, vaultAddress: "0x29219dd400f2bf60e5a23d13be72b486d4038894", amount: "0.01" }), children: "Withdraw Vicuna" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => withdrawSilo({ walletClient: wallet, vaultAddress: "0x322e1d5384aa4ED66AeCa770B95686271de61dc3", amount: "0.01" }), children: "Withdraw Silo" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => withdrawMachFi({ walletClient: wallet, vaultAddress: "0xc84f54b2db8752f80dee5b5a48b64a2774d2b445", amount: "0.000999" }), children: "Withdraw MachFi" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => withdrawPendle({ walletClient: wallet, vaultAddress: "0x6e4e95fab7db1f0524b4b0a05f0b9c96380b7dfa", amount: "0.05" }), children: "Withdraw Pendle" }), _jsx("button", { className: 'block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', onClick: () => withdrawVault(wallet, "Silo USDC.e (Market id 20)", "0.001"), children: "Withdraw general" })] })] }));
};
