#!/usr/bin/env python
'''
Track beat events in an audio file to JSRocket format

Usage:   ./beat_tracker.py [-h] input_file.mp3
https://github.com/librosa/librosa
'''
from __future__ import print_function

import argparse
import sys
import numpy as np
import librosa

# Must match the constants in MusicProperties.ts
BPM = 129.0
ROWS_PER_BEAT = 8
ROW_RATE = BPM / 60 * ROWS_PER_BEAT  # rows per second

def rocket_convert(first_beat_time, duration, beat_interval=None):
    '''Generate evenly-spaced bass hits on a strict grid, starting from the
    first known beat time.

    If beat_interval (seconds) is provided, the row spacing is derived from it
    so that the rocket data exactly matches the audio.  Otherwise ROWS_PER_BEAT
    is used as the spacing.
    '''
    if beat_interval is not None:
        row_spacing = round(beat_interval * ROW_RATE)
    else:
        row_spacing = ROWS_PER_BEAT

    first_row = round(first_beat_time * ROW_RATE)

    row = first_row
    while row / ROW_RATE < duration:
        print(f'\t <key value="1" interpolation="1" row="{row}"/>')
        print(f'\t <key value="0" interpolation="0" row="{row + 4}"/>')
        row += row_spacing

def beat_track(input_file, first_beat_override=None, beat_interval=None):
    '''Beat tracking function

    :parameters:
      - input_file : str
          Path to input audio file (wav, mp3, m4a, flac, etc.)
      - first_beat_override : float or None
          If provided, use this as the first beat time (seconds) instead of
          detecting it from the audio.
      - beat_interval : float or None
          If provided, use this exact interval (seconds) between beats.
    '''

    print('Loading ', input_file)
    y, sr = librosa.load(input_file, sr=22050)

    duration = librosa.get_duration(y=y, sr=sr)

    if first_beat_override is not None:
        first_beat_time = first_beat_override
        print('Using provided first beat time: {:.3f}s'.format(first_beat_time))
    else:
        # Use a default hop size of 512 samples @ 22KHz ~= 23ms
        hop_length = 512

        # Isolate bass frequencies for bass-specific beat tracking
        print('Tracking bass beats')
        onset_env = librosa.onset.onset_strength(
            y=y, sr=sr, hop_length=hop_length,
            feature=librosa.feature.melspectrogram,
            fmax=150
        )
        tempo, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr, hop_length=hop_length)

        detected_tempo = np.asarray(tempo).item()
        print('Estimated tempo: {:0.2f} beats per minute'.format(detected_tempo))

        beat_times = librosa.frames_to_time(beats, sr=sr, hop_length=hop_length)
        first_beat_time = beat_times[0] if len(beat_times) > 0 else 0.0

    if beat_interval is not None:
        row_spacing = round(beat_interval * ROW_RATE)
        print('Using provided beat interval: {:.4f}s  ({} rows)'.format(beat_interval, row_spacing))
        print('Implied BPM: {:.2f}  (MusicProperties.ts BPM = {})'.format(60.0 / beat_interval, BPM))
    else:
        row_spacing = ROWS_PER_BEAT

    print('First beat at {:.3f}s  (row {})'.format(first_beat_time, round(first_beat_time * ROW_RATE)))
    print('Beat spacing: {} rows  ({:.4f}s)'.format(row_spacing, row_spacing / ROW_RATE))
    print('Displaying output')
    rocket_convert(first_beat_time, duration, beat_interval)
    print('done!')


def process_arguments(args):
    '''Argparse function to get the program parameters'''

    parser = argparse.ArgumentParser(description='Beat tracking example')

    parser.add_argument('input_file',
                        action='store',
                        help='path to the input file (wav, mp3, etc)')

    parser.add_argument('--first-beat',
                        type=float,
                        default=None,
                        help='first beat time in seconds (skip auto-detection)')

    parser.add_argument('--beat-interval',
                        type=float,
                        default=None,
                        help='exact beat interval in seconds (overrides ROWS_PER_BEAT spacing)')

    return vars(parser.parse_args(args))


if __name__ == '__main__':
    # Get the parameters
    parameters = process_arguments(sys.argv[1:])

    # Run the beat tracker
    beat_track(
        parameters['input_file'],
        first_beat_override=parameters['first_beat'],
        beat_interval=parameters['beat_interval'],
    )