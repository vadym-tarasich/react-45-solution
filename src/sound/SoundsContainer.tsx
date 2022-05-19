import React from "react";

// you can replace these sounds with whatever you want, just keep naming the same ;)

// @ts-ignore to avoid ts error of unknown module
import positiveSoundSrc from "./positive-tone.wav";
// @ts-ignore to avoid ts error of unknown module
import negativeSoundSrc from "./negative-tone.wav";

export const POSITIVE_SOUND_ID = "positive-sound";
export const NEGATIVE_SOUND_ID = "negative-sound";

export const SoundsContainer: React.FC = () => {
    return (
        <div style={{ position: "fixed", top: -100, left: -100 }}>
            <audio id={POSITIVE_SOUND_ID} src={positiveSoundSrc as string} />
            <audio id={NEGATIVE_SOUND_ID} src={negativeSoundSrc as string} />
        </div>
    );
};
