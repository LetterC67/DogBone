const AGENT_URL = import.meta.env.VITE_APP_AGENT_URL;

async function getReply(message: string, threadId: string) {
    const response = await fetch(`${AGENT_URL}/thread/${threadId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    });
    const data = await response.json();
    const code = data.response;

    console.log(code);
    // If the code starts with ```javascript, filter it out and the last ```
    if (code.startsWith('```javascript')) {
        return code.split('```javascript')[1].split('```')[0];
    }

    return code;
}

export {
    getReply
}