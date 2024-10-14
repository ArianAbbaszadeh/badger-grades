import React from "react";
import { endBefore, limit, limitToLast, startAfter } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { IonIcon } from "@ionic/react";
import {
    chevronBackCircleOutline,
    chevronForwardCircleOutline,
} from "ionicons/icons";

function Pagination({
    disabled,
    head,
    tail,
    num,
    setNum,
    setPageFilters,
    setCourseInfo,
}) {
    const next_page = () => {
        const constraints = [];
        constraints.push(startAfter(tail));
        constraints.push(limit(25));
        setPageFilters(constraints);
        setNum(num + 1);
        setCourseInfo(null);
    };

    const prev_page = () => {
        const constraints = [];
        constraints.push(endBefore(head));
        constraints.push(limitToLast(25));
        setPageFilters(constraints);
        setNum(num - 1);
        setCourseInfo(null);
    };
    return (
        <div className="min-h-10 h-[8%] flex flex-col justify-around bg-slate-300 bg-clip-border items-center">
            <div className="flex w-[100%] justify-around items-center">
                <Button
                    className="flex items-center hover:bg-slate-400 duration-200 rounded-full cursor-pointer"
                    onClick={prev_page}
                    disabled={num === 1}
                >
                    <IonIcon
                        className={`text-3xl ${
                            num === 1 ? "text-slate-500" : ""
                        }`}
                        icon={chevronBackCircleOutline}
                    />
                </Button>
                <div className="text-xl">{num}</div>
                <Button
                    className="flex group duration-200 hover:bg-slate-400 rounded-full cursor-pointer items-center"
                    onClick={next_page}
                    disabled={disabled}
                >
                    <IonIcon
                        className={`text-3xl ${
                            disabled ? "text-slate-500" : ""
                        }`}
                        icon={chevronForwardCircleOutline}
                    />
                </Button>
            </div>
        </div>
    );
}
export default Pagination;
