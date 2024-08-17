import React from "react";
import "./App.css";
import "./courses.css";
import { IonIcon } from "@ionic/react";
import {
    checkmarkCircleOutline,
} from "ionicons/icons";
function CourseSearch({ courses, courseInfo, setCourseInfo, setSelected, setInfo }) {

    if (!courses || courses.length === 0) {
        console.log("No courses found");
        return <div>No courses found. Try adjusting your search criteria.</div>;
    }
    console.log("Rendering CourseSearch with", courses.length, "courses");

    return (  
        <div id="scroller" className="overflow-y-scroll h-[84%] scrollbar-hide bg-gradient-to-br from-violet-200 via-sky-200 to-indigo-200 rounded-2xl shadow-inner shadow-fuchsia-200 rounded-b-none  overscroll-contain">
            {courses.map((course) => (
                <div
                    key={course.id}
                    className={`p-3 m-3 bg-sky-100 active:scale-[99%] rounded-3xl ${
                        courseInfo === course
                            ? "bg-gradient-to-bl from-fuchsia-200 via-blue-300 to-indigo-300 shadow-2xl shadow-violet-400 text-wrap"
                            : "text-nowrap"
                    } duration-200 cursor-pointer shadow-lg hover:bg-indigo-200 overflow-hidden hover:text-wrap`}
                    onClick={() => {
                            console.log("Course clicked:", course.name);
                            document.startViewTransition(() => {
                                setInfo({});
                                setSelected(2);
                                setCourseInfo(course);
                                console.log("CourseInfo and selected state updated");
                            });
                    }}
                >
                    <div className="flex justify-between">
                        <div className="text-xl flex font-semibold items-center">
                            {course.name} 
                            {course.currently_taught && (<IonIcon icon={checkmarkCircleOutline} className={`pl-[2px] text-xl ${courseInfo == course ? "text-green-600" : "text-green-500"}  `}/>)}
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