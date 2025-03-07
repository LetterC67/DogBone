import VaultList from './pendleVaultList.json';
const vaultList = JSON.parse(JSON.stringify(VaultList));
export async function viewPendleAPY(vaultAddress) {
    const vaultConfig = vaultList.find((vault) => vault.vault === vaultAddress);
    if (!vaultConfig) {
        throw new Error('Vault either not found or not supported');
    }
    const PENDLE_API_URL = 'https://api-v2.pendle.finance/core';
    const repsonse = await fetch(`${PENDLE_API_URL}/v1/sdk/146/markets/${vaultAddress}/swapping-prices`);
    if (!repsonse.ok) {
        throw new Error('Failed to fetch Pendle data');
    }
    const data = await repsonse.json();
    console.log("Pendle APY: ", data.impliedApy * 100);
    return Number(data.impliedApy) * 100;
}
