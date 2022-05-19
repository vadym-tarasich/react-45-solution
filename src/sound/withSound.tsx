import React from "react";
import { NEGATIVE_SOUND_ID, POSITIVE_SOUND_ID } from "./SoundsContainer";

interface WithSoundProps {
    soundType: "positive" | "negative";
    onClick: React.EventHandler<React.MouseEvent>;
}

// todo: implement HOC such way, that sound is played on wrapped component click
// you can play sounds from SoundsContainer by getting those sounds by id or through the context - your choice
export function withSound<P>(Component: React.FC<P>): React.FC<WithSoundProps & P> {
    const ButtonWithSound: React.FC<WithSoundProps & P> = ({ soundType, onClick, ...props }) => {
        const positiveSoundRef = React.useRef<HTMLAudioElement>();
        const negativeSoundRef = React.useRef<HTMLAudioElement>();

        React.useEffect(() => {
            positiveSoundRef.current = document.getElementById(POSITIVE_SOUND_ID)! as HTMLAudioElement;
            negativeSoundRef.current = document.getElementById(NEGATIVE_SOUND_ID)! as HTMLAudioElement;
        }, []);

        const onSound = React.useCallback((e) => {
            const element = soundType === "positive" ? positiveSoundRef.current : negativeSoundRef.current;

            element?.play();

            onClick(e);
        }, [soundType, props, onClick]);
        return <Component onClick={onSound} {...props as P} />;
    };

    return ButtonWithSound;
}
