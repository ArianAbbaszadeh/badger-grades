import Dropdown from "./Dropdown";
import React, { useState, useRef } from "react";
import { limit } from "firebase/firestore";
import { IonIcon } from "@ionic/react";
import { checkmarkCircleOutline, closeOutline } from "ionicons/icons";
import runViewTransition from "./RunViewTransition";
import { ConfigProvider, Slider } from "antd";
import Image from 'react-bootstrap'
import uwCrest from './UWCREST.png';



function Home() {

    const [course, setCourse] = useState("");
    const [courseSearch, setCourseSearch] = useState("");
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const response_course = require("./courses.json");
    const courses = Object.values(response_course)
    const filteredCourses = courses.filter((c) =>
        c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.title.toLowerCase().includes(courseSearch.toLowerCase())
    );

    const handleCourseChange = (selected) => {
        runViewTransition(() => {
            setCourse(selected.title);
            setCourseSearch(selected.name);
            setShowCourseDropdown(false);
        })
    }

    return (
        <div>
            <img
                src={uwCrest}
                alt="UW Crest"
                className="absolute top-20 left-2 w-[170px] h-auto z-10"
            />

            <div className="bg-slate-200 min-h-screen flex flex-col items-center justify-start pt-20 px-4 space-y-16">
                <div className="z-10 text-4xl font-semibold text-center">
                    Welcome to Badger Grades
                </div>

                <div className="text-1xl">
                    Badger Grades Description
                </div>

                <div className="w-full max-w-2xl">
                    <label htmlFor="course-search" className="block text-xl font-medium leading-6 text-gray-900 mb-4 text-center">
                        Start by searching for a Course
                    </label>
                </div>
                <div className="relative w-full max-w-2xl bg-slate-200 rounded-lg shadow-lg">
                    <div className="flex justify-around h-[100%] items-center w-full">
                        <input
                            type="text"
                            name="course-searchq"
                            id="course-search"
                            className="block w-full rounded-lg border-0 py-3 px-4 text-lg
                            text-gray-900 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-slate-200"
                            placeholder="Ex: GERMAN 275, COMPSCI 577" value={courseSearch}
                            onChange={(e) => {
                                setCourseSearch(e.target.value);
                            }}
                            onClick={() => { runViewTransition(() => { setShowCourseDropdown(true); setShowDropdown(false); }) }}
                        />
                        {showCourseDropdown && (
                            <div className="hover:bg-slate-400 cursor-pointer rounded-full ml-1 bg-clip-content duration-100 "
                                onClick={() => { runViewTransition(() => { setShowCourseDropdown(false); setCourse(""); setCourseSearch(""); }) }}>
                                <IonIcon className="text-3xl text-slate-800 p-[6px] pb-0" icon={closeOutline} />
                            </div>
                        )}
                    </div>
                    {showCourseDropdown && (
                        <div className="max-h-[50vh] overflow-y-auto scrollbar-hide">
                            {filteredCourses.filter((item, idx) => idx < 100).map((c, index) => (
                                <div
                                    key={index}
                                    className="p-2 my-3 mx-2 cursor-pointer border-b-black rounded-xl duration-150
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
                </div>
            </div>
        </div>
    );
}

export default Home;