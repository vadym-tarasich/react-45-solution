import React from "react";
import { ListItem } from "./ListItem";

import "./List.css";
import { TranslateText } from "../lang/TranslateText";
import { Note } from "../types";

export const List: React.FC<{ list: Note[]; onRemove: (list: Note[]) => void; }> = ({ list, onRemove }) => {
    return (
        <table className="list">
            <thead>
                <tr>
                    <th><TranslateText translationKey="tableHeader.city" /></th>
                    <th><TranslateText translationKey="tableHeader.date" /></th>
                    <th><TranslateText translationKey="tableHeader.dish" /></th>
                    <th><TranslateText translationKey="tableHeader.grades" /></th>
                    <th style={{ width: "15rem" }}><TranslateText translationKey="tableHeader.actions" /></th>
                </tr>
            </thead>
            <tbody>
                {list.map((note) => <ListItem key={note.id} note={note} onRemove={onRemove} />)}
            </tbody>
        </table>
    );
};
