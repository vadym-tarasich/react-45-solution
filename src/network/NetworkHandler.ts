import { pullAt } from "lodash";
import { Note } from "../types";
import { getData, setData } from "./noNetworkStorage";

interface NetworkDebug {
    shouldFail: boolean;
    responseDelay: number;
}

export class NetworkHandler {
    /**
     * purely for debug purposes
     * you can change responseDelay to have different synthetic delays for your requests
     * you can switch shouldFail to 'true' so any request you make would fail
     */
    public static debug: NetworkDebug = {
        shouldFail: false,
        responseDelay: 1000,
    };

    /**
     * returns stored notes array
     */
    public static getNotes(): Promise<Note[]> {
        return NetworkHandler.makePromise(getData());
    }

    /**
     * Adds note to the storage
     * @param note new note to add
     * @return updated notes array
     */
    public static addNote(note: Note): Promise<Note[]> {
        const data = getData();
        data.push(note);
        setData(data);

        return NetworkHandler.makePromise(getData());
    }

    /**
     * Allows to edit note to the storage
     * @param note updated note to be saved to the storage
     * @return updated notes array
     */
    public static editNote(updatedNote: Note): Promise<Note[]> {
        const data = getData();
        const noteToEditIndex = data.findIndex((note) => note.id === updatedNote.id);

        if (noteToEditIndex === -1) {
            return Promise.reject(new Error(`No note with id ${updatedNote.id} found`));
        }

        data[noteToEditIndex] = { ...updatedNote };
        setData(data);

        return NetworkHandler.makePromise(getData());
    }

    /**
     * Removes note from the storage
     * @param noteId id of the note to be removed
     * @return updated notes array
     */
    public static removeNote(noteId: string): Promise<Note[]> {
        const data = getData();
        const noteToRemoveIndex = data.findIndex((note) => note.id === noteId);

        if (noteToRemoveIndex === -1) {
            return Promise.reject(new Error(`No note with id ${noteId} found`));
        }

        pullAt(data, noteToRemoveIndex);
        setData(data);

        return NetworkHandler.makePromise(getData());
    }

    private static makePromise<DT>(data: DT): Promise<DT> {
        return new Promise<DT>((resolve, reject) => {
            if (NetworkHandler.debug.shouldFail) {
                window.setTimeout(() => {
                    reject(new Error("Bad request"));
                }, NetworkHandler.debug.responseDelay);
            } else {
                window.setTimeout(() => {
                    resolve(data);
                }, NetworkHandler.debug.responseDelay);
            }
        });
    }
}
