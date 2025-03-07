import { createPublicClient, formatUnits, http, parseUnits } from "viem";
import { sonic } from "viem/chains";
import SiloLensAbi from "../../silo/abi/SiloLens.abi.json";
import { getLSTAPY } from "../../lst/getLSTAPY";
const LEVERAGE = BigInt(16);
const SILO_VAULT = '0x396922EF30Cf012973343f7174db850c7D265278';
const TOKEN = '0xE5DA20F15420aD15DE0fa650600aFc998bbE3955';
const BORROW_VAULT = '0x47d8490Be37ADC7Af053322d6d779153689E13C1';
const SILO_LENS = '0xE05966aee69CeCD677a30f469812Ced650cE3b5E';
const siloLensAbi = JSON.parse(JSON.stringify(SiloLensAbi));
export async function getBone1APY() {
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http(),
    });
    const depositAPR = (await publicClient.readContract({
        address: SILO_LENS,
        abi: siloLensAbi,
        functionName: 'getDepositAPR',
        args: [SILO_VAULT],
    }));
    console.log("deposit APR: ", formatUnits(depositAPR, 16));
    const stSAPR = parseUnits((await getLSTAPY(TOKEN)).toString(), 16);
    const borrowAPR = (await publicClient.readContract({
        address: SILO_LENS,
        abi: siloLensAbi,
        functionName: 'getBorrowAPR',
        args: [BORROW_VAULT],
    }));
    return Number(formatUnits((depositAPR + stSAPR) * LEVERAGE - borrowAPR * (LEVERAGE - BigInt(1)), 16));
}
