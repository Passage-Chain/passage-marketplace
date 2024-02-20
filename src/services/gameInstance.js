import PixelStreamClient from '../libs/PixelStreamClient';


/**
 * The GameInstance reperesents the connection to the game instance over the
 * PixelStream data channel. The Unreal game itself acts as an RPC peer,
 * implementing some methods that you can call from this object without having
 * to think about the protocol at all, e.g. `init(token)`.
 */
export default class GameInstance {

    constructor() {
        this.client = new PixelStreamClient();
    }

    static getInstance() {
        if(GameInstance.instance) {
            return GameInstance.instance;
        } else {
            throw new Error('GameInstance not connected');
        }
    }

    static connect(instanceAddress, video, audio) {
        if (GameInstance.instance) {
            console.warn('Already connected to a game instance');
            return GameInstance.instance;
        }

        const instance = GameInstance.instance = new GameInstance();
        instance.client.start(instanceAddress, video, audio);
        return instance;
    }

    static disconnect() {
        if (GameInstance.instance) {
            console.log("GameInstanceClient.disconnect()", GameInstance.instance);

            GameInstance.instance.client?.stop();
            GameInstance.instance = undefined;
        }
    }

    /**
     * Before calling any other GameInstance methods, call this method to
     * authenticate the GameInstance with the backend.
     * @param {string} token The token to use for game authentication obtained
     * from the backend route at /api/v1/user/get-game-session-token.
     * @returns A promise that resolves to true indicating success, otherwise
     * the promise rejects with an error.
     */
    init(token) {
        return this.client.io.rpc.call('Init', token);
    }

    /**
     * @param {string} userId The directory uses the backend's user model
     * object's key for the Participant ID. The game calls users "Participants"
     * since one backend user can participate in multiple games. The user on
     * the backend has exactly the same id field as the participant in the game.
     * @returns A promise that resolves to true indicating success, otherwise
     * the promise rejects with an error. Note that the promise will resolve
     * when the teleport is actually complete.
     */
    teleport(userId) {
        return this.client.io.rpc.call("Teleport", userId);
    }

    /**
     * The size of the video stream is set when the PixelStream connects, so
     * calling SetRes currently only changes the size of the renderer,
     * resulting in an anamorphic output. In order to achieve the appearance of
     * a responsive viewport we take advantage of the anamorphic output and
     * stretch the video so that it appears correct at the (distorted) aspect
     * ratio of the viewport.
     * @param {number} width
     * @param {number} height
     */
    setResolution(width, height) {
        console.log("GameInstance.setResolution()");
        const
            inputArea = width*height,
            targetArea = 1920*1080,
            scale = Math.sqrt(targetArea / inputArea);

        width *= scale;
        height *= scale;

        return this.client.io.rpc.call("SetResolution", width, height);
    }

    /**
     *
     * @param {string} mode Either "simple" or "pro".
     * @param {boolean} touch Should the game use the touch version of the
     * input mode?
     * @returns A promise that resolves to true indicating success, otherwise
     * the promise rejects with an error.
     */
    setInputMode(mode, touch) {
        return this.client.io.rpc.call("SetInputMode", mode, touch);
    }
}
