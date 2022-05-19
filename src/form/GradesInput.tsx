import React from "react";
import { pullAt } from "lodash";
import { Grade } from "./Grade";

import "./GradesInput.css";
import { usePrevious } from "../usePrev";
import { ButtonWithSound } from "./ButtonWithSound";

function isGradeValid(currentGrade: string) {
    return parseFloat(currentGrade) > 0.1 && parseFloat(currentGrade) <= 10;
}

interface GradesInputProps {
    grades: number[];
    onChange: (grades: number[]) => void;
}

// todo: implement the logic of adding new grades and removal on click
// validate so the value entered is >0.1 and <10. Numbers have to contain max two digits after coma
// Just disable button if grade is invalid
export const GradesInput: React.FC<GradesInputProps> = ({ grades, onChange }) => {
    const [currentGrade, setCurrentGrade] = React.useState("");

    const onCurrentGradeChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentGrade(e.target.value);
    }, []);

    const onGradeRemove = (index: number) => () => {
        const gradesCopy = [...grades];
        pullAt(gradesCopy, index);
        onChange(gradesCopy);
    };

    const onGradeAdd = (grade: string) => () => {
        const gradesCopy = [...grades];
        gradesCopy.push(parseFloat(grade));
        onChange(gradesCopy);
        setCurrentGrade("");
    };

    const prevGrades = usePrevious(grades);

    React.useEffect(() => {
        if (prevGrades?.length && grades.length === 0) {
            setCurrentGrade("");
        }
    }, [grades, prevGrades]);

    const isValid = isGradeValid(currentGrade);

    return (
        <div>
            <div className="grades-input-container">
                <input
                    id="grades-field"
                    data-test="add-grade-input"
                    className="grades-input"
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.01}
                    placeholder="10"
                    value={currentGrade}
                    onChange={onCurrentGradeChange}
                />
                <ButtonWithSound
                    soundType="positive"
                    onClick={onGradeAdd(currentGrade)}
                    dataAttr="add-grade-button"
                    translationKey="form.button.addGrade"
                    isDisabled={!isValid}
                />
            </div>
            <div className="grades-list">
                {grades.map((grade, index) =>
                    <Grade key={index} value={grade} onRemove={onGradeRemove(index)} />,
                )}
            </div>
        </div>
    );
};
