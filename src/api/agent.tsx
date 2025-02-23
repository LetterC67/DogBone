async function getReply(message: string) {
    // Mock Reply from Agent
    // Sleep for 1 second to simulate agent response time
    await new Promise((r) => setTimeout(r, 1000));

    return "__MESSAGE__('Hello! How can I help you?');";
}

export {
    getReply
}