import React from "react";

import "./ItemActions.css";
import { TranslateText } from "../lang/TranslateText";
import { ButtonWithSound } from "../form/ButtonWithSound";

export const ItemActions: React.FC<{ onRemove: () => void; }> = ({ onRemove }) => {
    const onRemoveClick = React.useCallback(() => {
        onRemove();
    }, [onRemove]);

    return (
        <div className="item-actions">
            <button data-test="edit-item-button" className="button button-small" disabled={true}>
                <TranslateText translationKey="actions.edit" />
            </button>
            <ButtonWithSound
                classNames="button-small"
                soundType="negative"
                onClick={onRemoveClick}
                dataAttr="remove-item-button"
                translationKey="actions.remove"
            />
        </div>
    );
};
