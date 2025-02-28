async function getReply(message: string) {
    // Mock Reply from Agent
    // Sleep for 1 second to simulate agent response time
    await new Promise((r) => setTimeout(r, 1000));

    return `
        const userAddress = await __GET_ADDRESS__();
        await __MESSAGE__("To buy USDC, you need to bridge or swap other tokens into USDC. Please choose an option:");
        await __MESSAGE__("1. Bridge USDT from Polygon to Sonic and then swap to USDC.e");
        await __MESSAGE__("2. Swap S to USDC.e on Sonic");
        await __MESSAGE__("3. Bridge USDC from Ethereum to Sonic");
        await __MESSAGE__("Please respond with the number of your chosen option.");
        // Note: This is a text-based interface and the above messages are just examples.
        // In a real-world application, you would need to handle user input and implement the chosen option.
        // For demonstration purposes, let's assume the user chooses option 2.
        const inputToken = "S";
        const outputToken = "USDC.e"
        const amountToSwap = 10; // Replace with the actual amount
        const swappedAmount = await __SWAP__(inputToken, outputToken, amountToSwap, \`Swapping \${amountToSwap} S into USDC.e.\`);
        await __MESSAGE__(\`Successfully swapped \${swappedAmount} USDC.e.\`);

    `;
    // return "__MESSAGE__('HALLO')";
}

export {
    getReply
}