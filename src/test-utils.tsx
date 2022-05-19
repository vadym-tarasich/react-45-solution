import { act, fireEvent, render, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import React from "react";
import { App } from "./App";
import { Note } from "./types";
import { setData } from "./network/noNetworkStorage";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getApp = () => {
    const { container, rerender } = render(<App />);

    const getForm = () => within(container).getByTestId("note-add-form");
    const getItemByCity = (city: string) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const element = Array.from(container.querySelectorAll<HTMLElement>('[data-test="list-item"]')).find(element => {
            const cityElement = within(element).getByTestId("list-item-city");

            return cityElement.innerHTML === city;
        });

        if (!element) {
            throw Error(`No list item found for city ${city}`);
        }

        return element;
    };

    return {
        rerender: () => rerender(<App />),
        getForm: getForm,
        getCityInput: () => within(getForm()).getByTestId<HTMLInputElement>("form-city"),
        getDishInput: () => within(getForm()).getByTestId<HTMLInputElement>("form-dish"),
        getDishNotesInput: () => within(getForm()).getByTestId<HTMLTextAreaElement>("form-dish-note"),
        getDateInput: () => within(getForm()).getByTestId<HTMLInputElement>("form-date"),
        getGradesButton: () => within(getForm()).getByTestId("add-grade-button"),
        getGradesInput: () => within(getForm()).getByTestId<HTMLInputElement>("add-grade-input"),
        getGrades: () => container.querySelectorAll<HTMLElement>('[data-test^="grade-button"]'),
        getGradeByIndex: (gradeIndex: number) => container.querySelectorAll('[data-test^="grade-button"]')[gradeIndex],
        getGradeByValue: (grade: number) => within(getForm()).getByTestId(`grade-button-${grade}`),
        getSaveButton: () => within(getForm()).getByTestId("form-save-button"),
        getFormError: () => document.querySelector('[data-test="form-error"]'),
        getAllTranslations: () => container.querySelectorAll('[data-test="translated-text"]'),
        getLanguageButton: () => within(container).getByTestId("land-switch-button"),
        getContainer: () => container,
        getLoadingScreen: () => document.querySelector('[data-test="loading-overlay"]'),
        getItemsList: () => container.querySelectorAll('[data-test="list-item"]'),
        getItemByCity: getItemByCity,
        getValuesFromCity: (cityName: string) => {
            const row = getItemByCity(cityName);
            const city = within(row).getByTestId("list-item-city").innerHTML;
            const date = within(row).getByTestId("list-item-date").innerHTML;
            const dish = within(row).getByTestId("list-item-dish").innerHTML;
            const grades = within(row).getByTestId("list-item-grades").innerHTML;

            return {
                city: city,
                date: date,
                dish: dish,
                grades: grades,
            };
        },
    };
};

export const renderWithData = async (data: Note[]) => {
    setData(data);

    const app = getApp();
    jest.runAllTimers();

    await act(async () => {
        await waitFor(() => app.getContainer());
        await waitFor(() => !app.getLoadingScreen());
    });

    return app;
};

export function mockPortal() {
    const overlayElement = document.createElement("div");
    overlayElement.id = "loading-overlay";

    document.body.appendChild(overlayElement);
}

export function mockMedia() {
    const playMock = jest.fn();
    Object.defineProperty(global.window.HTMLMediaElement.prototype, "play", {
        configurable: true,
        // Define the property getter
        get() {
            return playMock;
        },
    });

    return playMock;
}

export function changeInput(input: HTMLElement, value: string | number) {
    fireEvent.change(input,
        {
            target: { value: value },
            currentTarget: { value: value },
        },
    );
}

export function stringifyLogs(spy: jest.SpyInstance<void, any[]>): string[] {
    return spy.mock.calls.map((calls) => calls.map(call => call.toString()).join(" "));
}

export async function enterFormData(app: Awaited<ReturnType<typeof renderWithData>>, note: Note) {
    await clearGrades(app);

    act(() => {
        changeInput(app.getCityInput(), note.city);
        changeInput(app.getDishInput(), note.favouriteDish.name);

        if (note.favouriteDish.note) {
            changeInput(app.getDishNotesInput(), note.favouriteDish.note);
        }
    });

    await addGrades(app, note.grades);

    expect(app.getGrades()).toHaveLength(note.grades.length);

    await act(async () => {
        const date = note.date.split("/").reverse().join("-");
        changeInput(app.getDateInput(), date);
    });
}

export async function submitForm(app: Awaited<ReturnType<typeof renderWithData>>) {
    await act(async () => {
        await waitFor(() => app.getSaveButton().getAttribute("disabled") === null);
        fireEvent.click(app.getSaveButton());
        app.rerender();
        expect(app.getLoadingScreen()).toBeTruthy();
    });

    jest.runAllTimers();

    await waitForElementToBeRemoved(() => app.getLoadingScreen());
    expect(app.getLoadingScreen()).toBeFalsy();
}

export async function addGrades(app: Awaited<ReturnType<typeof renderWithData>>, grades: number[]) {
    for (const grade of grades) {
        await act(async () => {
            changeInput(app.getGradesInput(), grade);
            await waitFor(() => app.getGradesButton().getAttribute("disabled") !== null);
            fireEvent.click(app.getGradesButton());
        });
    }
}

async function clearGrades(app: Awaited<ReturnType<typeof renderWithData>>) {
    const grades = Array.from(app.getGrades());

    for (const gradeElement of grades) {
        await act(async () => {
            fireEvent.mouseOver(gradeElement);
        });

        await act(async () => {
            fireEvent.click(gradeElement);
        });
    }
}
