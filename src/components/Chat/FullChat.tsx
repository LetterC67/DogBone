import React from 'react';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import Navigator from '../Navigator';

function FullChat() {
    return (
        <div className='flex flex-col items-center h-full text-lg'>
            <Navigator></Navigator>
            <div  className='w-full flex flex-col justify-between h-full pb-6 items-center'>
                    <ChatMessages />
                <div className='w-3/5'>
                    <ChatInput maxHeight={200} />
                </div>
            </div>
        </div>
    );
}

export default FullChat;