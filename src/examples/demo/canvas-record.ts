export class CanvasRecorder {

    public recording: boolean;
    private canvasRecordingOptions;
    private canvasRecorder;
    private audioTrack: MediaStreamTrack;

    public constructor() {
        this.recording = false;
    }

    public getType(filename: string) {
        const ext = this.fileExtension(filename);
        return ['mkv'].includes(ext) ? 'video/x-matroska;codecs=avc1' : 'video/webm';
    }

    private fileExtension(filename: string): string {
        return filename.split('.').pop();
    }

    public createCanvasRecorder(canvas: HTMLCanvasElement, options = {}) {
        const date = new Date();
        let link = null;

        const {
            filename = `Recording ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.webm`,
            frameRate = 25,
            download = true,
            recorderOptions = {
                mimeType: 'video/x-matroska;codecs=avc1',
                audioBitsPerSecond: 128000, // 128 Kbit/sec
                videoBitsPerSecond: 2500000 // 2.5 Mbit/sec
            }
        } = {
            ...options
        };

        const mimeType = recorderOptions.mimeType || this.getType(filename);

        if (download) {
            link = link || document.createElement('a');
            link.download = filename;
        }

        let chunks = [];

        let stream = canvas.captureStream(frameRate);

        /*
        if (!this.canvasRecorder) {
            // get the audio track:
            const ctx = new AudioContext();
            const dest = ctx.createMediaStreamDestination();
            const sourceNode = ctx.createMediaElementSource(audio);
            sourceNode.connect(dest);
            sourceNode.connect(ctx.destination);
            this.audioTrack = dest.stream.getAudioTracks()[0];
        }

        stream.addTrack(this.audioTrack);
        */

        let recorder = new MediaRecorder(stream, { mimeType, ...recorderOptions });

        recorder.ondataavailable = event => {
            event.data.size && chunks.push(event.data);
        };
        recorder.onstop = () => {
            if (download && chunks.length) {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                link.href = url;

                const event = new MouseEvent('click');
                link.dispatchEvent(event);
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1);
            }
        };

        return {
            start(timeslice) {
                chunks = [];
                recorder.start(timeslice);
            },
            set filename(name) {
                link.download = name;
            },
            stop() {
                recorder.stop();
                return chunks;
            },
            dispose() {
                recorder = null;
                stream = null;
            },
            stream,
            recorder
        };
    }

    /**
     * Records a video and sound using CanvasRecorder
     */
    public recordVideo() {
        console.info('recording video...');
        this.recording = true;
        const date = new Date();

        // options
        this.canvasRecordingOptions = {
            filename: `Aisa ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.webm`,
            frameRate: 60,
            download: true,
            recorderOptions: {
                mimeType: 'video/webm',
                audioBitsPerSecond: 128000, // 128 Kbit/sec
                videoBitsPerSecond: 5000000 // 2.5 Mbit/sec
            }
        }

        // Create canvas video recorder
        const canvasObj = document.getElementById('aisa-canvas');
        this.canvasRecorder = this.createCanvasRecorder(canvasObj as HTMLCanvasElement, this.canvasRecordingOptions);
        this.canvasRecorder.start();
    }

    public saveVideo() {
        // Stop and dispose
        this.canvasRecorder.stop();
        this.canvasRecorder.dispose();
        this.recording = false;
        console.info(`saved video as ${this.canvasRecordingOptions.filename}`);
    }
}
