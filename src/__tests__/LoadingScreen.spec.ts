import { act, fireEvent, waitForElementToBeRemoved, within } from "@testing-library/react";
import { mockMedia, mockPortal, renderWithData } from "../test-utils";
import { setData } from "../network/noNetworkStorage";

describe("Loading screen", () => {
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

    it("should show/hide on network action", async () => {
        const { getItemByCity, getLoadingScreen } = await renderWithData([{
            id: "id1",
            city: "RemoveCity",
            favouriteDish: {
                name: "Ashes",
            },
            date: "01/02/2022",
            grades: [9],
        }]);

        const item = getItemByCity("RemoveCity");
        const removeButton = within(item).getByTestId("remove-item-button");

        expect(getLoadingScreen()).toBeFalsy();

        act(() => {
            fireEvent.click(removeButton);
        });

        expect(getLoadingScreen()).toBeTruthy();
        jest.runAllTimers();

        await waitForElementToBeRemoved(() => getLoadingScreen());
        expect(getLoadingScreen()).toBeFalsy();
    });
});
