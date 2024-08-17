import React, { useState, useRef } from "react";
import { limit, orderBy } from "firebase/firestore";
import { IonIcon } from "@ionic/react";
import { checkmarkCircleOutline, closeOutline } from "ionicons/icons";

function SearchForm({
    setFilters,
    setNum,
    setPageFilters,
    setMadgrades,
    setCourseInfo,
    setSelected,
    setSort
}) {
    const [subject, setSubject] = useState("");
    const [subjectSearch, setSubjectSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const [course, setCourse] = useState("");
    const [courseSearch, setCourseSearch] = useState("");
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);

    const [keywords, setKeywords] = useState("");
    const [breadths, setBreadths] = useState({
        biologicalSciences: false,
        humanities: false,
        literature: false,
        naturalSciences: false,
        physicalSciences: false,
        socialSciences: false,
    });
    const [general_ed, setGeneralEducation] = useState({
        communicationA: false,
        communicationB: false,
        quantitativeReasoningA: false,
        quantitativeReasoningB: false,
    });
    const [levels, setLevels] = useState({
        elementary: false,
        intermediate: false,
        advanced: false,
    });
    const [ethnic_studies, setEthnic] = useState({
        ethnicStudies: null,
    });
    const [current, setCurrent] = useState(false)

    const dropdownRef = useRef(null);

    // Sample list of subjects - replace with your actual list
    const response = require("./subjects.json");
    const subjects = Object.values(response)
        .sort((a, b) => a.abbr.localeCompare(b.abbr));

    const filteredSubjects = subjects.filter((s) =>
        s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        s.abbr.toLowerCase().includes(subjectSearch.toLowerCase()) 
    );

    const response_course = require("./courses.json");
    const courses = Object.values(response_course)
       
    
    const filteredCourses  = courses.filter((c) => 
        c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.title.toLowerCase().includes(courseSearch.toLowerCase())
    );

    const handleSubjectChange = (selected) => {
        document.startViewTransition(() => {
            setSubject(selected.abbr);
            setSubjectSearch(selected.abbr);
            setShowDropdown(false);
        });
    };

    const handleCourseChange = (selected) => {
        document.startViewTransition(() => {
            setCourse(selected.title);
            setCourseSearch(selected.name);
            setShowCourseDropdown(false);
        })
    }
    const handleBreadthChange = (key) => {
        setBreadths({ ...breadths, [key]: !breadths[key] });
    };

    const handleGeneralEducationChange = (key) => {
        setGeneralEducation({
            ...general_ed,
            [key]: !general_ed[key],
        });
    };

    const handleLevelsChange = (key) => {
        setLevels({ ...levels, [key]: !levels[key] });
    };

    const handleEthnicChange = (event) => {
        setEthnic({
            ...ethnic_studies,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const breadthMap = {
            biologicalSciences: 1,
            humanities: 2,
            literature: 4,
            naturalSciences: 8,
            physicalSciences: 16,
            socialSciences: 32,
        };

        const genEdMap = {
            communicationA: "COM A",
            communicationB: "COM B",
            quantitativeReasoningA: "QR-A",
            quantitativeReasoningB: "QR-B",
        };

        const levelsMap = {
            elementary: 1,
            intermediate: 2,
            advanced: 4,
        };

        var breadthVal = 0;
        Object.entries(breadths)
            .filter(([_, value]) => value)
            .map(([key, _]) => {
                breadthVal += breadthMap[key];
            });
        var levelVal = 0;
        Object.entries(levels)
            .filter(([_, value]) => value)
            .map(([key, _]) => levelVal += levelsMap[key] );

        const filters = {
            breadths: breadthVal === 0 ? null : breadthVal,
            general_ed: Object.entries(general_ed)
                .filter(([_, value]) => value)
                .map(([key, _]) => genEdMap[key]),
            level: levelVal === 0 ? null : levelVal,
            subject_abbr: subject === "" ? null : subject,
            ethnic_studies: ethnic_studies.ethnicStudies ? true : null,
            keywords: keywords === "" ? null : keywords.split(" "),
            currently_taught: current ? true : null,
            title: course == "" ? null : course
        };
        console.log("filters", filters);
        // Call the courseSearch function with the formatted filters
        document.startViewTransition(() => {
            setFilters(filters);
            setPageFilters([limit(25)]);
            setCourseInfo(null);
            setMadgrades(null);
            setNum(1);
            setSelected(1);
        });
    };

    return (
        <form
            id="form"
            onSubmit={handleSubmit}
            className="overflow-y-scroll scrollbar-hide overscroll-contain m"
        >
            <div className="flex flex-row justify-around font-semibold p-3 m-3">
                <button
                    className="w-24 h-12 cursor-pointer bg-slate-700 hover:bg-slate-800 active:bg-slate-900 active:scale-95 transition-colors ease-in rounded-full text-white shadow-xl"
                    type="button"
                    onClick={() => {
                        document.startViewTransition(() => {
                            setSubject("");
                            setSubjectSearch("");
                            setShowDropdown(false);
                            setCourse("");
                            setCourseSearch("");
                            setShowCourseDropdown(false);
                            setKeywords("");
                            setBreadths(
                                Object.fromEntries(
                                    Object.keys(breadths).map((k) => [k, false])
                                )
                            );
                            setGeneralEducation(
                                Object.fromEntries(
                                    Object.keys(general_ed).map((k) => [k, false])
                                )
                            );
                            setLevels(
                                Object.fromEntries(
                                    Object.keys(levels).map((k) => [k, false])
                                )
                            )
                            setCurrent(false);
                            setFilters({});
                            setPageFilters([limit(25)]);
                            setSort("course_num")
                            setNum(1);
                            setCourseInfo(null);
                
                        });
                    }}
                >
                    Reset
                </button>
                <div className="shadow-xl rounded-full active:scale-95 transition-all ease-in">
                    <button
                        type="submit"
                        className="w-24 h-12 bg-indigo-500 hover:bg-none hover:bg-indigo-600 duration-150 rounded-full text-white"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="p-3 m-3 bg-slate-300 rounded-3xl shadow-lg" ref={dropdownRef}>
                <div className="flex justify-around h-[100%] items-center">
                    <input
                        type="text"
                        value={subjectSearch}
                        onChange={(e) => {
                            setSubjectSearch(e.target.value);
                        }}
                        onClick={() => { document.startViewTransition(() => {setShowDropdown(true); setShowCourseDropdown(false);})}}
                        placeholder="Filter by subject"
                        className={`${showDropdown ? "w-[85%]" : "w-[100%]"} text-xl cursor-pointer placeholder:text-slate-400 shadow-lg rounded-2xl bg-slate-200 text-slate-800"  p-2`}
                    />
                    {showDropdown && (
                        <div className="hover:bg-slate-400 rounded-full cursor-pointer ml-1 bg-clip-content duration-100 "
                            onClick={() => { document.startViewTransition(() => {setShowDropdown(false); setSubject(""); setSubjectSearch("");})}}>
                            <IonIcon className="text-3xl text-slate-800 p-[6px] pb-0" icon={closeOutline}/>
                        </div>
                    )}
                </div>
                {showDropdown && (
                    <div className="mt-2 h-[50vh] overflow-y-scroll rounded-2xl scrollbar-hide">
                        {filteredSubjects.map((s, index) => (
                            <div
                                key={index}
                                className="p-2 cursor-pointer my-3 mx-2 border-b-black rounded-xl duration-150 bg-slate-200 hover:bg-slate-50 shadow-lg active:bg-white shadow-slate-400"
                                onClick={() => setTimeout(handleSubjectChange(s), 500)}
                            >
                                <div className="text-slate-700 leading-tight text-lg font-medium ">
                                    {s.name}
                                </div>
                                <div className="flex">
                                    <div className="text-slate-500 text-md mr-3">
                                        {s.abbr}
                                    </div>
                                    <div className={`text-slate-50 text-md rounded-full ${s.mean <= 0
                                            ? "bg-slate-600"
                                            : s.mean <= 1
                                            ? "bg-red-800"
                                            : s.mean <= 2
                                            ? "bg-red-500"
                                            : s.mean <= 2.5
                                            ? "bg-orange-500"
                                            : s.mean <= 3
                                            ? "bg-lime-500"
                                            : s.mean <= 3.5
                                            ? "bg-green-500"
                                            : s.mean < 4
                                            ? "bg-emerald-600"
                                            : "bg-yellow-500"
                                    } pl-2 pr-2`}>
                                        GPA: {Number(s.mean).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {
                /** 
                <input
                    type="text"
                    placeholder="Keyword Search"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="text-xl  placeholder:text-slate-400 shadow-lg rounded-2xl bg-slate-200 text-slate-800 mt-4 p-2 w-[100%]"
                />
                */
                }
                <div className="flex justify-around h-[100%] items-center mt-4">
                    <input
                        type="text"
                        value={courseSearch}
                        onChange={(e) => {
                            setCourseSearch(e.target.value);
                        }}
                        onClick={() => { document.startViewTransition(() => {setShowCourseDropdown(true); setShowDropdown(false);})}}
                        placeholder="Search courses"
                        className={`${showCourseDropdown ? "w-[85%]" : "w-[100%]"} text-xl cursor-pointer placeholder:text-slate-400 shadow-lg rounded-2xl bg-slate-200 text-slate-800"  p-2`}
                    />
                    {showCourseDropdown && (
                        <div className="hover:bg-slate-400 cursor-pointer rounded-full ml-1 bg-clip-content duration-100 "
                            onClick={() => { document.startViewTransition(() => {setShowCourseDropdown(false); setCourse(""); setCourseSearch("");})}}>
                            <IonIcon className="text-3xl text-slate-800 p-[6px] pb-0" icon={closeOutline}/>
                        </div>
                    )}
                </div>
                {showCourseDropdown && (
                    <div className="mt-2 h-[50vh] overflow-y-scroll rounded-2xl scrollbar-hide">
                        {filteredCourses.filter((item, idx) => idx < 100).map((c, index) => (
                            <div
                                key={index}
                                className="p-2 my-3 mx-2 cursor-pointer border-b-black rounded-xl duration-150 bg-slate-200 hover:bg-slate-50 shadow-lg active:bg-white shadow-slate-400"
                                onClick={() => setTimeout(handleCourseChange(c), 500)}
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
            

            <div className={`m-3 p-2 cursor-pointer shadow-lg rounded-3xl flex justify-start duration-100 items-center gap-2 ${current ? "bg-green-600 text-slate-50 hover:bg-green-700" : "bg-slate-300 hover:bg-slate-400"}`}
                onClick={() => {document.startViewTransition(() => {setCurrent(!current)})}}>
                <IonIcon className="text-3xl" icon={checkmarkCircleOutline}/>
                 <div className="text-lg">
                    Currently Taught
                </div>
            </div>


            <div className="m-3 shadow-xl bg-slate-300 rounded-2xl relative p-3">
                <div className="flex flex-col relative">
                    <h1 className="pl-3 text-2xl text-slate-800 font-semibold">Breadths</h1>
                    <div className="flex flex-wrap">
                        {Object.entries(breadths).map(([key]) => (
                            <label
                                key={key}
                                onClick={() => handleBreadthChange(key)}
                                className={`m-1 cursor-pointer p-1 pl-3 pr-3 transition-all duration-150 active:scale-95 ${
                                    breadths[key]
                                        ? "hover:bg-green-800 bg-green-900"
                                        : "hover:bg-green-700 bg-green-600"
                                } rounded-full text-white shadow-lg`}
                            >
                                <span>
                                    {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                            str.toUpperCase()
                                        )}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="m-3  shadow-xl bg-slate-300 rounded-2xl relative p-3">
                <div className="flex flex-col relative">
                    <h3 className="pl-3 text-2xl text-slate-800 font-semibold">
                        General Education
                    </h3>
                    <div className="flex flex-wrap">
                        {Object.entries(general_ed).map(([key]) => (
                            <label
                                key={key}
                                onClick={() =>
                                    handleGeneralEducationChange(key)
                                }
                                className={`m-1 p-1 pl-3 pr-3 cursor-pointer transition-all duration-150 active:scale-95 ${
                                    general_ed[key]
                                        ? "hover:bg-emerald-800 bg-emerald-900"
                                        : "hover:bg-emerald-700 bg-emerald-600"
                                } rounded-full text-white shadow-lg`}
                            >
                                <span>
                                    {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                            str.toUpperCase()
                                        )}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="m-3 shadow-xl bg-slate-300  inner-shadow rounded-2xl relative p-3">
                <div className="flex flex-col relative">
                    <h3 className="pl-3 text-2xl text-slate-800 font-semibold">
                        Levels
                    </h3>
                    <div className="flex flex-wrap">
                        {Object.entries(levels).map(([key]) => (
                            <label
                                key={key}
                                onClick={() =>
                                    handleLevelsChange(key)
                                }
                                className={`m-1 p-1 pl-3 cursor-pointer pr-3 transition-colors duration-150 active:scale-95 ${
                                    levels[key]
                                        ? "hover:bg-teal-800 bg-teal-900"
                                        : "hover:bg-teal-700 bg-teal-600"
                                } rounded-full text-white shadow-lg`}
                            >
                                <span>
                                    {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                            str.toUpperCase()
                                        )}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-7">

            </div>
        </form>
    );
}

export default SearchForm;
