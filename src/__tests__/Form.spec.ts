import { act, fireEvent, waitFor } from "@testing-library/react";
import {
    addGrades,
    changeInput,
    enterFormData,
    mockMedia,
    mockPortal,
    renderWithData,
    stringifyLogs,
    submitForm,
} from "../test-utils";
import { setData } from "../network/noNetworkStorage";
import { Note } from "../types";
import { NetworkHandler } from "../network/NetworkHandler";

describe("Form", () => {
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
        NetworkHandler.debug.shouldFail = false;
    });

    describe("requests handling", () => {
        it("should add new item", async () => {
            const app = await renderWithData([]);
            const city = "Stockholm";

            await enterFormData(app, {
                id: "id",
                city: city,
                favouriteDish: {
                    name: "Meatballs",
                    note: "Expensive",
                },
                date: "12/05/2010",
                grades: [1.2, 3.3],
            });

            await submitForm(app);

            await act(async () => {
                expect(app.getItemsList()).toHaveLength(1);

                const cityData = app.getValuesFromCity(city);
                expect(cityData.city).toEqual(city);
                expect(cityData.dish).toEqual("Meatballs");
                expect(cityData.date).toEqual("12/05/2010");
                expect(cityData.grades).toEqual("1.2, 3.3");
                expect(app.getFormError()).toBeFalsy();
            });
        });

        it("should clear form on successful submit", async () => {
            const app = await renderWithData([]);
            const city = "Amsterdam";

            await enterFormData(app, {
                id: "id",
                city: city,
                favouriteDish: {
                    name: "Mushroom",
                    note: "Funny",
                },
                date: "01/04/2022",
                grades: [9.2, 8.7],
            });

            await submitForm(app);

            await act(async () => {
                expect(app.getItemsList()).toHaveLength(1);
                expect(app.getCityInput().value).toEqual("");
                expect(app.getDishInput().value).toEqual("");
                expect(app.getDishNotesInput().value).toEqual("");
                expect(app.getDateInput().value).toEqual("");
                expect(app.getGradesInput().value).toEqual("");
                expect(app.getFormError()).toBeFalsy();
            });
        });

        it("should NOT clear form on submit with ERROR", async () => {
            NetworkHandler.debug.shouldFail = true;
            const consoleSpy = jest.spyOn(console, "log");

            const app = await renderWithData([]);
            const city = "Tokyo";

            await enterFormData(app, {
                id: "id",
                city: city,
                favouriteDish: {
                    name: "Sushi",
                    note: "Octopus",
                },
                date: "11/11/2022",
                grades: [10, 9, 8, 7],
            });

            await submitForm(app);

            await act(async () => {
                expect(app.getItemsList()).toHaveLength(0);
                expect(app.getCityInput().value).toEqual(city);
                expect(app.getDishInput().value).toEqual("Sushi");
                expect(app.getDishNotesInput().value).toEqual("Octopus");
                expect(app.getGradesInput().value).toEqual("");
                expect(app.getGrades()).toHaveLength(4);

                const consoleCalls = stringifyLogs(consoleSpy);
                expect(consoleCalls.some((log) => log.includes("Request failed:"))).toBeTruthy();
            });

            consoleSpy.mockRestore();
            NetworkHandler.debug.shouldFail = false;
        });

        it("should show error message if form submit failed", async () => {
            const consoleSpy = jest.spyOn(console, "log");
            NetworkHandler.debug.shouldFail = true;

            const app = await renderWithData([]);
            const city = "Tokyo";

            await enterFormData(app, {
                id: "id",
                city: city,
                favouriteDish: {
                    name: "Sushi",
                    note: "Octopus",
                },
                date: "11/11/2022",
                grades: [10, 9, 8, 7],
            });

            await submitForm(app);

            await act(async () => {
                expect(app.getFormError()).toBeTruthy();
            });

            NetworkHandler.debug.shouldFail = false;
            consoleSpy.mockRestore();
        });
    });

    describe("form validation", () => {
        const fullData: Note = {
            id: "id",
            city: "Budapest",
            favouriteDish: {
                name: "Guliash",
                note: "Spicy",
            },
            date: "11/11/2011",
            grades: [10],
        };

        const checkWithMissingData = async (data: Partial<Note>) => {
            const app = await renderWithData([]);

            await enterFormData(app, {
                ...fullData,
                ...data,
            });

            await waitFor(() => app.getSaveButton().getAttribute("disabled") === "");
            expect(app.getSaveButton().getAttribute("disabled")).toEqual("");

            await enterFormData(app, fullData);

            await waitFor(() => app.getSaveButton().getAttribute("disabled") === null);
            expect(app.getSaveButton().getAttribute("disabled")).toEqual(null);
        };

        it("should not allow to submit a form if city is empty", async () => {
            await checkWithMissingData({
                city: "",
            });
        });

        it("should not allow to submit a form if dish name is empty", async () => {
            await checkWithMissingData({
                favouriteDish: {
                    name: "",
                    note: "",
                },
            });
        });

        it("should allow to submit a form if dish note is empty", async () => {
            const app = await renderWithData([]);

            await enterFormData(app, {
                ...fullData,
                favouriteDish: {
                    name: "Name",
                    note: "",
                },
            });

            await waitFor(() => app.getSaveButton().getAttribute("disabled") === null);
            expect(app.getSaveButton().getAttribute("disabled")).toEqual(null);
        });

        it("should not allow to submit a form if grades are empty", async () => {
            await checkWithMissingData({
                grades: [],
            });
        });

        it("should not allow to submit a form if date is empty", async () => {
            await checkWithMissingData({
                date: "",
            });
        });
    });

    describe("grades validation", () => {
        it("should NOT allow to add grades lower than 0.1", async () => {
            const app = await renderWithData([]);

            await act(async () => {
                changeInput(app.getGradesInput(), 0.5);
                await waitFor(() => expect(app.getGradesButton().getAttribute("disabled")).toEqual(null));
            });

            await act(async () => {
                changeInput(app.getGradesInput(), 0.01);
                await waitFor(() => expect(app.getGradesButton().getAttribute("disabled")).toEqual(""));
            });
        });

        it("should NOT allow to add grades greater than 10", async () => {
            const app = await renderWithData([]);

            await act(async () => {
                changeInput(app.getGradesInput(), 6);
                await waitFor(() => expect(app.getGradesButton().getAttribute("disabled")).toEqual(null));
            });

            await act(async () => {
                changeInput(app.getGradesInput(), 10);
                await waitFor(() => expect(app.getGradesButton().getAttribute("disabled")).toEqual(null));
            });

            await act(async () => {
                changeInput(app.getGradesInput(), 11);
                await waitFor(() => expect(app.getGradesButton().getAttribute("disabled")).toEqual(""));
            });
        });

        it("should remove grades on click on the grade", async () => {
            const app = await renderWithData([]);

            await addGrades(app, [10, 7.7, 6.6]);
            expect(app.getGrades()).toHaveLength(3);
            expect(app.getGradeByValue(10)).toBeTruthy();
            expect(app.getGradeByValue(7.7)).toBeTruthy();
            expect(app.getGradeByValue(6.6)).toBeTruthy();

            const grade = app.getGradeByIndex(1);

            act(() => {
                fireEvent.mouseOver(grade);
            });

            act(() => {
                fireEvent.click(grade);
            });

            expect(app.getGrades()).toHaveLength(2);
            expect(app.getGradeByValue(10)).toBeTruthy();
            expect(app.getGradeByValue(6.6)).toBeTruthy();
        });
    });
});
