import React from "react";
import "./App.css";
import "./courses.css";
import { IonIcon } from "@ionic/react";
import { checkmarkCircleOutline } from "ionicons/icons";
import runViewTransition from "./RunViewTransition";
function CourseSearch({
    courses,
    courseInfo,
    setCourseInfo,
    setSelected,
    setInfo,
}) {
    if (!courses || courses.length === 0) {
        console.log("No courses found");
        return (
            <div className="h-[84%] flex items-center justify-around p-3 text-center">
                No courses found. Try adjusting your search criteria.
            </div>
        );
    }
    console.log("Rendering CourseSearch with", courses.length, "courses");

    return (
        <div
            id="scroller"
            className="overflow-y-scroll h-[84%] scrollbar-hide bg-slate-200 rounded-2xl shadow-inner rounded-b-none"
        >
            {courses.map((course) => (
                <div
                    key={course.id}
                    className={`p-3 m-3  active:scale-[99%] bg-slate-300 rounded-3xl ${
                        courseInfo === course
                            ? "border-4 border-wisco-700 text-wrap"
                            : " text-nowrap"
                    } duration-200 cursor-pointer shadow-lg hover:bg-slate-200 overflow-hidden hover:text-wrap`}
                    onClick={() => {
                        //console.log("Course clicked:", course.name);
                        //console.log("CourseInfo and selected state updated");
                        setCourseInfo(course);
                        setInfo({});
                        setSelected(2);
                    }}
                >
                    <div className="flex justify-between">
                        <div className="text-xl flex font-semibold items-center">
                            {course.name}
                            {course.currently_taught && (
                                <IonIcon
                                    icon={checkmarkCircleOutline}
                                    className={`pl-[2px] text-xl ${
                                        courseInfo === course
                                            ? "text-wisco-800"
                                            : "text-wisco-700"
                                    }  `}
                                />
                            )}
                        </div>
                        <div>
                            <b className="font-semibold">GPA: </b>{" "}
                            {course.gpa > 0 ? (
                                <strong
                                    className={`${
                                        course.gpa <= 0
                                            ? "text-slate-600"
                                            : course.gpa <= 1
                                            ? "text-red-800"
                                            : course.gpa <= 2
                                            ? "text-red-500"
                                            : course.gpa <= 2.5
                                            ? "text-orange-500"
                                            : course.gpa <= 3
                                            ? "text-lime-500"
                                            : course.gpa <= 3.5
                                            ? "text-green-500"
                                            : course.gpa < 4
                                            ? "text-emerald-600"
                                            : "text-yellow-500"
                                    } font-semibold `}
                                >
                                    {Number(course.gpa).toFixed(2)}
                                </strong>
                            ) : (
                                <strong className="text-slate-600 font-semibold">
                                    -.--
                                </strong>
                            )}
                        </div>
                    </div>
                    <div className="min-h-5 text-[15px] text-slate-600 leading-snug ">
                        {course.title}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CourseSearch;
