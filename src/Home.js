import Dropdown from "./Dropdown";
import React, { useState, useRef } from "react";
import { limit } from "firebase/firestore";
import { IonIcon } from "@ionic/react";
import { checkmarkCircleOutline, closeOutline } from "ionicons/icons";
import runViewTransition from "./RunViewTransition";
import { ConfigProvider, Slider } from "antd";
import Image from "react-bootstrap";
import uwCrest from "./UWCREST.png";
import { Link } from "react-router-dom";

function Home() {
    const [course, setCourse] = useState("");
    const [courseSearch, setCourseSearch] = useState("");
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const response_course = require("./courses.json");
    const courses = Object.values(response_course);
    const filteredCourses = courses.filter(
        (c) =>
            c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
            c.title.toLowerCase().includes(courseSearch.toLowerCase())
    );

    const handleCourseChange = (selected) => {
        runViewTransition(() => {
            setCourse(selected.title);
            setCourseSearch(selected.name);
            setShowCourseDropdown(false);
        });
    };

    return (
        <div className="bg-slate-200 h-[92vh] ">
            <div className="bg-slate-200 h-full flex flex-col items-center justify-center p-2 space-y-5">
                <img
                    src={uwCrest}
                    alt="UW Crest"
                    className="left-2 h-[170px] w-auto"
                />
                <div className="text-4xl font-semibold text-center">
                    Welcome to Badger Grades
                </div>

                <div className="w-full max-w-2xl">
                    <label
                        htmlFor="course-search"
                        className="block text-xl font-medium leading-6 text-gray-900 text-center"
                    >
                        Start by searching for a Course
                    </label>
                </div>
                <Link to="/course_search">
                    <div className="bg-wisco-700 text-slate-50 text-xl font-medium py-3 px-6 rounded hover:bg-wisco-600 transition duration-300">
                        Go to Course Search
                    </div>
                </Link>
                <div className="fixed bottom-2 text-center text-sm text-slate-500 font-medium">
                    <div>Not Affiliated With UW Madison</div>
                    <div>Courses Updated Fall 2023</div>
                </div>
                {/**<div className="relative w-full max-w-2xl bg-slate-300 rounded-lg shadow-lg shadow-slate-500">
                    <div className="flex justify-around h-[100%] items-center w-full">
                        <input
                            type="text"
                            name="course-searchq"
                            id="course-search"
                            className="block w-full rounded-lg border-0 py-3 px-4 text-lg
                            text-gray-900 ring-2 ring-inset ring-gray-300 placeholder:text-slate-500 
                            focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-slate-300"
                            placeholder="Ex: GERMAN 275, COMPSCI 577"
                            value={courseSearch}
                            onChange={(e) => {
                                setCourseSearch(e.target.value);
                            }}
                            onClick={() => {
                                runViewTransition(() => {
                                    setShowCourseDropdown(true);
                                    setShowDropdown(false);
                                });
                            }}
                        />
                        {showCourseDropdown && (
                            <div
                                className="hover:bg-slate-400 cursor-pointer rounded-full ml-1 bg-clip-content duration-100 "
                                onClick={() => {
                                    runViewTransition(() => {
                                        setShowCourseDropdown(false);
                                        setCourse("");
                                        setCourseSearch("");
                                    });
                                }}
                            >
                                <IonIcon
                                    className="text-3xl text-slate-800 p-[6px] pb-0"
                                    icon={closeOutline}
                                />
                            </div>
                        )}
                    </div>
                    {showCourseDropdown && (
                        <div className="max-h-[40vh] overflow-y-auto rounded-2xl scrollbar-hide">
                            {filteredCourses
                                .filter((item, idx) => idx < 100)
                                .map((c, index) => (
                                    <div
                                        key={index}
                                        className="p-2 my-3 mx-2 cursor-pointer bg-slate-200 border-b-black rounded-xl duration-150
                                     hover:bg-slate-50 active:bg-white shadow-lg shadow-slate-400"
                                        onClick={() => handleCourseChange(c)}
                                    >
                                        <div className="text-slate-700 leading-tight text-lg font-medium ">
                                            {c.name}
                                        </div>
                                        <div className="flex">
                                            <div className="text-slate-500 text-md mr-3">
                                                {c.title}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div> **/}
            </div>
        </div>
    );
}

export default Home;
