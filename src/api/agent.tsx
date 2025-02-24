async function getReply(message: string) {
    // Mock Reply from Agent
    // Sleep for 1 second to simulate agent response time
    await new Promise((r) => setTimeout(r, 1000));

    return `
    const a = await __SWAP__('S', 'wS', 0.001, 'swapping 0.001 S to wS');
    const b = await __SWAP__('S', 'wS', 0.002, 'swapping 0.002 S to wS');
    await __MESSAGE__("DONE");
    `;
    // return "__MESSAGE__('HALLO')";
}

export {
    getReply
}