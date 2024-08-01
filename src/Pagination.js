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
        <div className="h-[9vh] min-h-20 flex flex-col justify-around bg-white shadow-inner shadow-gray-100 bg-clip-border">
            <div className="flex flex-row w-[100%] justify-around align-middle ">
                <Button
                    className="bg-clip-content hover:bg-gray-200 duration-200 rounded-full p-3"
                    onClick={prev_page}
                    disabled={num==1}
                >
                    <IonIcon
                        className="size-[40px]"
                        icon={chevronBackCircleOutline}
                    />
                </Button>
                <div className="text-2xl p-4">{num}</div>
                <Button
                    className="group duration-200 rounded-full p-3 "
                    onClick={next_page}
                    disabled={disabled}
                >
                    <IonIcon
                        className="size-[40px] fill-zinc-700 group-hover:hover:fill-blue-400"
                        icon={chevronForwardCircleOutline}
                    />
                </Button>
            </div>
        </div>
    );
}
export default Pagination;
