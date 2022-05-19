import { act, fireEvent, waitFor, within } from "@testing-library/react";
import { mockMedia, mockPortal, renderWithData, stringifyLogs } from "../test-utils";
import { Note } from "../types";
import { setData } from "../network/noNetworkStorage";
import { NetworkHandler } from "../network/NetworkHandler";

describe("List", () => {
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

    it("should load data on initial render", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        const { getItemsList } = await renderWithData([{
            id: "id1",
            city: "Kyiv",
            favouriteDish: {
                name: "Borshch",
            },
            date: "22/02/2022",
            grades: [1, 2, 3],
        }, {
            id: "id2",
            city: "Lviv",
            favouriteDish: {
                name: "Pstruh",
            },
            date: "23/02/2022",
            grades: [4, 5, 6],
        }] as Note[]);

        expect(getItemsList()).toHaveLength(2);
        const consoleCalls = stringifyLogs(consoleSpy);
        expect(consoleCalls.some((log) => log.includes("Request failed:"))).toBeFalsy();
    });

    it("should display grades separated by comas", async () => {
        const { getItemByCity } = await renderWithData([{
            id: "id1",
            city: "Poltava",
            favouriteDish: {
                name: "Halushky",
            },
            date: "22/02/2022",
            grades: [1.1, 2.3, 3.4],
        }]);

        const item = getItemByCity("Poltava");
        const gradesElement = within(item).getByTestId("list-item-grades");

        expect(gradesElement.innerHTML).toEqual("1.1, 2.3, 3.4");
    });

    it("should handle item removal", async () => {
        const { getItemByCity, getItemsList, rerender } = await renderWithData([{
            id: "id1",
            city: "Kovel",
            favouriteDish: {
                name: "Baked Potato",
            },
            date: "01/02/2022",
            grades: [9],
        }, {
            id: "id2",
            city: "Volodymyr Volynsky",
            favouriteDish: {
                name: "Mashed Potato",
            },
            date: "02/02/2022",
            grades: [9.9],
        }]);

        const item = getItemByCity("Kovel");
        const removeButton = within(item).getByTestId("remove-item-button");

        act(() => {
            fireEvent.click(removeButton);
        });
        jest.runAllTimers();
        rerender();
        await waitFor(() => expect(getItemsList()).toHaveLength(1));
    });

    it("should log error if data load failed", async () => {
        NetworkHandler.debug.shouldFail = true;
        const consoleSpy = jest.spyOn(console, "log");
        await renderWithData([]);

        const consoleCalls = stringifyLogs(consoleSpy);
        expect(consoleCalls.some((log) => log.includes("Request failed:"))).toBeTruthy();
        NetworkHandler.debug.shouldFail = false;
    });
});
