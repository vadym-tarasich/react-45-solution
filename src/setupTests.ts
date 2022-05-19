// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import { Note } from "./types";

configure({ testIdAttribute: "data-test" });

jest.mock("./network/noNetworkStorage", () => {
    class NS {
        public static setData(data: Note[]) {
            NS.storage = data;
        }

        public static getData() {
            return NS.storage;
        }

        private static storage: Note[] = [];
    }

    return NS;
});
