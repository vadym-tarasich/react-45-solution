import React from "react";

import "./Grade.css";

interface GradeProps {
    value: number;
    onRemove: () => void;
}

export const Grade: React.FC<GradeProps> = ({ value, onRemove }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const onMouseOver = React.useCallback(() => {
        setIsHovered(true);
    }, []);

    const onMouseOut = React.useCallback(() => {
        setIsHovered(false);
    }, []);

    const onRemoveClick = React.useCallback(() => {
        if (isHovered) {
            onRemove();
        }
    }, [isHovered, onRemove]);

    return (
        <a
            data-test={`grade-button-${value}`}
            className="button button-small grade"
            onClick={onRemoveClick}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            {isHovered ? "X" : value}
        </a>
    );
};
