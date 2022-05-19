import React from "react";
import "./App.css";
import { LoadingOverlay, OverlayProvider } from "./loading-overlay/LoadingOverlay";
import { LanguageSwitchButton } from "./lang/LanguageSwitchButton";
import { SoundsContainer } from "./sound/SoundsContainer";
import { NoteAddForm } from "./form/NoteAddForm";
import { List } from "./list/List";
import { Note } from "./types";
import { isResponseError, useRequest } from "./network/useRequest";
import { NetworkHandler } from "./network/NetworkHandler";
import { LanguageProvider } from "./lang/LanguageContext";

// todo: get data on initial render
export const App: React.FC = () => {
    const [data, setData] = React.useState<Note[]>([]);
    const request = React.useCallback(async () => NetworkHandler.getNotes(), []);
    const { response, makeRequest } = useRequest(request);

    React.useEffect(() => {
        makeRequest();
    }, []);

    React.useEffect(() => {
        if (response && !isResponseError(response)) {
            setData(response);
        }
    }, [response]);

    const onAction = React.useCallback((list: Note[]) => {
        setData(list);
    }, []);

    return (
        <div className="container root-container">
            <LanguageProvider>
                <OverlayProvider>
                    <div className="row header">
                        <h2>Bob&apos;s admin</h2>
                        <LanguageSwitchButton />
                    </div>

                    <div className="row content">
                        <div className="column column-60 left-column">
                            <List list={data} onRemove={onAction} />
                        </div>
                        <div className="column column-40 right-column">
                            <NoteAddForm
                                onSubmit={onAction}
                            />
                        </div>
                    </div>
                    <SoundsContainer />
                    <LoadingOverlay />
                </OverlayProvider>
            </LanguageProvider>
        </div>
    );
};
