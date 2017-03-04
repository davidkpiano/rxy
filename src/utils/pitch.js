
const pitches = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
];

export function getScale(fromPitch, type = 'MAJOR') {
    const index = pitches.indexOf(fromPitch);
    switch (type) {
        case 'MAJOR':
        default:
            return [0, 2, 4, 5, 7, 9, 11]
                .map(i => pitches[(i + index) % 12]);
    }
}

export function pitchMeta(pitch) {
    const [_, note, octave] = pitch.match(/^(.*)(\d)$/);

    return {
        note,
        octave: +octave,
    }
}

export function pitchIndex(pitch, fromPitch = 'C4') {
    const { note, octave } = pitchMeta(pitch);
    const { note: fromNote, octave: fromOctave } = pitchMeta(fromPitch);

    const scale = getScale(fromNote);

    let index = scale.indexOf(note);

    index += (octave - fromOctave) * 7;

    return index;
}
