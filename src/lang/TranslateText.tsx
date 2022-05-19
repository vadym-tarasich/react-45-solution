import React from "react";
import { TranslationKey } from "./translations";
import { LangContext } from "./LanguageContext";

interface TranslateTextProps {
    translationKey: TranslationKey;
}

// todo: use LanguageContext to get translated value
export const TranslateText: React.FC<TranslateTextProps> = ({ translationKey }) => {
    const context = React.useContext(LangContext);

    if (!context) {
        throw new Error("No lang context");
    }
    const translated = context.getTranslatedValue(translationKey);

    return (
        <span data-test="translated-text" data-test-key={translationKey}>{translated}</span>
    );
};
