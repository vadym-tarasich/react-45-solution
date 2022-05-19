import { getData, setData } from "../network/noNetworkStorage";

describe("App", () => {
    describe("test mocked local storage for consistency", () => {
        it("should return data set", () => {
            setData([{ some: "data" } as never]);
            expect(getData()).toEqual([{ some: "data" }]);

            setData([{ another: "data" } as never]);
            expect(getData()).toEqual([{ another: "data" }]);
        });
    });
});
