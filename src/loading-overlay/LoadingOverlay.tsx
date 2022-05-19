import React from "react";

import "./LoadingOverlay.css";
import { noop } from "lodash";
import { createPortal } from "react-dom";

interface LoadingOverlayContext {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}

export const OverlayContext = React.createContext<LoadingOverlayContext>({ isVisible: false, setIsVisible: noop });

export const OverlayProvider: React.FC = ({ children }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const setIsOverlayVisible = React.useCallback((value: boolean) => {
        setIsVisible(value);
    }, []);

    return (
        <OverlayContext.Provider value={{ isVisible: isVisible, setIsVisible: setIsOverlayVisible }}>
            {children}
        </OverlayContext.Provider>
    );
};

// todo: render this overlay as a portal to a div with id "loading-overlay" (index.html, line 32)
// this may be shown from different places in app, so think how to trigger showing it
export const LoadingOverlay: React.FC = () => {
    const { isVisible } = React.useContext(OverlayContext);

    return createPortal(
        isVisible
            ? (
                <div data-test="loading-overlay" className="loader-overlay">
                    <span className="loader" />
                </div>
            )
            : null,
        document.getElementById("loading-overlay")!,
    );
};
