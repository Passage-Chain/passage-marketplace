import { Channel, HeartbeatChannel, JsonRpc } from './ajrpc'
import pdev from '../utils/passageDevTools';

type Point = {
    x: number,
    y: number
};

type PointInRange = {
    inRange: boolean,
    x: number,
    y: number
};

interface PlayerElement extends HTMLElement {
    width: number;
    height: number;

    pressMouseButtons(event: MouseEvent): void;
    releaseMouseButtons(event: MouseEvent): void;
}

enum MessageType  {

    /*
     * Control Messages. Range = 0..49.
     */
    IFrameRequest = 0,
    RequestQualityControl = 1,
    FpsRequest = 2,
    AverageBitrateRequest = 3,
    StartStreaming = 4,
    StopStreaming = 5,
    LatencyTest = 6,
    RequestInitialSettings = 7,

    /*
     * Input Messages. Range = 50..89.
     */

    // Generic Input Messages. Range = 50..59.
    UIInteraction = 50,
    Command = 51,

    // Keyboard Input Message. Range = 60..69.
    KeyDown = 60,
    KeyUp = 61,
    KeyPress = 62,

    // Mouse Input Messages. Range = 70..79.
    MouseEnter = 70,
    MouseLeave = 71,
    MouseDown = 72,
    MouseUp = 73,
    MouseMove = 74,
    MouseWheel = 75,

    // Touch Input Messages. Range = 80..89.
    TouchStart = 80,
    TouchEnd = 81,
    TouchMove = 82,

    // Gamepad Input Messages. Range = 90..99
    GamepadButtonPressed = 90,
    GamepadButtonReleased = 91,
    GamepadAnalog = 92

};

enum ToClientMessageType  {
    QualityControlOwnership = 0,
    Response = 1,
    Command = 2,
    FreezeFrame = 3,
    UnfreezeFrame = 4,
    VideoEncoderAvgQP = 5,
    LatencyTest = 6,
    InitialSettings = 7,
    FileExtension = 8,
    FileMimeType = 9,
    FileContents = 10,
    TestEcho = 11,
	InputControlOwnership = 12,
};


// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
enum MouseButton {
    MainButton = 0, // Left button.
    AuxiliaryButton = 1, // Wheel button.
    SecondaryButton = 2, // Right button.
    FourthButton = 3, // Browser Back button.
    FifthButton = 4 // Browser Forward button.
};

// https =//developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
enum MouseButtonsMask {
    PrimaryButton = 1, // Left button.
    SecondaryButton = 2, // Right button.
    AuxiliaryButton = 4, // Wheel button.
    FourthButton = 8, // Browser Back button.
    FifthButton = 16 // Browser Forward button.
};

enum SpecialKeyCode {
    BackSpace = 8,
    Shift = 16,
    Control = 17,
    Alt = 18,
    RightShift = 253,
    RightControl = 254,
    RightAlt = 255
};

const inputOptions = {
    // The control scheme controls the behaviour of the mouse when it interacts
    // with the WebRTC player.
    // controlScheme: ControlSchemeType.LockedMouse,

    // Browser keys are those which are typically used by the browser UI. We
    // usually want to suppress these to allow, for example, UE4 to show shader
    // complexity with the F5 key without the web page refreshing.
    suppressBrowserKeys: true,

    // UE4 has a faketouches option which fakes a single finger touch when the
    // user drags with their mouse. We may perform the reverse; a single finger
    // touch may be converted into a mouse drag UE4 side. This allows a
    // non-touch application to be controlled partially via a touch device.
    fakeMouseWithTouches: false
};

class EventQueue extends Set<(...args: any[]) => void> {
    trigger(...args: any[]) {
        for(let fn of this) {
            fn(...args);
        }
    }
}

/**
 * Use the pixel stream's `emitUIInteraction` and `addResponseEventListener`
 * methods to send and receive JSON-RPC messages.
 */
class PixelStreamChannel implements Channel {

    io: PixelStreamIo;

    /**
     * We'll be constructed inside a PixelStreamIo instance, so we'll naturally
     * have a reference.
     */
    constructor(io: PixelStreamIo) {
        this.io = io;
    }

    send(message: string) {
        this.io.emitUIInteraction({
            type: "PassageRPC",
            data: message,
        });
    }

    setHandler(handler: (message: string) => void) {
        const decoder = (messageString: string) => {
            let message: { type: string, data: string } | undefined = undefined;
            try{
                message = JSON.parse(messageString);

            } catch(error) {
                console.error(error);
            }
            if(message && message.type == 'PassageRPC') {
                handler(message.data);
            }
            // otherwise we drop the message because it's probably intended for
            // a different user of the channel.
        }

        this.io.onResponseMessage.add(decoder);
    }

    close(_code: number, _reason: string) {
        // do nothing
    }
}


export default class PixelStreamIo {

    public onResponseMessage = new EventQueue();

    private _rtcChannel?: RTCDataChannel;
    private psChannel = new PixelStreamChannel(this);
    private hbChannel = new HeartbeatChannel(this.psChannel, 20);

    /**
     * This JsonRpc instance can be used for sending JSON-RPC formatted calls
     * through the pixel stream's data channel using the emitUIInteraction()
     * method. Other tools can still use emitUIInteraction() provided they
     * tolerate messages with a descriptor JSON type property of "PassageRPC"
     * traveling in either direction.
     */
    public rpc = new JsonRpc(this.hbChannel);

    /**
     * These width and height measurements should be set to the video element's
     * clientWidth, clientHeight, videoWidth, and videoHeight attributes. Note
     * that these more or less presume that the video element have a CSS style
     * with `object-fit: contain`, which produces a letterboxed effect when
     * there is an aspect ratio mismatch. The original Unreal implementation
     * appeared to do this a different way, using the player DIV containing the
     * video element.
     */
    clientWidth = 1280;
    clientHeight = 720;
    videoWidth = 1280;
    videoHeight = 720;

    // These three properties are initialized after construction. Suppressing
    // these error messages allows us to later assume that these are defined.
    // @ts-ignore
    normalizeAndQuantizeUnsigned: (x: number, y: number) => PointInRange;
    // @ts-ignore
    unquantizeAndDenormalizeUnsigned: (x: number, y: number) => Point;
    // @ts-ignore
    normalizeAndQuantizeSigned: (x: number, y: number) => Point;

    activeKeys: SpecialKeyCode[] = [];

    constructor(channel?: RTCDataChannel) {
        // important that we bind handleMessage before assigning the channel
        // because we will be assigning handleMessage as an event handler in
        // the setter method
        this.handleMessage = this.handleMessage.bind(this);
        this.channel = channel;

        // DEBUG: this allows us to test game restart  when data stops coming 
        // over the WebRTC data channel
        pdev.zombie = () => {
            const oldMethod = this.sendInputData ;
            this.sendInputData = () => {};

            pdev.dezombie = () => {
                this.sendInputData = oldMethod;
            }
        }
    }

    public get channel(): RTCDataChannel | undefined {
        return this._rtcChannel;
    }

    public set channel(channel: RTCDataChannel | undefined) {
        if(this._rtcChannel) {
            this._rtcChannel.removeEventListener('message', this.handleMessage)
        }

        this._rtcChannel = channel;
        if(this._rtcChannel) {
            this._rtcChannel.addEventListener('message', this.handleMessage);
        }
    }

    /**
     * Is this IO instance ready to send/receive events over the WebRTC data
     * channel?
     */
    public get ready(): boolean {
        return this._rtcChannel != null
            && this._rtcChannel.readyState == "open";
    }

    private handleMessage(event: MessageEvent) {
        const view = new Uint8Array(event.data);
        switch(view[0]) {
            case ToClientMessageType.Response:
                let response =
                    new TextDecoder("utf-16").decode(event.data.slice(1));
                this.onResponseMessage.trigger(response);
                break;
        }
    }

    private sendInputData(data: ArrayBuffer) {
        if(this.channel && this.channel.readyState == 'open') {
            this.channel.send(data);
        }
    }

    /**
     *
     */
    followVideoDimensions(elt: HTMLVideoElement) {
        window.addEventListener(
            'resize', () => this.updateDimensionsFromVideo(elt));
    }

    updateDimensionsFromVideo(elt: HTMLVideoElement) {
        this.clientWidth = elt.clientWidth;
        this.clientHeight = elt.clientHeight;
        // Note that the video width changes after resize so we're going to
        // ignore it and pretend it's exactly the client width.
        this.videoWidth = elt.clientWidth;
        this.videoHeight = elt.clientHeight;
        this.setupNormalizeAndQuantize();
    }

    /**
     * A generic message has a type and a descriptor.
     * @param messageType
     * @param descriptor
     */
    private emitDescriptor(messageType: MessageType, descriptor: unknown) {
        // Convert the dscriptor object into a JSON string.
        let descriptorAsString = JSON.stringify(descriptor);

        // Add the UTF-16 JSON string to the array byte buffer, going two bytes
        // at a time.
        let data = new DataView(new ArrayBuffer(1 + 2 + 2 * descriptorAsString.length));
        let byteIdx = 0;
        data.setUint8(byteIdx, messageType);
        byteIdx++;
        data.setUint16(byteIdx, descriptorAsString.length, true);
        byteIdx += 2;
        for (let i = 0; i < descriptorAsString.length; i++) {
            data.setUint16(byteIdx, descriptorAsString.charCodeAt(i), true);
            byteIdx += 2;
        }
        this.sendInputData(data.buffer);
    }

    /**
     * A UI interation will occur when the user presses a button powered by
     * JavaScript as opposed to pressing a button which is part of the pixel
     * streamed UI from the UE4 client.
     */
    emitUIInteraction(descriptor: unknown) {
        this.emitDescriptor(MessageType.UIInteraction, descriptor);
    }

    /**
     * A build-in command can be sent to UE4 client. The commands are defined
     * by a JSON descriptor and will be executed automatically. The currently
     * supported commands are:
     *
     * 1. A command to run any console command:
     *    "{ ConsoleCommand: <string> }"
     *
     * 2. A command to change the resolution to the given width and height.
     *    "{ Resolution.Width: <value>, Resolution.Height: <value> } }"
     */
    emitCommand(descriptor: string) {
        this.emitDescriptor(MessageType.Command, descriptor);
    }

    requestInitialSettings() {
        this.sendInputData(
            new Uint8Array([MessageType.RequestInitialSettings]).buffer);
    }

    setupNormalizeAndQuantize() {
        let playerAspectRatio = this.clientHeight / this.clientWidth;
        let videoAspectRatio = this.videoHeight / this.videoWidth;

        // Unsigned XY positions are the ratio (0.0..1.0) along a viewport axis,
        // quantized into an uint16 (0..65536).
        // Signed XY deltas are the ratio (-1.0..1.0) along a viewport axis,
        // quantized into an int16 (-32767..32767).
        // This allows the browser viewport and client viewport to have a different
        // size.
        // Hack: Currently we set an out-of-range position to an extreme (65535)
        // as we can't yet accurately detect mouse enter and leave events
        // precisely inside a video with an aspect ratio which causes mattes.
        if (playerAspectRatio > videoAspectRatio) {
            let ratio = playerAspectRatio / videoAspectRatio;
            // Unsigned.
            this.normalizeAndQuantizeUnsigned = (x, y) => {
                let normalizedX = x / this.clientWidth;
                let normalizedY = ratio * (y / this.clientHeight - 0.5) + 0.5;
                if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
                    return {
                        inRange: false,
                        x: 65535,
                        y: 65535
                    };
                } else {
                    return {
                        inRange: true,
                        x: normalizedX * 65536,
                        y: normalizedY * 65536
                    };
                }
            };
            this.unquantizeAndDenormalizeUnsigned = (x, y) => {
                let normalizedX = x / 65536;
                let normalizedY = (y / 65536 - 0.5) / ratio + 0.5;
                return {
                    x: normalizedX * this.clientWidth,
                    y: normalizedY * this.clientHeight
                };
            };
            // Signed.
            this.normalizeAndQuantizeSigned = (x, y) => {
                let normalizedX = x / (0.5 * this.clientWidth);
                let normalizedY = (ratio * y) / (0.5 * this.clientHeight);
                return {
                    x: normalizedX * 32767,
                    y: normalizedY * 32767
                };
            };
        } else {
            let ratio = videoAspectRatio / playerAspectRatio;
            // Unsigned.
            this.normalizeAndQuantizeUnsigned = (x, y) => {
                let normalizedX = ratio * (x / this.clientWidth - 0.5) + 0.5;
                let normalizedY = y / this.clientHeight;
                if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
                    return {
                        inRange: false,
                        x: 65535,
                        y: 65535
                    };
                } else {
                    return {
                        inRange: true,
                        x: normalizedX * 65536,
                        y: normalizedY * 65536
                    };
                }
            };
            this.unquantizeAndDenormalizeUnsigned = (x, y) => {
                let normalizedX = (x / 65536 - 0.5) / ratio + 0.5;
                let normalizedY = y / 65536;
                return {
                    x: normalizedX * this.clientWidth,
                    y: normalizedY * this.clientHeight
                };
            };
            // Signed.
            this.normalizeAndQuantizeSigned = (x, y) => {
                let normalizedX = (ratio * x) / (0.5 * this.clientWidth);
                let normalizedY = y / (0.5 * this.clientHeight);
                return {
                    x: normalizedX * 32767,
                    y: normalizedY * 32767
                };
            };
        }
    }

    emitMouseMove(x: number, y: number, deltaX: number, deltaY: number) {
        let coord = this.normalizeAndQuantizeUnsigned(x, y);
        let delta = this.normalizeAndQuantizeSigned(deltaX, deltaY);
        let Data = new DataView(new ArrayBuffer(9));
        Data.setUint8(0, MessageType.MouseMove);
        Data.setUint16(1, coord.x, true);
        Data.setUint16(3, coord.y, true);
        Data.setInt16(5, delta.x, true);
        Data.setInt16(7, delta.y, true);
        this.sendInputData(Data.buffer);
    }

    emitMouseDown(button: number, x: number, y: number) {
        let coord = this.normalizeAndQuantizeUnsigned(x, y);
        let Data = new DataView(new ArrayBuffer(6));
        Data.setUint8(0, MessageType.MouseDown);
        Data.setUint8(1, button);
        Data.setUint16(2, coord.x, true);
        Data.setUint16(4, coord.y, true);
        this.sendInputData(Data.buffer);
    }

    emitMouseUp(button: number, x: number, y: number) {
        let coord = this.normalizeAndQuantizeUnsigned(x, y);
        let Data = new DataView(new ArrayBuffer(6));
        Data.setUint8(0, MessageType.MouseUp);
        Data.setUint8(1, button);
        Data.setUint16(2, coord.x, true);
        Data.setUint16(4, coord.y, true);
        this.sendInputData(Data.buffer);
    }

    emitMouseWheel(delta: number, x: number, y: number) {
        let coord = this.normalizeAndQuantizeUnsigned(x, y);
        let Data = new DataView(new ArrayBuffer(7));
        Data.setUint8(0, MessageType.MouseWheel);
        Data.setInt16(1, delta, true);
        Data.setUint16(3, coord.x, true);
        Data.setUint16(5, coord.y, true);
        this.sendInputData(Data.buffer);
    }

    releaseMouseButtons(buttons: MouseButtonsMask, x: number, y: number) {
        if (buttons & MouseButtonsMask.PrimaryButton) {
            this.emitMouseUp(MouseButton.MainButton, x, y);
        }
        if (buttons & MouseButtonsMask.SecondaryButton) {
            this.emitMouseUp(MouseButton.SecondaryButton, x, y);
        }
        if (buttons & MouseButtonsMask.AuxiliaryButton) {
            this.emitMouseUp(MouseButton.AuxiliaryButton, x, y);
        }
        if (buttons & MouseButtonsMask.FourthButton) {
            this.emitMouseUp(MouseButton.FourthButton, x, y);
        }
        if (buttons & MouseButtonsMask.FifthButton) {
            this.emitMouseUp(MouseButton.FifthButton, x, y);
        }
    }

    pressMouseButtons(buttons: MouseButtonsMask, x: number, y: number) {
        if (buttons & MouseButtonsMask.PrimaryButton) {
            this.emitMouseDown(MouseButton.MainButton, x, y);
        }
        if (buttons & MouseButtonsMask.SecondaryButton) {
            this.emitMouseDown(MouseButton.SecondaryButton, x, y);
        }
        if (buttons & MouseButtonsMask.AuxiliaryButton) {
            this.emitMouseDown(MouseButton.AuxiliaryButton, x, y);
        }
        if (buttons & MouseButtonsMask.FourthButton) {
            this.emitMouseDown(MouseButton.FourthButton, x, y);
        }
        if (buttons & MouseButtonsMask.FifthButton) {
            this.emitMouseDown(MouseButton.FifthButton, x, y);
        }
    }

    registerInputs(playerElement: PlayerElement) {
        this.registerMouseEnterAndLeaveEvents(playerElement);
        this.registerTouchEvents(playerElement);
    }

    registerMouseEnterAndLeaveEvents(playerElement: PlayerElement) {
        playerElement.onmouseenter = (e) => {
            let Data = new DataView(new ArrayBuffer(1));
            Data.setUint8(0, MessageType.MouseEnter);
            this.sendInputData(Data.buffer);
            playerElement.pressMouseButtons(e);
        };

        playerElement.onmouseleave = (e) => {
            let Data = new DataView(new ArrayBuffer(1));
            Data.setUint8(0, MessageType.MouseLeave);
            this.sendInputData(Data.buffer);
            playerElement.releaseMouseButtons(e);
        };
    }

    registerLockedMouseEvents(playerElement: PlayerElement) {
        let x = playerElement.width / 2;
        let y = playerElement.height / 2;

        playerElement.requestPointerLock = playerElement.requestPointerLock || (playerElement as any).mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock || (document as any).mozExitPointerLock;

        playerElement.onclick = function() {
            playerElement.requestPointerLock();
        };

        const lockStateChange = () => {
            if (document.pointerLockElement === playerElement ||
                (document as any).mozPointerLockElement === playerElement) {
                document.onmousemove = updatePosition;
            } else {
                document.onmousemove = () => {};

                // If mouse loses focus, send a key up for all of the currently
                // held-down keys. This is necessary as when the mouse loses
                // focus, the windows stops listening for events and as such
                // the keyup listener won't get fired
                const unique: Set<SpecialKeyCode> = new Set(this.activeKeys);
                for(let uniqueKeycode of unique) {
                    this.sendInputData(
                        new Uint8Array(
                            [MessageType.KeyUp, uniqueKeycode]).buffer);
                };
                // Reset the active keys back to nothing
                this.activeKeys = [];
            }
        }

        // Respond to lock state change events
        document.addEventListener('pointerlockchange', lockStateChange, false);
        document.addEventListener('mozpointerlockchange', lockStateChange, false);

        // Note thas this is used above in lockStateChange; we can do that
        // because the constant is "hoisted"
        const updatePosition = (e: MouseEvent) => {
            x += e.movementX;
            y += e.movementY;
            if (x > this.clientWidth) {
                x -= this.clientWidth;
            }
            if (y > this.clientHeight) {
                y -= this.clientHeight;
            }
            if (x < 0) {
                x = this.clientWidth + x;
            }
            if (y < 0) {
                y = this.clientWidth - y;
            }
            this.emitMouseMove(x, y, e.movementX, e.movementY);
        }

        playerElement.onmousedown = (e) => {
            this.emitMouseDown(e.button, x, y);
        };

        playerElement.onmouseup = (e) => {
            this.emitMouseUp(e.button, x, y);
        };

        playerElement.onwheel = (e) => {
            this.emitMouseWheel((e as any).wheelDelta, x, y);
        };

        (playerElement as any).onmousewheel = playerElement.onwheel;

        playerElement.pressMouseButtons = (e) => {
            this.pressMouseButtons(e.buttons, x, y);
        };

        playerElement.releaseMouseButtons = (e) => {
            this.releaseMouseButtons(e.buttons, x, y);
        };
    }

    unregisterLockedMouseEvents(playerElement: PlayerElement) {
        document.exitPointerLock();
        const noop = () => {};
        playerElement.onclick = noop;
        playerElement.onmousedown = noop;
        playerElement.onmouseup = noop;
        playerElement.onwheel = noop;
        (playerElement as any).onwheel = noop;
        playerElement.pressMouseButtons = noop;
        playerElement.releaseMouseButtons = noop;
    }

    registerHoveringMouseEvents(playerElement: PlayerElement) {
        playerElement.onmousemove = (e) => {
            this.emitMouseMove(e.clientX, e.clientY, e.movementX, e.movementY);
            e.preventDefault();
        };

        playerElement.onmousedown = (e) => {
            this.emitMouseDown(e.button, e.offsetX, e.offsetY);
            e.preventDefault();
        };

        playerElement.onmouseup = (e) => {
            this.emitMouseUp(e.button, e.offsetX, e.offsetY);
            e.preventDefault();
        };

        // When the context menu is shown then it is safest to release the
        // button which was pressed when the event happened. This will
        // guarantee we will get at least one mouse up corresponding to a mouse
        // down event. Otherwise the mouse can get stuck.
        // https://github.com/facebook/react/issues/5531
        playerElement.oncontextmenu = (e: MouseEvent) => {
            this.emitMouseUp(e.button, e.offsetX, e.offsetY);
            e.preventDefault();
        };

        if ('onmousewheel' in playerElement) {
            playerElement.onmousewheel = (e: MouseEvent) => {
                // NB: wheelData may not exist, but this is faithfully
                // propagated from the Unreal source.
                this.emitMouseWheel(
                    (e as any).wheelDelta, e.offsetX, e.offsetY);
                e.preventDefault();
            };
        }

        playerElement.pressMouseButtons = (e) => {
            this.pressMouseButtons(e.buttons, e.offsetX, e.offsetY);
        };

        playerElement.releaseMouseButtons = (e) => {
            this.releaseMouseButtons(e.buttons, e.offsetX, e.offsetY);
        };
    }

    unregisterHoveringMouseEvents(playerElement: PlayerElement) {
        const noop = (  ) => {};
        playerElement.onmousemove = noop;
        playerElement.onmousedown = noop;
        playerElement.onmouseup = noop;
        playerElement.oncontextmenu = noop;
        if('onmousewheel' in playerElement) {
            playerElement.onmousewheel = noop;
        }
        playerElement.pressMouseButtons = noop;
        playerElement.releaseMouseButtons = noop;
    }

    registerTouchEvents(playerElement: PlayerElement) {

        // We need to assign a unique identifier to each finger.
        // We do this by mapping each Touch object to the identifier.
        let fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        let fingerIds: Record<number, number> = {};

        const rememberTouch = (touch: Touch) => {
            let finger = fingers.pop();
            if (finger === undefined) {
                console.error('Exhausted touch indentifiers');
            } else {
                fingerIds[touch.identifier] = finger;
            }
        }

        const forgetTouch = (touch: Touch) => {
            fingers.push(fingerIds[touch.identifier]);
            delete fingerIds[touch.identifier];
        }

        const emitTouchData = (type: number, touches: TouchList) => {
            let data = new DataView(new ArrayBuffer(2 + 7 * touches.length));
            data.setUint8(0, type);
            data.setUint8(1, touches.length);
            let byte = 2;
            for (let t = 0; t < touches.length; t++) {
                let touch = touches[t];
                let x = touch.clientX - playerElement.offsetLeft;
                let y = touch.clientY - playerElement.offsetTop;
                let coord = this.normalizeAndQuantizeUnsigned(x, y);
                data.setUint16(byte, coord.x, true);
                byte += 2;
                data.setUint16(byte, coord.y, true);
                byte += 2;
                data.setUint8(byte, fingerIds[touch.identifier]);
                byte += 1;
                data.setUint8(byte, 255 * touch.force); // force is between 0.0 and 1.0 so quantize into byte.
                byte += 1;
                data.setUint8(byte, coord.inRange ? 1 : 0); // mark the touch as in the player or not
                byte += 1;
            }

            this.sendInputData(data.buffer);
        }

        if (inputOptions.fakeMouseWithTouches) {

            const playerElementClientRect =
                playerElement.getBoundingClientRect();

            let finger: any;

            playerElement.ontouchstart = (e) => {
                if (finger === undefined) {
                    let firstTouch = e.changedTouches[0];
                    finger = {
                        id: firstTouch.identifier,
                        x: firstTouch.clientX - playerElementClientRect.left,
                        y: firstTouch.clientY - playerElementClientRect.top
                    };
                    // Hack: Mouse events require an enter and leave so we just
                    // enter and leave manually with each touch as this event
                    // is not fired with a touch device.
                    if(playerElement.onmouseenter) {
                        playerElement.onmouseenter(e as any);
                    }
                    this.emitMouseDown(
                        MouseButton.MainButton, finger.x, finger.y);
                }
                e.preventDefault();
            };

            playerElement.ontouchend = (e) => {
                for (let t = 0; t < e.changedTouches.length; t++) {
                    let touch = e.changedTouches[t];
                    if (touch.identifier === finger.id) {
                        let x = touch.clientX - playerElementClientRect.left;
                        let y = touch.clientY - playerElementClientRect.top;
                        this.emitMouseUp(MouseButton.MainButton, x, y);
                        // Hack: Manual mouse leave event.
                        if(playerElement.onmouseleave) {
                            playerElement.onmouseleave(e as any);
                        }
                        finger = undefined;
                        break;
                    }
                }
                e.preventDefault();
            };

            playerElement.ontouchmove = (e) => {
                for (let t = 0; t < e.touches.length; t++) {
                    let touch = e.touches[t];
                    if (touch.identifier === finger.id) {
                        let x = touch.clientX - playerElementClientRect.left;
                        let y = touch.clientY - playerElementClientRect.top;
                        this.emitMouseMove(x, y, x - finger.x, y - finger.y);
                        finger.x = x;
                        finger.y = y;
                        break;
                    }
                }
                e.preventDefault();
            };
        } else {
            playerElement.ontouchstart = function(e: TouchEvent) {
                // Assign a unique identifier to each touch.
                for (let t = 0; t < e.changedTouches.length; t++) {
                    rememberTouch(e.changedTouches[t]);
                }

                emitTouchData(MessageType.TouchStart, e.changedTouches);
                e.preventDefault();
            };

            playerElement.ontouchend = function(e) {
                emitTouchData(MessageType.TouchEnd, e.changedTouches);

                // Re-cycle unique identifiers previously assigned to each touch.
                for (let t = 0; t < e.changedTouches.length; t++) {
                    forgetTouch(e.changedTouches[t]);
                }
                e.preventDefault();
            };

            playerElement.ontouchmove = function(e) {
                emitTouchData(MessageType.TouchMove, e.touches);
                e.preventDefault();
            };
        }
    }

    // Browser keys do not have a charCode so we only need to test keyCode.
    isKeyCodeBrowserKey(keyCode: number) {
        // Function keys or tab key.
        return keyCode >= 112 && keyCode <= 123 || keyCode === 9;
    }

    // We want to be able to differentiate between left and right versions of
    // some keys.
    getKeyCode(e: KeyboardEvent) {
        if (e.keyCode === SpecialKeyCode.Shift && e.code === 'ShiftRight')
            return SpecialKeyCode.RightShift;
        else if (e.keyCode === SpecialKeyCode.Control && e.code === 'ControlRight')
            return SpecialKeyCode.RightControl;
        else if (e.keyCode === SpecialKeyCode.Alt && e.code === 'AltRight')
            return SpecialKeyCode.RightAlt;
        else
            return e.keyCode;
    }

    registerKeyboardEvents() {
        document.onkeydown = (e: KeyboardEvent) => {
            this.sendInputData(new Uint8Array([MessageType.KeyDown, this.getKeyCode(e), e.repeat ?1:0]).buffer);
            this.activeKeys.push(this.getKeyCode(e));
            // Backspace is not considered a keypress in JavaScript but we need
            // it to be so characters may be deleted in a UE4 text entry field.
            if (e.keyCode === SpecialKeyCode.BackSpace) {
                if(document.onkeypress) {
                    document.onkeypress({
                        charCode: SpecialKeyCode.BackSpace
                    } as KeyboardEvent);
                }
            }
            if (inputOptions.suppressBrowserKeys && this.isKeyCodeBrowserKey(e.keyCode)) {
                e.preventDefault();
            }
        };

        document.onkeyup = (e: KeyboardEvent) => {
            this.sendInputData(new Uint8Array([MessageType.KeyUp, this.getKeyCode(e)]).buffer);
            if (inputOptions.suppressBrowserKeys && this.isKeyCodeBrowserKey(e.keyCode)) {
                e.preventDefault();
            }
        };

        document.onkeypress = (e) => {
            let data = new DataView(new ArrayBuffer(3));
            data.setUint8(0, MessageType.KeyPress);
            data.setUint16(1, e.charCode, true);
            this.sendInputData(data.buffer);
        };
    }
}