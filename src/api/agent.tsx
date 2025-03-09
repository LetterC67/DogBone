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
    
    // If the code starts with ```javascript, filter it out and the last ```
    if (code.startsWith('```javascript')) {
        return code.split('```javascript')[1].split('```')[0];
    }

    return code;
}

async function createAutomatedTask(message: string) {
    const response = await fetch(`${AGENT_URL}/automation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    });
    const data = await response.json();
    return data;    
}

async function getAutomatedTask(taskId: string) {
    const response = await fetch(`${AGENT_URL}/automation/task/${taskId}`);
    const data = await response.json();
    return data;
}

async function getAutomatedTasks(userAddress: string) {
    const response = await fetch(`${AGENT_URL}/automation/tasks/${userAddress}`);
    const data = await response.json();
    return data;
}

async function triggerTask(taskId: string) {
    const response = await fetch(`${AGENT_URL}/automation/task/${taskId}/trigger`, {
        method: 'POST'
    });
    const data = await response.json();
    return data.task_status;
}

async function cancelTask(taskId: string) {
    const response = await fetch(`${AGENT_URL}/automation/task/${taskId}/delete`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;
}

async function saveAutomatedTask(userAddress: string, name: string, code: string, pseudoCode: string, interval: number, type: string) {
    const response = await fetch(`${AGENT_URL}/automation/task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            user_address: userAddress,
            name: name,
            code: code,
            pseudo_code: pseudoCode,
            interval: interval,
            status: "",
            type: type
        })
    });
    const data = await response.json();
    return data;
}


export {
    getReply,
    createAutomatedTask,
    saveAutomatedTask,
    getAutomatedTasks,
    getAutomatedTask,
    triggerTask,
    cancelTask
}