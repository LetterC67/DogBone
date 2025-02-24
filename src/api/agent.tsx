async function getReply(message: string) {
    // Mock Reply from Agent
    // Sleep for 1 second to simulate agent response time
    await new Promise((r) => setTimeout(r, 1000));

    return `
    const b = await __DEPOSIT__('wS', 146, 0.001, 'Beefy SWAPX (Ichi) wS-stS (wS deposit)', 'Bridging 0.002 ETH from ETH to wS on Sonic');
    await __MESSAGE__("DONE");
    `;
    // return "__MESSAGE__('HALLO')";
}

export {
    getReply
}