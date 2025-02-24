async function getReply(message: string) {
    // Mock Reply from Agent
    // Sleep for 1 second to simulate agent response time
    await new Promise((r) => setTimeout(r, 1000));

    return `
    const b = await __BRIDGE__('ETH', 1, 'wS', 0.002, 'Bridging 0.002 ETH from ETH to wS on Sonic');
    await __MESSAGE__("DONE");
    `;
    // return "__MESSAGE__('HALLO')";
}

export {
    getReply
}