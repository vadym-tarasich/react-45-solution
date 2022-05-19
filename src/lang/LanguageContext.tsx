import React from "react";
import { Language } from "../types";
import { TranslationKey, TRANSLATIONS } from "./translations";

// the context interface
// todo: hint: use this interface to represent the context and remove 'eslint-disable' on the next line
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LanguageState {
    currentLanguage: Language;
    toggleLanguage: () => void;
    getTranslatedValue: (key: TranslationKey) => string;
}

export const LangContext = React.createContext<LanguageState | null>(null);
/*
* todo: replace mock provider with real one
* hint: TranslateText is used as component and main consumer of translation context
* hint: LanguageSwitchButton is a component that uses the context to change the language
*/
export const LanguageProvider: React.FC = ({ children }) => {
    const [lang, setLang] = React.useState<Language>("en");

    const getTranslatedValue = React.useCallback((key: TranslationKey) => TRANSLATIONS[lang][key], [lang]);
    const toggle = React.useCallback(() => setLang((lang) => lang === "en" ? "es" : "en"), [setLang]);

    const context = React.useMemo<LanguageState>(() => ({
        currentLanguage: lang,
        toggleLanguage: toggle,
        getTranslatedValue: getTranslatedValue,
    }), [lang, toggle]);

    return (
        <LangContext.Provider value={context}>
            {children}
        </LangContext.Provider>
    );
};
