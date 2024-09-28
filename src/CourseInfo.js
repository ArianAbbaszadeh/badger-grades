import React, {
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Chart as ChartJS,
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { collection, doc, getDoc } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { apiToken } from "./token";
import { db } from "./firebase";
import { IonIcon } from "@ionic/react";
import {
    caretBackOutline,
    caretForwardOutline,
    checkmarkCircleOutline,
} from "ionicons/icons";
import runViewTransition from "./RunViewTransition";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);
function sem_from_term(term) {
    if (term - Math.floor(term / 10) * 10 === 2) {
        return `Fall ${1899 + Math.floor(term / 10)}`;
    } else if (term - Math.floor(term / 10) * 10 === 4) {
        return `Spring ${1900 + Math.floor(term / 10)}`;
    } else if (term - Math.floor(term / 10) * 10 === 6) {
        return `Summer ${1900 + Math.floor(term / 10)}`;
    } else {
        return "";
    }
}

function CourseInfo({ courseInfo, setMadgrades, madgrades, info, setInfo }) {
    const [madLoading, setMadLoading] = useState(true);
    const [offering, setOffering] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [instructorTerm, setInstructorTerm] = useState(null);

    const fetchGradeInfo = useCallback(
        async (url) => {
            setMadLoading(true);
            setMadgrades(null);
            setOffering(null);
            setInstructor(null);
            setInstructorTerm(null);
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: "Token token=" + apiToken,
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    console.error(
                        "Failed to fetch grade info:",
                        response.status
                    );
                    return null;
                }

                const json = await response.json();
                try {
                    const response2 = await fetch(json.gradesUrl, {
                        method: "GET",
                        headers: {
                            Authorization: "Token token=" + apiToken,
                            Accept: "application/json",
                        },
                    });
                    if (!response2.ok) {
                        console.error(
                            "Failed to fetch detailed grade info:",
                            response2.status
                        );
                        return null;
                    }

                    const grade_json = await response2.json();
                    const temp = {};
                    temp.cumulative = grade_json.cumulative;
                    temp.terms = {};
                    temp.instructors = {};
                    grade_json.courseOfferings.map((offer) => {
                        const temp_term = sem_from_term(offer.termCode);
                        const temp_offer = {};
                        temp_offer.cumulative = offer.cumulative;
                        temp_offer.instructors = {};
                        offer.sections.map((section) => {
                            section.instructors.map((instructor) => {
                                if (
                                    Object.keys(
                                        temp_offer.instructors
                                    ).includes(instructor.name)
                                ) {
                                    temp_offer.instructors[instructor.name].A +=
                                        section.aCount;
                                    temp_offer.instructors[
                                        instructor.name
                                    ].AB += section.abCount;
                                    temp_offer.instructors[instructor.name].B +=
                                        section.bCount;
                                    temp_offer.instructors[
                                        instructor.name
                                    ].BC += section.bcCount;
                                    temp_offer.instructors[instructor.name].C +=
                                        section.cCount;
                                    temp_offer.instructors[instructor.name].D +=
                                        section.dCount;
                                    temp_offer.instructors[instructor.name].F +=
                                        section.fCount;
                                    temp_offer.instructors[
                                        instructor.name
                                    ].total += section.total;
                                } else {
                                    temp_offer.instructors[instructor.name] =
                                        {};
                                    temp_offer.instructors[instructor.name].A =
                                        section.aCount;
                                    temp_offer.instructors[instructor.name].AB =
                                        section.abCount;
                                    temp_offer.instructors[instructor.name].B =
                                        section.bCount;
                                    temp_offer.instructors[instructor.name].BC =
                                        section.bcCount;
                                    temp_offer.instructors[instructor.name].C =
                                        section.cCount;
                                    temp_offer.instructors[instructor.name].D =
                                        section.dCount;
                                    temp_offer.instructors[instructor.name].F =
                                        section.fCount;
                                    temp_offer.instructors[
                                        instructor.name
                                    ].total = section.total;
                                }
                            });
                        });
                        temp.terms[temp_term] = temp_offer;
                    });

                    Object.entries(temp.terms).forEach(
                        ([term_name, term_info]) => {
                            if (term_info.instructors === null) {
                                return;
                            }
                            Object.entries(term_info.instructors).forEach(
                                ([inst_name, inst_info]) => {
                                    if (
                                        Object.keys(temp.instructors).includes(
                                            inst_name
                                        )
                                    ) {
                                        Object.keys(inst_info).forEach(
                                            (key) => {
                                                temp.instructors[inst_name][
                                                    key
                                                ] += inst_info[key];
                                            }
                                        );
                                    } else {
                                        temp.instructors[inst_name] = {};
                                        Object.keys(inst_info).forEach(
                                            (key) => {
                                                temp.instructors[inst_name][
                                                    key
                                                ] = inst_info[key];
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    );
                    runViewTransition(() => {
                        setMadLoading(false);
                        setMadgrades(temp);
                    });
                } catch (error) {
                    console.error(
                        "Error processing grade data:",
                        error.message
                    );
                }
            } catch (error) {
                console.error("Error fetching grade info:", error.message);
            }
        },
        [setMadgrades]
    );

    const fetchCourseInfo = useCallback(async () => {
        var max = -1;
        var max_uuid;
        if (courseInfo.course_info_uuid == null) {
            return;
        }
        for (const [term, uuid] of Object.entries(
            courseInfo.course_info_uuid
        )) {
            const tempterm = parseInt(term);
            if (tempterm > max) {
                max = tempterm;
                max_uuid = uuid;
            }
        }

        try {
            const docSnapshot = await getDoc(
                doc(collection(db, "courseInfo"), max_uuid)
            );
            if (docSnapshot.exists()) {
                setInfo(docSnapshot.data());
            } else {
                console.error(
                    "No course info document found for UUID:",
                    max_uuid
                );
            }
        } catch (error) {
            console.error("Error fetching course info:", error);
        }
    }, [courseInfo]);
    const scrollRef = useRef(null);

    const timeProt = useRef(false);
    useEffect(() => {
        if (courseInfo != null && !timeProt.current) {
            timeProt.current = true;
            console.log("timer started", timeProt);
            setTimeout(() => {
                timeProt.current = false;
                console.log("timer ended", timeProt);
            }, 10);
            console.log("Fetching information for course:", courseInfo.name);
            fetchGradeInfo(courseInfo.mad_url);
            fetchCourseInfo();
        }
    }, [courseInfo, fetchCourseInfo, fetchGradeInfo]);

    let total = 1;
    let labels = [];
    let values = [];

    if (madgrades != null) {
        total =
            madgrades.cumulative.aCount +
            madgrades.cumulative.abCount +
            madgrades.cumulative.bCount +
            madgrades.cumulative.bcCount +
            madgrades.cumulative.cCount +
            madgrades.cumulative.dCount +
            madgrades.cumulative.fCount;
        const gradeData = Object.fromEntries(
            Object.entries(madgrades.cumulative).filter(
                ([key]) =>
                    ![
                        "total",
                        "crCount",
                        "iCount",
                        "nCount",
                        "nwCount",
                        "pCount",
                        "sCount",
                        "uCount",
                        "nrCount",
                        "otherCount",
                    ].includes(key)
            )
        );
        const cleaned = Object.fromEntries(
            Object.entries(gradeData).map(([key, value]) => [
                key.slice(0, -5).toUpperCase(),
                value,
            ])
        );
        const sorted = Object.fromEntries(
            Object.entries(cleaned).sort((a, b) => a[0].localeCompare(b[0]))
        );

        labels = Object.keys(sorted);
        values = Object.values(sorted);
    }
    const data = {
        labels: labels,
        datasets: [
            {
                label: ["Cumulative"],
                data: values.map((value) => 100 * (value / total)),
                backgroundColor: "#7b62ff",
            },
        ],
    };

    if (offering != null) {
        let values2 = [];
        const offering_total = offering["info"].cumulative.total;
        const gradeData = Object.fromEntries(
            Object.entries(offering["info"].cumulative).filter(
                ([key]) =>
                    ![
                        "total",
                        "crCount",
                        "iCount",
                        "nCount",
                        "nwCount",
                        "pCount",
                        "sCount",
                        "uCount",
                        "nrCount",
                        "otherCount",
                    ].includes(key)
            )
        );
        const cleaned = Object.fromEntries(
            Object.entries(gradeData).map(([key, value]) => [
                key.slice(0, -5).toUpperCase(),
                value,
            ])
        );
        const sorted = Object.fromEntries(
            Object.entries(cleaned).sort((a, b) => a[0].localeCompare(b[0]))
        );

        values2 = Object.values(sorted);

        data.datasets.push({
            label: [`${offering["term"]} Term`],
            data: values2.map((value) => 100 * (value / offering_total)),
            backgroundColor: " #f43f5e ",
        });
    }

    if (instructor != null) {
        let values2 = [];
        const inst_total = instructor["info"].total;
        const gradeData = Object.fromEntries(
            Object.entries(instructor["info"]).filter(
                ([key]) => !["total"].includes(key)
            )
        );
        const sorted = Object.fromEntries(
            Object.entries(gradeData).sort((a, b) => a[0].localeCompare(b[0]))
        );

        values2 = Object.values(sorted);

        data.datasets.push({
            label: [`${instructor["name"]} Course Cumulative`],
            data: values2.map((value) => 100 * (value / inst_total)),
            backgroundColor: "#38bdf8",
        });
    }

    if (instructorTerm != null) {
        let values = [];
        const inst_total = instructorTerm["info"].total;
        const gradeData = Object.fromEntries(
            Object.entries(instructorTerm["info"]).filter(
                ([key]) => !["total"].includes(key)
            )
        );
        const sorted = Object.fromEntries(
            Object.entries(gradeData).sort((a, b) => a[0].localeCompare(b[0]))
        );

        values = Object.values(sorted);

        data.datasets.push({
            label: [
                `${instructorTerm["name"]} ${instructorTerm["term"]} Course Data`,
            ],
            data: values.map((value) => 100 * (value / inst_total)),
            backgroundColor: "gold",
        });
    }
    if (madgrades == null || courseInfo == null) {
        return <></>;
    }
    const options = {
        yAxisID: "Students (%)",
        scales: {
            y: {
                min: 0,
                max: 100,
            },
        },
        responsive: true,
    };

    return madLoading ? (
        <div className="text-center flex items-center">Loading</div>
    ) : (
        <div className="flex flex-wrap">
            <div className="flex-col">
                <div className="text-[28px] font-semibold m-1">
                    <div>
                        {Object.keys(info).length > 0
                            ? info.title_suggest != null
                                ? info.title_suggest
                                : info.title
                            : courseInfo.title}
                    </div>
                </div>
                <div className="text-slate-600 text-[1.25rem] font-medium m-1 flex justify-start align-middle">
                    <div className="p-1 mr-1">
                        {info.course_designation
                            ? info.course_designation
                            : courseInfo.name}
                    </div>
                    {courseInfo.currently_taught ? (
                        <div className="text-white flex bg-green-600 rounded-full p-1 pr-3 text-lg">
                            <IonIcon
                                className="size-7 mr-1"
                                icon={checkmarkCircleOutline}
                            />
                            <div>Currently Taught</div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
               
            </div>
            <div className="flex flex-col rounded-3xl bg-slate-200 shadow-xl w-[95%] md:w-[48vw] m-3">
                <Suspense>
                    <div
                        ref={scrollRef}
                        className="flex flex-row overflow-x-scroll border-black overflow-clip"
                    >
                        {Object.entries(madgrades.terms).map(
                            ([term, term_info]) => [
                                <div
                                    className={`flextext-center align-middle justify-between mt-5 mb-2 m-1 p-1 pt-[6px] transition-all duration-75 ${
                                        offering != null &&
                                        offering.term === term
                                            ? "hover:bg-rose-600 bg-rose-500 min-w-70"
                                            : "hover:bg-slate-500 bg-slate-400"
                                    } text-white rounded-full shadow-md text-nowrap flex flex-row min-h-12 cursor-pointer`}
                                    onClick={() => {
                                        runViewTransition(() => {
                                            if (
                                                offering === null ||
                                                offering.term !== term
                                            ) {
                                                setOffering({
                                                    term: term,
                                                    info: term_info,
                                                });
                                                setInstructor(null);
                                            } else {
                                                setOffering(null);
                                                setInstructor(null);
                                            }
                                        });
                                    }}
                                    key={term}
                                >
                                    <div className="p-2 pr-1 m-1 text-[18px] font-medium">
                                        {term}
                                    </div>
                                    <div
                                        className={`max-w-96 overflow-x-scroll flex flex-row flex-nowrap scrollbar-hide rounded-full`}
                                    >
                                        {offering != null &&
                                        offering["term"] === term && (
                                            Object.entries(
                                                term_info.instructors
                                            ).map(([inst_name, inst_info]) => (
                                                <div
                                                    className={`${
                                                        instructor != null &&
                                                        instructor.name ===
                                                            inst_name
                                                            ? "bg-sky-500 hover:bg-sky-600 text-white"
                                                            : "bg-slate-400 hover:bg-slate-500 "
                                                    }duration-75 p-2 pt-[10px] m-1 font-semibold rounded-full text-md active:scale-95 cursor-pointer`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (
                                                            instructor === null
                                                        ) {
                                                            setInstructor({
                                                                name: inst_name,
                                                                info: madgrades
                                                                    .instructors[
                                                                    inst_name
                                                                ],
                                                            });
                                                        } else if (
                                                            instructor.name ===
                                                            inst_name
                                                        ) {
                                                            setInstructor(null);
                                                        } else {
                                                            setInstructor({
                                                                name: inst_name,
                                                                info: madgrades
                                                                    .instructors[
                                                                    inst_name
                                                                ],
                                                            });
                                                        }
                                                    }}
                                                    key={inst_name + "-" + term}
                                                >
                                                    {inst_name}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div
                                        className={`p-2 pl-0 m-1 ${
                                            offering != null &&
                                            offering.term === term
                                                ? "duration-150 pt-3"
                                                : "pt-3"
                                        }`}
                                    >
                                        <IonIcon
                                            icon={
                                                offering != null &&
                                                offering.term === term
                                                    ? caretBackOutline
                                                    : caretForwardOutline
                                            }
                                        />
                                    </div>
                                </div>,
                            ]
                        )}
                    </div>
                    <div className="p-5">
                        <Bar data={data} options={options} />
                    </div>
                </Suspense>
            </div>
            <div className="flex flex-col rounded-3xl bg-slate-200 min-w-[120px] shadow-xl p-3 m-3">
                <div className="text-2xl font-semibold">Course Description</div>
                <div>{info.description}</div>
            </div>
            <div className="flex flex-wrap">
                <div className="flex flex-col rounded-3xl bg-slate-200 shadow-xl p-3 m-3">
                    <div className="text-2xl font-semibold text-nowrap"> Enrollment Prerequisites </div>
                    <div>{info.prerequisites}</div>
                </div>
                <div className="flex-col rounded-3xl bg-slate-200 shadow-xl p-3 m-3">
                    <div className="text-2xl font-semibold text-nowrap"> Typically Offered</div>
                    {info.typically_offered}
                </div>
                <div className="flex-col rounded-3xl bg-slate-200  shadow-xl p-3 m-3">
                    <div className="text-2xl font-semibold text-nowrap">Grading Basis</div>
                    {info.grading_basis}
                </div>
                <div className="flex flex-col rounded-3xl bg-slate-200 shadow-xl p-3 m-3">
                    <div className="text-2xl font-semibold text-nowrap"> Course Likes</div>
                    <div>{info.prerequisites}</div>
                </div>
            </div>
            <div className="h-10"></div>
        </div>
    );
}

export default CourseInfo;
