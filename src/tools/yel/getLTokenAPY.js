import LTokenList from './LTokenList.json';
const lTokenList = JSON.parse(JSON.stringify(LTokenList));
export async function getLTokenAPY(vaultAddress) {
    const lConfig = lTokenList.find((l) => l.vault === vaultAddress);
    if (!lConfig || !lConfig.pool) {
        throw new Error('LToken either not found or not APY not supported');
    }
    const DEFILLAMA_URL = `https://yields.llama.fi/chart/${lConfig.pool}`;
    const response = await fetch(DEFILLAMA_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('APY: ', Number(data.data[data.data.length - 1].apy).toFixed(2));
    return Number(Number(data.data[data.data.length - 1].apy).toFixed(2));
}
