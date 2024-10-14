import { IonIcon } from "@ionic/react";
import { filter } from "ionicons/icons";
import { useState } from "react";
import runViewTransition from "./RunViewTransition";

function Sorter({ setSort, sort }) {
    const [hide, setHide] = useState(true);
    const options = ["GPA", "Course Num"];

    return (
        <div className="mt-1">
            <div
                className="flex flex-col bg-clip-border text-slate-50 bg-slate-800 rounded-2xl cursor-pointer"
                onClick={() => {
                    runViewTransition(() => {
                        setHide(!hide);
                    });
                }}
            >
                <div
                    className={`flex items-center justify-between gap-2 hover:bg-slate-700 rounded-t-2xl ${
                        hide
                            ? "rounded-2xl hover:rounded-2xl"
                            : " hover:rounded-t-2xl"
                    } px-2 py-[2px] duration-100 max-w-[170px]`}
                >
                    <IonIcon className="text-2xl" icon={filter}></IonIcon>
                    <div className=" text-lg text-nowrap overflow-x-hidden">
                        {sort === "gpa" ? "GPA" : "Course Num"}
                    </div>
                </div>
                <div className="flex flex-col sticky z-10 bg-slate-600 rounded-b-xl">
                    {!hide &&
                        options.map((temp) => (
                            <div
                                className="p-1 m-1 hover:bg-slate-400 duration-100 rounded-full cursor-pointer"
                                onClick={() => {
                                    runViewTransition(() => {
                                        setHide(true);
                                        setSort(
                                            temp === "GPA"
                                                ? "gpa"
                                                : "course_num"
                                        );
                                    });
                                }}
                                key={temp}
                            >
                                {temp}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Sorter;
