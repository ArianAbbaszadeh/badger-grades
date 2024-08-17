import { IonIcon } from "@ionic/react";
import { orderBy } from "firebase/firestore";
import { filter } from "ionicons/icons";
import { useState, useRef } from "react";

function Sorter({ setSort, sort }) {
    const [hide,setHide] = useState(true);
    const options = ["GPA", "Course Num"];


    return (
        <div className="mt-1">
            <div
                className="flex flex-col bg-clip-border bg-slate-200 rounded-2xl"
                onClick={() => {
					document.startViewTransition(() => {
						setHide(!hide);
					})
                }}
            >
                <div className="flex items-center justify-between  gap-2 hover:bg-slate-300 px-2  duration-100 rounded-full max-w-[170px]">
                    <IonIcon className="text-2xl mb-1" icon={filter}></IonIcon>
                    <div className="font-medium text-lg text-nowrap overflow-x-hidden mb-1">{sort == "gpa" ? "GPA" : "Course Num"}</div>
                </div>
                <div className="flex flex-col sticky  z-10 bg-slate-200 rounded-b-xl">
                    {!hide &&
                        options.map((temp) => (
                            <div className="p-1 m-1 hover:bg-slate-300 duration-100 rounded-full"
							onClick={() => {
								document.startViewTransition(() => {
									setHide(true);
									setSort(temp == "GPA" ? "gpa" : "course_num");
								})
								
							}}
							key={temp}>
                                {temp}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Sorter;
