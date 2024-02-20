type Sample = {
    audioLastPacketTime: number,
    videoLastPacketTime: number,
    difference: number,
}

const MAX_LENGTH = 50; // Samples in the data array
const WARNING_THRESHOLD = 50; // milliseconds

/**
 * Checks the RTCPeerConnection stats and reports if the magnitude of the audio 
 * delay is greater than some threshold. To manually check on sync you can type 
 * into the web console `passageWebRTCSyncMonitor.report()`. This also clears 
 * the warning flag so that you may receive warnings again after a report.
 */
export default class WebRTCSyncMonitor {

    running: boolean = false;
    connection: RTCPeerConnection;
    data: Sample[] = [];
    hasWarned: boolean = false;

    constructor(connection: RTCPeerConnection) {
        this.connection = connection;

        (window as any).passageWebRTCSyncMonitor = this;

        this.loop = this.loop.bind(this);
    }

    start() {
        this.running = true;
        this.loop();
    }

    stop() {
        this.running = false;
    }

    async loop() {
        if(this.running) {
            requestAnimationFrame(this.loop);

            let videoTS: number, audioTS: number;

            const report = await this.connection.getStats()
            
            for(let [_, item] of report) {
                if(item.type == 'inbound-rtp') {
                    if(item.mediaType == 'audio') {
                        audioTS = item.lastPacketReceivedTimestamp;
                    }
                    if(item.mediaType == 'video') {
                        videoTS = item.lastPacketReceivedTimestamp;
                    }
                }
            }

            const sync = videoTS - audioTS;
            this.data.push({
                audioLastPacketTime: audioTS,
                videoLastPacketTime: videoTS,
                difference: sync,
            });

            if(this.data.length > MAX_LENGTH) {
                this.data.splice(0, this.data.length - MAX_LENGTH);
            }            

            const avg = this.avgAudioDelay();
            if(!this.hasWarned && Math.abs(avg) > WARNING_THRESHOLD) {
                console.warn(`Average audio delay time is ${sync}ms`);
                this.hasWarned = true;
            }
        }
    }

    report() {
        this.hasWarned = false;
        console.table(this.data);
        console.log(`Average audio delay time is ${this.avgAudioDelay()}ms`);
    }

    avgAudioDelay() {
        let total = 0;
        for(const sample of this.data) {
            total += sample.difference;
        }
        return total / this.data.length;
    }

}