export class CanvasRecorder {

    public recording: boolean;
    private canvasRecordingOptions;
    private canvasRecorder;
    private audioSources = new WeakMap<HTMLMediaElement, {
        context: AudioContext;
        destination: MediaStreamAudioDestinationNode;
    }>();
    private recordingTimer: number | undefined;

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

    public createCanvasRecorder(canvas: HTMLCanvasElement, options = {}, audio?: HTMLMediaElement) {
        const date = new Date();
        let link = null;

        const {
            filename = `Recording ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.webm`,
            frameRate = 25,
            pixelScale = 2,
            download = true,
            recorderOptions = {
                mimeType: 'video/x-matroska;codecs=avc1',
                audioBitsPerSecond: 256000,
                videoBitsPerSecond: 20000000
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

        if (!Number.isInteger(pixelScale) || pixelScale < 1) {
            throw new Error('CanvasRecorder: pixel scale must be a positive integer.');
        }
        const recordingCanvas = document.createElement('canvas');
        recordingCanvas.width = canvas.width * pixelScale;
        recordingCanvas.height = canvas.height * pixelScale;
        const context = recordingCanvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        let copyFrame: number | undefined;
        const copyPixels = () => {
            context.drawImage(canvas, 0, 0, recordingCanvas.width, recordingCanvas.height);
        };
        const copyLoop = () => {
            copyPixels();
            copyFrame = requestAnimationFrame(copyLoop);
        };
        copyPixels();
        const stream = recordingCanvas.captureStream(frameRate);

        let recorder: MediaRecorder;
        try {
            if (audio) {
                let audioSource = this.audioSources.get(audio);
                if (!audioSource) {
                    const context = new AudioContext();
                    const source = context.createMediaElementSource(audio);
                    const destination = context.createMediaStreamDestination();
                    source.connect(destination);
                    source.connect(context.destination);
                    audioSource = { context, destination };
                    this.audioSources.set(audio, audioSource);
                }
                void audioSource.context.resume().catch(error => console.error('Could not resume recording audio:', error));
                stream.addTrack(audioSource.destination.stream.getAudioTracks()[0].clone());
            }
            recorder = new MediaRecorder(stream, { mimeType, ...recorderOptions });
        } catch (error) {
            stream.getTracks().forEach(track => track.stop());
            throw error;
        }

        recorder.ondataavailable = event => {
            event.data.size && chunks.push(event.data);
        };
        recorder.onstop = () => {
            cancelAnimationFrame(copyFrame);
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
                copyLoop();
            },
            set filename(name) {
                link.download = name;
            },
            stop() {
                cancelAnimationFrame(copyFrame);
                recorder.stop();
                return chunks;
            },
            dispose() {
                cancelAnimationFrame(copyFrame);
                stream.getTracks().forEach(track => track.stop());
            },
            stream,
            recorder
        };
    }

    /**
        * Records canvas video and optional media audio; prefers MP4 with WebM fallback.
     */
    public recordVideo(
        canvas: HTMLCanvasElement = document.getElementById('aisa-canvas') as HTMLCanvasElement,
        durationMilliseconds: number = 10000,
        onStopped: () => void = () => {},
        audio?: HTMLMediaElement
    ): void {
        if (this.recording) return;
        if (!canvas || !Number.isFinite(durationMilliseconds) || durationMilliseconds <= 0) {
            throw new Error('CanvasRecorder: a canvas and positive duration are required.');
        }
        const formats = audio
            ? ['video/mp4;codecs="avc1.42E01E,mp4a.40.2"', 'video/mp4', 'video/webm;codecs=vp8,opus', 'video/webm']
            : ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm'];
        const mimeType = formats
            .find(type => MediaRecorder.isTypeSupported(type));
        if (!mimeType) throw new Error('CanvasRecorder: no supported video format.');
        const extension = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';
        console.info('recording video...');
        const date = new Date();

        // options
        this.canvasRecordingOptions = {
            filename: `Aisa ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.${extension}`,
            frameRate: 30,
            download: true,
            recorderOptions: {
                mimeType,
                audioBitsPerSecond: 256000,
                videoBitsPerSecond: 20000000
            }
        }

        // Create canvas video recorder
        this.canvasRecorder = this.createCanvasRecorder(canvas, this.canvasRecordingOptions, audio);
        this.canvasRecorder.recorder.addEventListener('stop', () => {
            window.clearTimeout(this.recordingTimer);
            this.recordingTimer = undefined;
            this.canvasRecorder.dispose();
            this.recording = false;
            onStopped();
        }, { once: true });
        try {
            this.canvasRecorder.start();
        } catch (error) {
            this.canvasRecorder.dispose();
            throw error;
        }
        this.recording = true;
        this.recordingTimer = window.setTimeout(() => this.saveVideo(), durationMilliseconds);
    }

    public saveVideo() {
        window.clearTimeout(this.recordingTimer);
        this.recordingTimer = undefined;
        if (!this.recording || this.canvasRecorder.recorder.state !== 'recording') return;
        this.canvasRecorder.stop();
        console.info(`saved video as ${this.canvasRecordingOptions.filename}`);
    }
}
