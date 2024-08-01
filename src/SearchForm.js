import React, { useState, useEffect, useRef } from "react";
import { limit } from "firebase/firestore";
import { Dropdown } from "react-bootstrap";

function SearchForm({
    setFilters,
    setNum,
    setPageFilters,
    setMadgrades,
    setCourseInfo,
    setSelected,
}) {
    const [subject, setSubject] = useState("All subjects");
    const [subjectSearch, setSubjectSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
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

    const dropdownRef = useRef(null);

    // Sample list of subjects - replace with your actual list
    const response = require("./subjects.json");
    const subjects = Object.values(response)
        .map((item) => item.abbreviation)
        .sort();
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredSubjects = subjects.filter((s) =>
        s.toLowerCase().includes(subjectSearch.toLowerCase())
    );

    const handleSubjectChange = (selected) => {
        setSubject(selected);
        setSubjectSearch(selected);
        setShowDropdown(false);
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
            .map(([key, _]) => levelVal += levelsMap[key] );

        const filters = {
            breadths: breadthVal == 0 ? null : breadthVal,
            general_ed: Object.entries(general_ed)
                .filter(([_, value]) => value)
                .map(([key, _]) => genEdMap[key]),
            level: levelVal == 0 ? null : levelVal,
            subject_abbr: subject == "All subjects" ? null : subject,
            ethnic_studies: ethnic_studies.ethnicStudies ? true : null,
            keywords: keywords == "" ? null : keywords.split(" "),
        };
        console.log("filters", filters);
        // Call the courseSearch function with the formatted filters
        setFilters(filters);
        setPageFilters([limit(25)]);
        setCourseInfo(null);
        setMadgrades(null);
        setNum(1);
        setSelected(1);
    };

    return (
        <form
            id="form"
            onSubmit={handleSubmit}
            className="flex flex-col justify-start p-5 min-w-[324px]"
        >
            <div className="form-group dropdown-container" ref={dropdownRef}>
                <input
                    type="text"
                    value={subjectSearch}
                    onChange={(e) => {
                        setSubjectSearch(e.target.value);
                        setShowDropdown(true);
                    }}
                    onClick={() => setShowDropdown(true)}
                    placeholder="Search subjects"
                    className="form-control"
                />
                {showDropdown && (
                    <div className="form-control">
                        {filteredSubjects.map((s, index) => (
                            <div
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleSubjectChange(s)}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="m-3 shadow-xl bg-slate-200 rounded-2xl relative p-3">
                <div className="flex flex-col relative">
                    <h1 className="pl-3 text-2xl text-slate-800 font-semibold">Breadths</h1>
                    <div className="flex flex-wrap">
                        {Object.entries(breadths).map(([key]) => (
                            <label
                                key={key}
                                onClick={() => handleBreadthChange(key)}
                                className={`m-1 p-1 pl-3 pr-3 transition-all duration-200 active:bg-green-800 active:scale-95 ${
                                    breadths[key]
                                        ? "hover:bg-green-700 bg-green-600"
                                        : "hover:bg-slate-500 bg-slate-400"
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

            <div className="m-3  shadow-xl bg-slate-200 rounded-2xl relative p-3">
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
                                className={`m-1 p-1 pl-3 pr-3 transition-all duration-200 active:bg-orange-800 active:scale-95 ${
                                    general_ed[key]
                                        ? "hover:bg-orange-700 bg-orange-600"
                                        : "hover:bg-slate-500 bg-slate-400"
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

            <div className="m-3 shadow-xl bg-slate-200  inner-shadow rounded-2xl relative p-3">
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
                                className={`m-1 p-1 pl-3 pr-3 transition-all duration-200 active:bg-teal-800 active:scale-95 ${
                                    levels[key]
                                        ? "hover:bg-teal-700 bg-teal-600"
                                        : "hover:bg-slate-500 bg-slate-400"
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

            <div className="flex flex-row justify-around font-semibold p-3 m-3">
                <button
                    className="w-24 h-12 bg-slate-700 hover:bg-slate-800 active:bg-slate-900 active:scale-95 transition-colors ease-in rounded-full text-white"
                    type="button"
                    onClick={() => {
                        setSubject("All subjects");
                        setSubjectSearch("");
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
                        setFilters({});
                        setPageFilters([limit(25)]);
                        setNum(1);
                        setCourseInfo(null);
                    }}
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="w-24 h-12 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 active:scale-95 transition-all ease-in rounded-full text-white"
                >
                    Search
                </button>
            </div>
        </form>
    );
}

export default SearchForm;
