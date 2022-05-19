import React from "react";
import { Language } from "../types";

import "./LanguageSwitch.css";
import { LangContext } from "./LanguageContext";

const langToFlagMap: Record<Language, string> = {
    en: "🇬🇧",
    es: "🇪🇸",
};

// todo: toggles language on click
// no need of any fancy UX. Just toggle on click :)
export const LanguageSwitchButton: React.FC = () => {
    const context = React.useContext(LangContext);

    if (!context) {
        throw new Error("No lang context");
    }
    const { currentLanguage: lang, toggleLanguage } = context;

    return (
        <div
            data-test="land-switch-button"
            data-lang={lang}
            className="lang-switch"
            onClick={toggleLanguage}
        >
            {langToFlagMap[lang]}
        </div>
    );
};
