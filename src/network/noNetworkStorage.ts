import { uniqueId } from "lodash";
import { Note } from "../types";

function getStorageId() {
    let TASK_STORAGE_ID = sessionStorage.getItem("STORAGE_ID");

    if (!TASK_STORAGE_ID) {
        TASK_STORAGE_ID = uniqueId("storage_");
        sessionStorage.setItem("STORAGE_ID", TASK_STORAGE_ID);
    }

    return TASK_STORAGE_ID;
}

const TASK_STORAGE_ID = getStorageId();

type StorageData = Note[];

export function setData(data: StorageData): void {
    localStorage.setItem(TASK_STORAGE_ID, JSON.stringify(data));
}

export function getData(): StorageData {
    const storageData = localStorage.getItem(TASK_STORAGE_ID);

    return storageData ? JSON.parse(storageData) as StorageData : [];
}
