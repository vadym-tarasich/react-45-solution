import { fireEvent, within } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { setData } from "../network/noNetworkStorage";
import {
    addGrades,
    enterFormData,
    mockMedia,
    mockPortal,
    renderWithData,
    submitForm,
} from "../test-utils";

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

    it("should play sound on remove button click", async () => {
        const { getItemByCity } = await renderWithData([{
            id: "id1",
            city: "Ivanychi",
            favouriteDish: {
                name: "Varenyky",
            },
            date: "22/02/2022",
            grades: [10, 10, 10],
        }]);

        const removeButton = within(getItemByCity("Ivanychi")).getByTestId("remove-item-button");

        act(() => {
            fireEvent.click(removeButton);
        });

        expect(playMock).toBeCalledTimes(1);
    });

    it("should play sound on add grade button click", async () => {
        const app = await renderWithData([{
            id: "id1",
            city: "Ivanychi",
            favouriteDish: {
                name: "Varenyky",
            },
            date: "22/02/2022",
            grades: [10, 10, 10],
        }]);

        await addGrades(app, [5]);

        expect(playMock).toBeCalledTimes(1);
    });

    it("should play sound on save form", async () => {
        const app = await renderWithData([{
            id: "id1",
            city: "Ivanychi",
            favouriteDish: {
                name: "Varenyky",
            },
            date: "22/02/2022",
            grades: [10, 10, 10],
        }]);

        await enterFormData(app, {
            id: "id1",
            city: "Novovolynsk",
            favouriteDish: {
                name: "Charcoal",
            },
            date: "01/05/2010",
            grades: [1],
        });

        await submitForm(app);

        // first time on grade add
        // second - on save
        expect(playMock).toBeCalledTimes(2);
    });
});
