export type Language = "en" | "es";

export interface Note {
    id: string;
    city: string;
    date: string;
    favouriteDish: {
        name: string;
        note?: string;
    };
    grades: number[];
}
