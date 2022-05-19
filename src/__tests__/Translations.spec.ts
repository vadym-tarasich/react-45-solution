import { fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { setData } from "../network/noNetworkStorage";
import { mockMedia, mockPortal, renderWithData } from "../test-utils";
import { isTranslationKey, TRANSLATIONS } from "../lang/translations";
import { Language } from "../types";

describe("Translations", () => {
    jest.useFakeTimers();

    let playMock = jest.fn();

    beforeEach(() => {
        mockPortal();
        playMock = mockMedia();
    });

    afterEach(() => {
        playMock.mockClear();
        setData([]);
        jest.clearAllMocks();
    });

    it("should render translated to English by default", async () => {
        const app = await renderWithData([]);

        await waitFor(() => app.getLanguageButton().getAttribute("data-lang") === "en");
        checkTranslationsForLanguage(app, "en");
    });

    it("should render translated to spanish on language button click", async () => {
        const app = await renderWithData([]);

        act(() => {
            fireEvent.click(app.getLanguageButton());
        });

        await waitFor(() => app.getLanguageButton().getAttribute("data-lang") === "es");

        checkTranslationsForLanguage(app, "es");
    });

    it("should switch languages on language button click", async () => {
        const app = await renderWithData([]);

        act(() => {
            fireEvent.click(app.getLanguageButton());
        });

        await waitFor(() => app.getLanguageButton().getAttribute("data-lang") === "es");

        act(() => {
            fireEvent.click(app.getLanguageButton());
        });
        await waitFor(() => app.getLanguageButton().getAttribute("data-lang") === "en");

        act(() => {
            fireEvent.click(app.getLanguageButton());
        });
        await waitFor(() => app.getLanguageButton().getAttribute("data-lang") === "es");

        checkTranslationsForLanguage(app, "es");
    });
});

function checkTranslationsForLanguage(app: Awaited<ReturnType<typeof renderWithData>>, lang: Language) {
    const translationElements = Array.from(app.getAllTranslations());

    translationElements.forEach((translationElement) => {
        const key = translationElement.getAttribute("data-test-key");

        if (!isTranslationKey(key)) {
            throw new Error(`No such translation key found: ${key}`);
            return;
        }
        const expectedTranslation = TRANSLATIONS[lang][key];
        expect(translationElement.innerHTML).toEqual(expectedTranslation);
    });
}
