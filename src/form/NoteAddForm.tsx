import { uniqueId } from "lodash";
import React from "react";
import { GradesInput } from "./GradesInput";
import { TranslateText } from "../lang/TranslateText";
import { isResponseError, useRequest } from "../network/useRequest";
import { NetworkHandler } from "../network/NetworkHandler";

import "./NoteAddForm.css";
import { Note } from "../types";
import { usePrevious } from "../usePrev";
import { ButtonWithSound } from "./ButtonWithSound";

interface NoteEditingFormProps {
    onSubmit: (list: Note[]) => void;
}

function formatDate(date: Date): string {
    const appendZero = (d: number) => d < 10 ? `0${d}` : d;
    return `${appendZero(date.getDate())}/${appendZero(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function validate({ city, favouriteDish, date, grades }: Note): boolean {
    return [city, favouriteDish.name, date, grades].every((e) => e.length > 0);
}

function useNote() {
    const [id, setId] = React.useState(uniqueId("note_"));
    const [city, setCity] = React.useState<Note["city"]>("");
    const [dish, setDish] = React.useState<Note["favouriteDish"]["name"]>("");
    const [dishNotes, setDishNotes] = React.useState<Note["favouriteDish"]["note"]>("");
    const [grades, setGrades] = React.useState<Note["grades"]>([]);
    const [date, setDate] = React.useState<Note["date"]>("");

    const note = {
        id: id,
        city: city,
        favouriteDish: {
            name: dish,
            note: dishNotes,
        },
        date: date,
        grades: grades,
    };

    const clear = React.useCallback(() => {
        setId(uniqueId("note_"));
        setCity("");
        setDish("");
        setDishNotes("");
        setGrades([]);
        setDate("");
    }, []);

    return {
        note: note,
        setCity: setCity,
        setDish: setDish,
        setDishNotes: setDishNotes,
        setGrades: setGrades,
        setDate: setDate,
        clear: clear,
    };
}

// todo: implement Note editing form (add new/edit existing)
// form has to be cleared on successful submit
// The only validation you should apply for it is check for all non-empty inputs (except the optional `Notes about dish/city`)
export const NoteAddForm: React.FC<NoteEditingFormProps> = ({ onSubmit }) => {
    const [isFormTouched, setIsFormTouched] = React.useState(false);
    const { note, setDishNotes, setDate, setGrades, setDish, setCity, clear } = useNote();
    const action = React.useCallback(async () => NetworkHandler.addNote(note),
        [note]);

    const { makeRequest, response } = useRequest(action);
    const hasError = response instanceof Error;

    const prevResponse = usePrevious(response);

    React.useEffect(() => {
        if (!hasError && response && !prevResponse) {
            onSubmit(response);
            clear();
        }
    }, [response, prevResponse, hasError, onSubmit, clear]);

    const onCityChange = React.useCallback((e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.currentTarget.value);
        setIsFormTouched(true);
    }, [setCity]);

    const onDishChange = React.useCallback((e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
        setDish(e.currentTarget.value);
        setIsFormTouched(true);
    }, [setDish]);

    const onNotesChange = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setDishNotes(e.currentTarget.value);
        setIsFormTouched(true);
    }, [setDishNotes]);

    const onGradesChange = React.useCallback((grades: Note["grades"]) => {
        setGrades(grades);
        setIsFormTouched(true);
    }, [setGrades]);

    const onDateChange = React.useCallback((e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
        setDate(formatDate(new Date(e.currentTarget.value)));
        setIsFormTouched(true);
    }, []);

    const onFormSubmit = React.useCallback(() => {
        if (!validate(note)) {
            return;
        }

        makeRequest();
        setIsFormTouched(false);

        const dateInput: HTMLInputElement = document.querySelector(`[data-test="form-date"]`)!;
        dateInput.value = "";
    }, [onSubmit, note, makeRequest]);

    const isButtonValid = validate(note);

    return (
        <div data-test="note-add-form">
            <h3 data-test="edit-form-header">
                <TranslateText translationKey="form.header.add" />
            </h3>
            <label htmlFor="city-name">
                <TranslateText translationKey="form.label.city" />
            </label>
            <input
                data-test="form-city"
                type="text"
                id="city-name"
                value={note.city}
                onKeyUp={onCityChange}
                onChange={onCityChange}
            />
            <label htmlFor="city-name">
                <TranslateText translationKey="form.label.favouriteDish" />
            </label>
            <input
                data-test="form-dish"
                type="text"
                id="favourite-dish"
                onKeyUp={onDishChange}
                onChange={onDishChange}
                value={note.favouriteDish.name}
            />
            <label htmlFor="note-field">
                <TranslateText translationKey="form.label.notes" />
            </label>
            <textarea
                data-test="form-dish-note"
                style={{ resize: "vertical" }}
                id="note-field"
                onKeyUp={onNotesChange}
                onChange={onNotesChange}
                value={note.favouriteDish.note}
            />
            <label htmlFor="grades-field">
                <TranslateText translationKey="form.label.grades" />
            </label>
            <GradesInput grades={note.grades} onChange={onGradesChange} />
            <label htmlFor="visit-date">
                <TranslateText translationKey="form.label.date" />
            </label>
            {/* NOTE! date has to be *saved* in format `DD/MM/YYYY` */}
            <input
                onChange={onDateChange}
                data-test="form-date"
                type="date"
                id="visit-date"
                defaultValue={note.date}
            />
            <div className="submit-button-container">
                {!isFormTouched && isResponseError(response) && (
                    <div className="form-error" data-test="form-error">
                        <TranslateText translationKey="form.error" />
                    </div>
                )}
                <ButtonWithSound
                    soundType="positive"
                    dataAttr="form-save-button"
                    translationKey="form.button.save"
                    isDisabled={!isButtonValid}
                    onClick={onFormSubmit}
                />
            </div>
        </div>
    );
};
