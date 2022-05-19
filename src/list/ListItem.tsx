import React from "react";
import { ItemActions } from "./ItemActions";
import { Note } from "../types";
import { NetworkHandler } from "../network/NetworkHandler";
import { isResponseError, useRequest } from "../network/useRequest";

export const ListItem: React.FC<{
    note: Note;
    onRemove: (list: Note[]) => void;
}> = ({ note, onRemove }) => {
    const onItemRemove = React.useCallback(() => NetworkHandler.removeNote(note.id), [note.id]);

    const { makeRequest, response } = useRequest(onItemRemove);

    const onRemoveClick = React.useCallback(() => {
        makeRequest();
    }, [onRemove, makeRequest]);

    React.useEffect(() => {
        if (response && !isResponseError(response)) {
            onRemove(response);
        }
    }, [response]);
    return (
        <tr data-test="list-item" data-id={note.id}>
            <td data-test="list-item-city">{note.city}</td>
            <td data-test="list-item-date">{note.date}</td>
            <td data-test="list-item-dish">{note.favouriteDish.name}</td>
            <td data-test="list-item-grades">{note.grades.join(", ")}</td>
            <td data-test="list-item-actions"><ItemActions onRemove={onRemoveClick} /></td>
        </tr>
    );
};
