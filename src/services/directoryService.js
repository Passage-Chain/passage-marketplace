// Presently the backend is unable to correctly authenticate this WebSocket 
// request because it expects a bearer token rather than a cookie. There's no 
// way to set the bearer token in the WebSocket request.

import httpConfig from '../configs/http';

const INTERVAL_LENGTH = 5000; // five seconds

export const heartbeat = () => {
    try {
        const ws = new WebSocket(httpConfig.directory);

        let intervalId = -1;
        const cleanup = () => {
            if(intervalId != -1) {
                clearInterval(intervalId);
            }
        };

        ws.addEventListener('open', () => {
            intervalId = setInterval(
                () => ws.send("HEARTBEAT"),
                INTERVAL_LENGTH);
        });
        ws.addEventListener('close', cleanup);
        ws.addEventListener('error', cleanup);
    } catch(error) {
        console.error('Unable to establish heartbeat connection with backend directory', error);
    }
};