import { Language } from "../types";

const TRANSLATION_KEYS = [
    "tableHeader.city",
    "tableHeader.date",
    "tableHeader.dish",
    "tableHeader.grades",
    "tableHeader.actions",
    "actions.edit",
    "actions.remove",
    "form.header.add",
    "form.label.city",
    "form.label.favouriteDish",
    "form.label.notes",
    "form.label.grades",
    "form.label.date",
    "form.button.addGrade",
    "form.button.save",
    "form.error",
];

type KeyTuple = typeof TRANSLATION_KEYS;
export type TranslationKey = KeyTuple[number];

export function isTranslationKey(key: unknown): key is TranslationKey {
    return TRANSLATION_KEYS.includes(key as any);
}

type TranslationsMap = Record<Language, Record<TranslationKey, string>>;

export const TRANSLATIONS: TranslationsMap = {
    en: {
        "tableHeader.city": "City",
        "tableHeader.date": "Date",
        "tableHeader.dish": "Dish",
        "tableHeader.grades": "Grades",
        "tableHeader.actions": "Actions",
        "actions.edit": "Edit",
        "actions.remove": "Remove",
        "form.header.add": "Add new note",
        "form.label.city": "City",
        "form.label.favouriteDish": "Favourite dish",
        "form.label.notes": "Notes about dish/city",
        "form.label.grades": "Grades",
        "form.label.date": "Last visit date",
        "form.button.addGrade": "Add Grade",
        "form.button.save": "Save Note",
        "form.error": "Saving data error",
    },
    es: {
        "tableHeader.city": "Ciudad",
        "tableHeader.date": "Fecha",
        "tableHeader.dish": "Comida",
        "tableHeader.grades": "Calificaciones",
        "tableHeader.actions": "Acciones",
        "actions.edit": "Editar",
        "actions.remove": "Eliminar",
        "form.header.add": "Agregar nueva nota",
        "form.label.city": "Ciudad",
        "form.label.favouriteDish": "Comida favorita",
        "form.label.notes": "Notas sobre comida/ciudad",
        "form.label.grades": "Calificaciones",
        "form.label.date": "Fecha de la última visita",
        "form.button.addGrade": "Agregar calificación",
        "form.button.save": "Guardar nota",
        "form.error": "Error al guardar datos",
    },
};
