import React from "react";
import "./App.css";
import "./courses.css";

function CourseSearch({ courses, courseInfo, setCourseInfo, setSelected }) {
    console.log("Rendering CourseSearch with courses:", courses);

    if (!courses || courses.length === 0) {
        return <div>No courses found. Try adjusting your search criteria.</div>;
    }

    
    return (
        <div id="scroller" className="overflow-y-scroll h-[90%] scrollbar-hide backdrop-blur-lg bg-gradient-to-tr from-blue-200 via-sky-100 to-gray backdrop-filter shadow-inner">
            {courses.map((course) => (
                <div
                    key={course.id}
                    className={`h-15 p-6 m-3 bg-slate-50 active:scale-[97%] rounded-2xl hover:bg-slate-200 ${
                        courseInfo == course
                            ? "bg-gradient-to-br from-sky-200 via-blue-200 to-fuchsia-100 shadow-2xl"
                            : "shadow-lg"
                    } duration-200`}
                    onClick={() => {
                        setCourseInfo(course);
                        setSelected(2);
                    }}
                >
                    <div className="flex justify-between">
                        <div className="text-xl font-semibold">
                            {course.name}
                        </div>
                        <div>
                            <b className="font-semibold">GPA: </b>{" "}
                            {course.gpa > 0 ? (
                                <strong
                                    className={`${
                                        course.gpa <= 0
                                            ? "text-gray-500"
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
                                            : "text-amber-500"
                                    } font-semibold`}
                                >
                                    {Number(course.gpa).toFixed(2)}
                                </strong>
                            ) : (
                                "None"
                            )}
                        </div>
                    </div>
                    <div className="h-10 overflow-ellipsis scrollbar-hide text-lg leading-snug">
                        {course.title}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CourseSearch;
