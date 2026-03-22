/**
 * Encodes multi-channel 16-bit PCM WAV data and triggers browser downloads.
 */
export class WavEncoder {

    /**
     * Encode an arbitrary number of channels into a WAV Blob.
     *
     * @param channels   Array of Float32Array channels (each in [-1, 1]).
     *                   2 channels = stereo (XY), 3 channels = XYZ.
     * @param sampleRate Sample rate in Hz (e.g. 44100, 22050)
     */
    public static encodeChannels(
        channels: Float32Array[],
        sampleRate: number
    ): Blob {
        const numChannels = channels.length;
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const numSamples = channels[0].length;
        const dataSize = numSamples * numChannels * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        // ---- RIFF header ----
        WavEncoder.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        WavEncoder.writeString(view, 8, 'WAVE');

        // ---- fmt chunk ----
        WavEncoder.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);                                         // PCM format
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // byte rate
        view.setUint16(32, numChannels * bytesPerSample, true);              // block align
        view.setUint16(34, bitsPerSample, true);

        // ---- data chunk ----
        WavEncoder.writeString(view, 36, 'data');
        view.setUint32(40, dataSize, true);

        // Interleaved samples across all channels
        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                const v = Math.max(-1, Math.min(1, channels[ch][i]));
                view.setInt16(offset, v * 0x7FFF, true);
                offset += 2;
            }
        }

        return new Blob([buffer], { type: 'audio/wav' });
    }

    /**
     * Convenience wrapper for stereo (2-channel) encoding.
     */
    public static encode(
        leftChannel: Float32Array,
        rightChannel: Float32Array,
        sampleRate: number
    ): Blob {
        return WavEncoder.encodeChannels([leftChannel, rightChannel], sampleRate);
    }

    /** Trigger a file download in the browser. */
    public static download(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    private static writeString(view: DataView, offset: number, str: string): void {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    }
}
