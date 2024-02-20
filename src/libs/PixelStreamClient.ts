import PixelStreamIo from './PixelStreamIo';
import WebRTCSyncMonitor from './WebRTCSyncMonitor';
import pdev from '../utils/passageDevTools';

type IceCandidateSignalingMessage = {
    type: "iceCandidate",
    candidate: RTCIceCandidateInit,
}

type PlayerCountSignalingMessage = {
    type: "playerCount",
    count: number,
}

type ConfigSignalingMessage = {
    type: "config",
    peerConnectionOptions?: RTCConfiguration;
}

type OfferSignalingMessage = {
    type: "offer",
    sdp: string,
}

type SignalingMessage =
    ConfigSignalingMessage
    | PlayerCountSignalingMessage
    | OfferSignalingMessage
    | IceCandidateSignalingMessage
    |
    {
        type: string,
        playerId: number,
    };


class EventQueue extends Set<(...args: any[]) => void> {
    trigger(...args: any[]) {
        for(let fn of this) {
            try {
                fn(args);
            } catch(error) {
                console.error(error);
            }
        }
    }
}

export enum InputMode {
    pro,
    simple,
}

export default class PixelStreamClient {

    /**
     * When the game has disconnected and is no longer available, the <video>
     * element will be discarded and replaced with a new, blank element having
     * the same ID.
     */
    public onGameDisconnect = new EventQueue();
    public onInteractionRequired = new EventQueue();
    public onStreamPlaying = new EventQueue();
    public onIoReady = new EventQueue();
    public onWebSocketError = new EventQueue();
    public onWebSocketOpen = new EventQueue();

    /**
     * Given the URL of a signaling server and video/audio elements, this
     */
    public start(url: string, video: HTMLVideoElement, audio: HTMLAudioElement) {
        this.video = video;
        this.audio = audio;

        this.ws = new WebSocket(url);
        this.ws.addEventListener('error', (event) => {
            console.error('Error opening Passage signaling WebSocket. Cannot connect to game.', event);
            this.onWebSocketError.trigger(event);
        });
        this.ws.addEventListener('open', (event) => {
            this.onWebSocketOpen.trigger(event);
        })
        this.ws.addEventListener('message', (event: MessageEvent) => {
            let data = JSON.parse(event.data);
            this.handleSignalingMessage(data);
        });
        this.ws.addEventListener('close', () => {
            if(this.video) {
                this.video.srcObject = null;
            }

            this.onGameDisconnect.trigger();
        });
    }

    public stop() {
        this.ws?.close(); delete this.ws;
        this.pc?.close(); delete this.pc;
        this.io = new PixelStreamIo();
    }

    /**
     * This can be called immediately after construction, in which case it sets
     * the initial input mode. After calling start(), when the connection has
     * been established, this will actually re-register event handlers and even
     * cancel the pointer lock when moving from `pro` to `simple`.
     * @param mode Which input mode to use. Defaults to InputMode.pro.
     */
    public setInputMode(mode: InputMode) {
        this.inputMode = mode;
        if(this.io.channel) {
            switch(this.inputMode) {
                case InputMode.pro:
                    this.io.rpc.call('SetInputMode', "Pro", false)
                        .then(() => {
                            this.io.unregisterHoveringMouseEvents(
                                this.video as any);
                            this.io.registerLockedMouseEvents(
                                this.video as any);
                        })
                        .catch(console.error);
                    break;
                case InputMode.simple:
                    this.io.rpc.call('SetInputMode', "Simple", false)
                        .then(() => {
                            this.io.unregisterLockedMouseEvents(
                                this.video as any);
                            this.io.registerHoveringMouseEvents(
                                this.video as any);
                        })
                        .catch(console.error);
                    break;
                default:
                    console.error('Unrecognized input mode: ', this.inputMode);
            }
        }
    }

    private inputMode: InputMode = InputMode.pro;
    private pc?: RTCPeerConnection;
    private dc?: RTCDataChannel;
    private ws?: WebSocket;
    private io: PixelStreamIo = new PixelStreamIo();
    private video?: HTMLVideoElement;
    private audio?: HTMLAudioElement;

    private handleSignalingMessage(message: SignalingMessage) {
        switch(message.type) {
            case 'config':
                this.setupPeerConnection(
                    (message as ConfigSignalingMessage).peerConnectionOptions);
                break;
            case 'playerCount':
                // nothing to do here at the moment
                break;
            case 'offer':
                this.pc?.setRemoteDescription({
                    type: 'offer',
                    sdp: (message as OfferSignalingMessage).sdp,
                });
                break;
            case 'iceCandidate':
                this.pc?.addIceCandidate(
                    (message as IceCandidateSignalingMessage).candidate)
                    .catch(error => {
                        console.error("PixelStreamingClient.handleSignalingMessage cannot add iceCandidate:", error);
                    });
                break;
            default:
                console.error(`PixelStreamingClient.handleSignalingMessage: Unknown incoming message type "${message.type}" in message: `, message);
        }
    }

    private setupPeerConnection(options?: RTCConfiguration) {
        const pc = this.pc = new RTCPeerConnection(options);

        // DEBUG aid
        const monitor = new WebRTCSyncMonitor(pc);
        monitor.start();

        pc.addEventListener('signalingstatechange',
            this.handleSignalingStateChange.bind(this));
        pc.addEventListener('icecandidate',
            this.handleLocalIceCandidate.bind(this));
        pc.addEventListener('connectionstatechange',
            this.handleConnectionStateChange.bind(this));
        pc.addEventListener('track', this.handleTrack.bind(this));
        pc.addEventListener('datachannel', this.handleDataChannel.bind(this));
    }

    private async handleSignalingStateChange(){
        switch(this.pc?.signalingState) {
            case 'stable':
                // expected, but no associated action
                break;
            case 'have-remote-offer':
                this.pc.addTransceiver("video", { direction: "recvonly" });
                this.pc.addTransceiver("audio", { direction: "recvonly" });
                this.dc = this.pc.createDataChannel('cirrus', {ordered: true});

                let answer = await this.pc.createAnswer();
                answer.sdp = mungeSDPOffer(answer.sdp || "");
                await this.pc.setLocalDescription(answer);
                this.ws?.send(JSON.stringify(this.pc.localDescription));
                break;
            case 'have-local-pranswer':
                break;
            case 'closed':
                // possible, but no associated action
                break;
            default:
                console.error(
                    'Unexpected RTCPeerConnection signalingState',
                    this.pc?.signalingState, this.pc);
        }
    };

    private handleLocalIceCandidate(event: RTCPeerConnectionIceEvent) {
        if(event.candidate) {
            this.ws?.send(JSON.stringify({
                type: "iceCandidate",
                playerId: 101,
                candidate: event.candidate,
            }));
        }
    };

    private handleConnectionStateChange() {
        switch(this.pc?.connectionState) {
            case 'new':
                break;
            case 'connecting':
                break;
            case 'connected':
                break;
            case 'disconnected':
                break;
            case 'failed':
                break;
            case 'closed':
                break;
        }
    }

    private handleTrack(event: RTCTrackEvent) {
        if(event.track.kind == 'audio') {
            if(!this.audio) return;
            this.audio.srcObject = event.streams[0];
        }
        else if(event.track.kind == 'video') {
            if(!this.video) return;
            this.video.srcObject = event.streams[0];
        }

        if(this.video?.srcObject && this.audio?.srcObject) {
            Promise.all([this.video.play(),this.audio.play()])
            .then(() => {
                this.onStreamPlaying.trigger();
            })
            .catch(error => {
                this.onInteractionRequired.trigger();
                document.addEventListener('click', () => {
                    Promise.all([this.audio?.play(), this.video?.play()])
                    .then(() => {
                        this.onStreamPlaying.trigger();
                    })
                    .catch(() => {
                        console.error(`PixelStreamClient.handleTrack() unable to play video element even after user interaction`);
                    });
                });
            })
        }
    }

    private handleDataChannel() {
        this.io.channel = this.dc;
        this.io.registerInputs(this.video as any);

        switch(this.inputMode) {
            case InputMode.pro:
                this.io.registerLockedMouseEvents(this.video as any);
                break;
            case InputMode.simple:
                this.io.registerHoveringMouseEvents(this.video as any);
                break;
            default:
                console.error('Unrecognized input mode: ', this.inputMode);
        }

        this.io.registerKeyboardEvents();
        this.io.updateDimensionsFromVideo(this.video);
        this.io.followVideoDimensions(this.video);

        this.setInputMode(this.inputMode);

        this.onIoReady.trigger();

        // DEBUG: this makes the RPC instance available in the console as
        // pdev.rpc(...);
        pdev.rpc = (method: string, ...args: unknown[]) => {
            return this.io.rpc.call(method, ...args);
        }
    }

}

const mungeSDPOffer = (sdp: string) => {

    let audioSDP = '';

    // set max bitrate to highest bitrate Opus supports
    audioSDP += 'maxaveragebitrate=510000;';
    audioSDP += 'sprop-stereo=1;stereo=1;';

    // enable in-band forward error correction for opus audio
    audioSDP += 'useinbandfec=1';

    // We use the line 'useinbandfec=1' (which Opus uses) to set our Opus specific audio parameters.
    return sdp.replace('useinbandfec=1', audioSDP);
}
