import React from "react";
import { endBefore, limit, limitToLast, startAfter } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { IonIcon } from "@ionic/react";
import {
    chevronBackCircle,
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
        <div className="min-h-10 h-[8%] flex flex-col justify-around bg-slate-200 shadow-inner  bg-clip-border">
            <div className="flex flex-row w-[100%] justify-around m-[1.5vh] ml-0 mr-0">
                <Button
                    className="bg-clip-content hover:bg-gray-200 duration-200 rounded-full"
                    onClick={prev_page}
                    disabled={num==1}
                >
                    <IonIcon
                        className="size-[4vh]"
                        icon={chevronBackCircleOutline}
                    />
                </Button>
                <div className="text-[3vh]">{num}</div>
                <Button
                    className="group duration-200 rounded-full"
                    onClick={next_page}
                    disabled={disabled}
                >
                    <IonIcon
                        className="size-[4vh] fill-zinc-700 group-hover:hover:fill-blue-400"
                        icon={chevronForwardCircleOutline}
                    />
                </Button>
            </div>
        </div>
    );
}
export default Pagination;
