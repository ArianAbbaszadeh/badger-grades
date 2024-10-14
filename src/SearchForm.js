import React, { useState, useRef } from "react";
import { limit } from "firebase/firestore";
import { IonIcon } from "@ionic/react";
import { checkmarkCircleOutline, closeOutline } from "ionicons/icons";
import runViewTransition from "./RunViewTransition";
import { ConfigProvider, Slider } from "antd";

function SearchForm({
    setFilters,
    setNum,
    setPageFilters,
    setMadgrades,
    setCourseInfo,
    setSelected,
    setSort,
}) {
    const formRef = useRef(null);
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
    const [current, setCurrent] = useState(false);

    const [courseNumRange, setCourseNumRange] = useState([0, 999]);

    const [creditRange, setCreditRange] = useState([0, 12]);

    const [GPARange, setGPARange] = useState([0.0, 4.0]);

    const dropdownRef = useRef(null);

    // Sample list of subjects - replace with your actual list
    const response = require("./subjects.json");
    const subjects = Object.values(response).sort((a, b) =>
        a.abbr.localeCompare(b.abbr)
    );

    const filteredSubjects = subjects.filter(
        (s) =>
            s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
            s.abbr.toLowerCase().includes(subjectSearch.toLowerCase())
    );

    const response_course = require("./courses.json");
    const courses = Object.values(response_course);

    const filteredCourses = courses.filter(
        (c) =>
            c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
            c.title.toLowerCase().includes(courseSearch.toLowerCase())
    );

    const handleSubjectChange = (selected) => {
        runViewTransition(() => {
            setSubject(selected.abbr);
            setSubjectSearch(selected.abbr);
            setShowDropdown(false);
        });
    };

    const handleCourseChange = (selected) => {
        runViewTransition(() => {
            setSubject("");
            setSubjectSearch("");
            setShowDropdown(false);
            setCourse(selected.title);
            setCourseSearch(selected.name);
            setShowCourseDropdown(false);
            setKeywords("");
            setCourseNumRange([0, 999]);
            setCreditRange([0, 12]);
            setGPARange([0.0, 4.0]);
            setBreadths(
                Object.fromEntries(Object.keys(breadths).map((k) => [k, false]))
            );
            setGeneralEducation(
                Object.fromEntries(
                    Object.keys(general_ed).map((k) => [k, false])
                )
            );
            setLevels(
                Object.fromEntries(Object.keys(levels).map((k) => [k, false]))
            );
            setCurrent(false);
            setFilters({});
            setPageFilters([limit(25)]);
            setSort("course_num");
            setNum(1);
            setCourseInfo(null);

            setTimeout(() => {
                const form = document.getElementById("form");
                if (form) {
                    console.log("Form found by ID, submitting...");
                    form.dispatchEvent(
                        new Event("submit", { cancelable: true, bubbles: true })
                    );
                } else {
                    console.error("Form with ID 'form' not found");
                }
            }, 0);
        });
    };
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
            .map(([key, _]) => (levelVal += levelsMap[key]));

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
            title: course === "" ? null : course,
            course_num:
                courseNumRange[0] === 0 && courseNumRange[1] === 999
                    ? null
                    : courseNumRange,
            min_cred: creditRange[0] === 0 ? null : creditRange,
            max_cred: creditRange[1] === 12 ? null : creditRange,
            gpa: GPARange[0] === 0 && GPARange[1] === 4 ? null : GPARange,
        };
        console.log("filters", filters);
        // Call the courseSearch function with the formatted filters
        runViewTransition(() => {
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
            className="overflow-y-scroll scrollbar-hide overscroll-contain cursor-pointer"
        >
            <div className="flex flex-row justify-around font-semibold p-3 m-3">
                <button
                    className="w-24 h-12 cursor-pointer bg-slate-800 hover:bg-slate-700 active:scale-95 transition-colors ease-in rounded-full text-white shadow-xl"
                    type="button"
                    onClick={() => {
                        runViewTransition(() => {
                            setSubject("");
                            setSubjectSearch("");
                            setShowDropdown(false);
                            setCourse("");
                            setCourseSearch("");
                            setShowCourseDropdown(false);
                            setKeywords("");
                            setCourseNumRange([0, 999]);
                            setCreditRange([0, 12]);
                            setGPARange([0.0, 4.0]);
                            setBreadths(
                                Object.fromEntries(
                                    Object.keys(breadths).map((k) => [k, false])
                                )
                            );
                            setGeneralEducation(
                                Object.fromEntries(
                                    Object.keys(general_ed).map((k) => [
                                        k,
                                        false,
                                    ])
                                )
                            );
                            setLevels(
                                Object.fromEntries(
                                    Object.keys(levels).map((k) => [k, false])
                                )
                            );
                            setCurrent(false);
                            setFilters({});
                            setPageFilters([limit(25)]);
                            setSort("course_num");
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
                        className="w-24 h-12 bg-wisco-700 hover:bg-none cursor-pointer hover:bg-wisco-600 duration-150 rounded-full text-white"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div
                className="p-3 m-3 bg-slate-300 rounded-3xl shadow-lg"
                ref={dropdownRef}
            >
                <div className="flex justify-around h-[100%] items-center cursor-pointer">
                    <input
                        type="text"
                        value={subjectSearch}
                        onChange={(e) => {
                            setSubjectSearch(e.target.value);
                        }}
                        onClick={() => {
                            runViewTransition(() => {
                                setShowDropdown(true);
                                setShowCourseDropdown(false);
                            });
                        }}
                        placeholder="Filter by subject"
                        className={`${
                            showDropdown ? "w-[85%]" : "w-[100%]"
                        } text-xl cursor-pointer placeholder:text-slate-400 shadow-lg rounded-2xl bg-slate-200 text-slate-800"  p-2`}
                    />
                    {showDropdown && (
                        <div
                            className="hover:bg-slate-400 rounded-full cursor-pointer ml-1 bg-clip-content duration-100 "
                            onClick={() => {
                                runViewTransition(() => {
                                    setShowDropdown(false);
                                    setSubject("");
                                    setSubjectSearch("");
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
                {showDropdown && (
                    <div className="mt-2 h-[50vh] overflow-y-scroll rounded-2xl scrollbar-hide">
                        {filteredSubjects.map((s, index) => (
                            <div
                                key={index}
                                className="p-2 cursor-pointer my-3 mx-2 border-b-black rounded-xl duration-150 bg-slate-200 hover:bg-slate-50 shadow-lg active:bg-white shadow-slate-400"
                                onClick={() =>
                                    setTimeout(handleSubjectChange(s), 500)
                                }
                            >
                                <div className="text-slate-700 leading-tight text-lg font-medium ">
                                    {s.name}
                                </div>
                                <div className="flex">
                                    <div className="text-slate-500 text-md mr-3">
                                        {s.abbr}
                                    </div>
                                    <div
                                        className={`text-slate-50 text-md rounded-full ${
                                            s.mean <= 0
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
                                                : "bg-emerald-700"
                                        } pl-2 pr-2`}
                                    >
                                        GPA: {Number(s.mean).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/** 
                <input
                    type="text"
                    placeholder="Keyword Search"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="text-xl  placeholder:text-slate-400 shadow-lg rounded-2xl bg-slate-200 text-slate-800 mt-4 p-2 w-[100%]"
                />
                */}
                <div className="flex justify-around h-[100%] items-center mt-4">
                    <input
                        type="text"
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
                        placeholder="Search courses"
                        className={`${
                            showCourseDropdown ? "w-[85%]" : "w-[100%]"
                        } text-xl cursor-pointer placeholder:text-slate-400 shadow-lg rounded-2xl bg-slate-200 text-slate-800"  p-2`}
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
                    <div className="mt-2 h-[50vh] overflow-y-scroll rounded-2xl scrollbar-hide">
                        {filteredCourses
                            .filter((item, idx) => idx < 100)
                            .map((c, index) => (
                                <div
                                    type="submit"
                                    key={index}
                                    className="p-2 my-3 mx-2 cursor-pointer border-b-black rounded-xl duration-150 bg-slate-200 hover:bg-slate-50 shadow-lg active:bg-white shadow-slate-400"
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

            <div
                className={`m-3 p-2 cursor-pointer shadow-lg rounded-3xl flex justify-start duration-100 items-center gap-2 ${
                    current
                        ? "bg-wisco-700 text-slate-50 hover:bg-wisco-600"
                        : "bg-slate-300 hover:bg-slate-400"
                }`}
                onClick={() => {
                    runViewTransition(() => {
                        setCurrent(!current);
                    });
                }}
            >
                <IonIcon className="text-3xl" icon={checkmarkCircleOutline} />
                <div className="text-lg">Currently Taught</div>
            </div>

            <div className="m-3 shadow-xl bg-slate-300 rounded-2xl relative p-3">
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimaryBorderHover: "#f60c15",
                        },
                        components: {
                            Slider: {
                                trackBg: "#c5050c",
                                trackHoverBg: "#f60c15",
                                dotBorderColor: "#c5050c",
                                handleActiveColor: "#f60c15",
                                handleColor: "#c5050c",
                            },
                        },
                    }}
                >
                    <div className="text-xl font-semibold">Credits</div>
                    <Slider
                        className="m-2"
                        range
                        value={creditRange}
                        max={12}
                        step={1}
                        marks={{
                            0: `${creditRange[0]}`,
                            12: `${creditRange[1]}`,
                        }}
                        onChange={([min, max]) => {
                            setCreditRange([min, max]);
                        }}
                    />
                    <div className="text-xl font-semibold mt-4">GPA</div>
                    <Slider
                        className="m-2"
                        range
                        step={0.01}
                        value={GPARange}
                        max={4.0}
                        marks={{ 0: `${GPARange[0]}`, 4.0: `${GPARange[1]}` }}
                        onChange={([min, max]) => {
                            setGPARange([min, max]);
                        }}
                    />
                    <div className="text-xl font-semibold mt-4">
                        Course Number
                    </div>
                    <Slider
                        className="m-2"
                        range
                        value={courseNumRange}
                        step={1}
                        max={999}
                        marks={{
                            0: `${courseNumRange[0]}`,
                            999: `${courseNumRange[1]}`,
                        }}
                        onChange={([min, max]) => {
                            setCourseNumRange([min, max]);
                        }}
                    />
                </ConfigProvider>
            </div>

            <div className="m-3 shadow-xl bg-slate-300 rounded-2xl relative p-3">
                <div className="flex flex-col relative">
                    <h1 className="pl-3 text-2xl text-slate-800 font-semibold">
                        Breadths
                    </h1>
                    <div className="flex flex-wrap">
                        {Object.entries(breadths).map(([key]) => (
                            <label
                                key={key}
                                onClick={() => handleBreadthChange(key)}
                                className={`m-1 cursor-pointer p-1 pl-3 pr-3 transition-all duration-150 active:scale-95 ${
                                    breadths[key]
                                        ? "hover:bg-red-500 bg-red-400"
                                        : "hover:bg-red-600 bg-red-700 text-slate-50"
                                } rounded-full  shadow-lg`}
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
                                        ? "hover:bg-rose-500 bg-rose-400"
                                        : "hover:bg-rose-600 bg-rose-700 text-slate-50"
                                } rounded-full  shadow-lg`}
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
                                onClick={() => handleLevelsChange(key)}
                                className={`m-1 p-1 pl-3 cursor-pointer pr-3 transition-colors duration-150 active:scale-95 ${
                                    levels[key]
                                        ? "hover:bg-pink-500 bg-pink-400"
                                        : "hover:bg-pink-600 bg-pink-700 text-slate-50"
                                } rounded-full shadow-lg`}
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

            <div className="h-7"></div>
        </form>
    );
}

export default SearchForm;
