import React from "react";
import { TranslateText } from "../lang/TranslateText";
import { TranslationKey } from "../lang/translations";
import { withSound } from "../sound/withSound";

interface ButtonInterface {
    onClick: () => void;
    dataAttr: string;
    translationKey: TranslationKey;
    isDisabled?: boolean;
    classNames?: string;
}

export const Button: React.FC<ButtonInterface> = ({ onClick, dataAttr, translationKey, isDisabled, classNames }) => {
    return (
        <button
            data-test={dataAttr}
            className={`button button-primary${classNames ? ` ${classNames}` : ""}`}
            value="Save note"
            disabled={isDisabled}
            onClick={onClick}
        >
            <TranslateText translationKey={translationKey} />
        </button>
    );
};

export const ButtonWithSound = withSound(Button);
