import React, { useState, useEffect, useCallback, Suspense } from "react";
import CourseSearch from "./SearchCourses";
import SearchForm from "./SearchForm";
import Header from "./Header";
import { db } from "./firebase";
import {
    collection,
    query,
    where,
    getDocs,
    limit,
    orderBy,
} from "firebase/firestore";
import Pagination from "./Pagination";
import CourseInfo from "./CourseInfo";
import "./index.css";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import Sorter from "./Sorter";
import runViewTransition from "./RunViewTransition";
import CSLoader from "./CourseSearchWait";

function App() {
    console.log("App component rendering");
    const [info, setInfo] = useState({});
    const [courses, setCourses] = useState([]);
    const PAGE_SIZE = 25;
    const [filters, setFilters] = useState({});
    const [pageFilters, setPageFilters] = useState([limit(25)]);
    const [head, setHead] = useState(null);
    const [tail, setTail] = useState(null);
    const [num, setNum] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [sort, setSort] = useState("course_num");
    const [courseInfo, setCourseInfo] = useState(null);
    const [madgrades, setMadgrades] = useState(null);
    const [selected, setSelected] = useState(0);
    const [desktop, setDesktop] = useState(window.innerWidth / window.innerHeight > 1);

    const fetchCourses = useCallback(async () => {
        console.log("fetchCourses called with filters:", filters);
        setIsLoading(true);
        if(selected === 2) setSelected(1);
        try {
            const courseRef = collection(db, "courses");
            const constraints = [];
            for (const [field, val] of Object.entries(filters)) {
                if (val != null) {
                    if(field === "course_num" || field === "min_cred" || field == "max_cred" || field == "gpa"){
                        constraints.push(where(field, '>=', val[0]));
                        constraints.push(where(field, '<=', val[1]));
                    } else if (field === "ethnic_studies" || field === "breadths" || field === "level" || field === 'subject_abbr' || field === "currently_taught" || field === "title") {
                        constraints.push(where(field, "==", val));
                        console.log(`Adding constraint: ${field} == ${val}`);
                    } else if (Array.isArray(val) && val.length > 0) {
                        if(field === 'keywords'){
                            constraints.push(where(field, 'array-contains-any', val));
                            console.log(`Adding constraint: ${field} array-contains-any ${val}`);
                        }else{
                            constraints.push(where(field, "in", val));
                            console.log(`Adding constraint: ${field} in ${val}`);
                        }
                    }
                }
            }

            const sort_call = []
            sort === "gpa" ? sort_call.push(orderBy(sort, "desc")) : sort_call.push(orderBy(sort))
            const q = query(
                courseRef,
                ...constraints,
                ...sort_call,
                ...pageFilters
            );

            console.log("Executing Firestore query");
            const querySnapshot = await getDocs(q);
            console.log(`Query returned ${querySnapshot.docs.length} results`);

            setHead(querySnapshot.docs[0]);
            setTail(querySnapshot.docs[querySnapshot.docs.length - 1]);
            
            const courseData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, name: `${data.subject_abbr} ${data.course_num}`, ...data };
            });
            
            console.log(`Setting courses with ${courseData.length} items`);
            runViewTransition(() => {
                setCourses(courseData);
            });
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            runViewTransition(() => {
                setIsLoading(false);
            })
            const scroller = document.getElementById("scroller");
            if (scroller) {
                console.log("Scrolling to top");
                scroller.scrollTop = 0;
            }
        }
    }, [filters, pageFilters, sort]);

    useEffect(() => {
        console.log("Initial useEffect running");
        fetchCourses();

        const handleResize = () => {
            const newDesktop = window.innerWidth / window.innerHeight > 1;
            if (newDesktop !== desktop) {
                console.log(`Window resized, setting desktop to ${newDesktop}`);
                setDesktop(newDesktop);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            console.log("Cleaning up resize event listener");
            window.removeEventListener("resize", handleResize);
        }
    }, [fetchCourses, desktop]);

    const renderMobileView = () => {
        console.log(`Rendering mobile view with selected: ${selected}`);
        switch(selected) {
            case 0:
                return (
                    <SearchForm
                        setFilters={setFilters}
                        setNum={setNum}
                        setPageFilters={setPageFilters}
                        setCourseInfo={setCourseInfo}
                        setMadgrades={setMadgrades}
                        setSelected={setSelected}
                    />
                );
            case 1:
                return (
                    <div className="h-[92vh] shadow-2xl min-w-[324px] flex-col flex bg-slate-200">
                        <div className="h-[8%] min-h-8 text-center place-items-center bg-transparent">
                            <div className="flex flex-row justify-between p-[2vh]">
                                <IonIcon
                                    className="size-10 cursor-pointer"
                                    icon={arrowBackOutline}
                                    onClick={() => {
                                        console.log("Back button clicked, setting selected to 0");
                                        runViewTransition(() => {
                                            setSelected(0);
                                            
                                        });
                                    }}
                                />
                                <div className="flex justify-between items-start sm:w-[60%] w-[100%] pl-2">
                                    <div className="text-[26px] font-semibold">
                                        Courses
                                    </div>
                                    <Sorter setSort={setSort} sort={sort}/>
                                </div>
                            </div>
                        </div>
                        { isLoading ? 
                        <CSLoader message="Loading"/>
                        : 
                        <CourseSearch
                            courses={courses}
                            courseInfo={courseInfo}
                            setCourseInfo={setCourseInfo}
                            setSelected={setSelected}
                            setInfo={setInfo}
                        />
                        }
                        <Pagination
                            disabled={courses.length < PAGE_SIZE}
                            head={head}
                            tail={tail}
                            num={num}
                            setNum={setNum}
                            setPageFilters={setPageFilters}
                            setCourseInfo={setCourseInfo}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="h-[92vh] overflow-y-scroll">
                        <div className="rounded-full bg-slate-200 hover:bg-slate-300 duration-100 inline-block size-10 m-2" >
                            <IonIcon
                                className="size-10 cursor-pointer"
                                icon={arrowBackOutline}
                                onClick={() => {
                                    console.log("Back button clicked, setting selected to 1");
                                    runViewTransition(() => {
                                        setCourseInfo(null);
                                        setSelected(1);
                                    });
                                }}
                            />
                        </div>
                        <CourseInfo
                            courseInfo={courseInfo}
                            setMadgrades={setMadgrades}
                            madgrades={madgrades}
                            info={info}
                            setInfo={setInfo}
                        />
                    </div>
                );
            default:
                console.log(`Unexpected selected value: ${selected}`);
                return null;
        }
    };

    console.log(`Rendering App component, desktop: ${desktop}`);
    return (
        <div className="font-[Poppins] text-slate-800 bg-slate-50 box min-w-[100vw] cursor-default">
            <Header />
            {desktop ? (
                <div className="flex flex-row">
                    <div className="flex flex-row flex-1 h-[92vh] w-[40%]">
                        <div className="flex flex-col justify-start min-w-[324px] w-[50%] mr-2">
                            <SearchForm
                                setFilters={setFilters}
                                setNum={setNum}
                                setPageFilters={setPageFilters}
                                setCourseInfo={setCourseInfo}
                                setMadgrades={setMadgrades}
                                setSelected={setSelected}
                                setSort={setSort}
                            />
                        </div>
                        <Suspense fallback={<div className="bg-cyan-950">Loading...</div>}>
                            <div className="rounded-t-3xl shadow-slate-500 shadow-2xl min-w-[324px] w-[60%] flex-col flex bg-slate-200 mt-3">
                                <div className="h-[8%] min-h-8 text-center bg-transparent before">
                                    <div className="flex flex-row justify-between items-start mt-[1vh] mx-4 h-[100%] bg-transparent">
                                        <div className="text-2xl font-semibold">Courses</div>
                                        <Sorter className="flex items-end" setSort={setSort} sort={sort}/>
                                    </div>
                                </div>
                        { isLoading ? 
                            <CSLoader message="Loading"/>
                        : 
                        <CourseSearch
                            courses={courses}
                            courseInfo={courseInfo}
                            setCourseInfo={setCourseInfo}
                            setSelected={setSelected}
                            setInfo={setInfo}
                        />
                        }
                                <Pagination
                                    disabled={courses.length < PAGE_SIZE}
                                    head={head}
                                    tail={tail}
                                    num={num}
                                    setNum={setNum}
                                    setPageFilters={setPageFilters}
                                    setCourseInfo={setCourseInfo}
                                />
                            </div>
                        </Suspense>
                    </div>
                    <div className="h-[92vh] flex-1 p-4 w-[50%] overflow-y-scroll scrollbar-hide">
                        {selected === 2 ? (
                            <div>
                                <div className="rounded-full bg-slate-200 hover:bg-slate-300 duration-100 inline-block size-10" >
                                    <IonIcon
                                        className="size-10 cursor-pointer"
                                        icon={arrowBackOutline}
                                        onClick={() => {
                                            console.log("Back button clicked, setting selected to 1");
                                            runViewTransition(() => {
                                                setCourseInfo(null);
                                                setSelected(1);
                                            });
                                        }}
                                    />
                                </div>
                                <CourseInfo
                                    courseInfo={courseInfo}
                                    setMadgrades={setMadgrades}
                                    madgrades={madgrades}
                                    info={info}
                                    setInfo={setInfo}
                                />                       
                            </div>
                        ) : (<></>)}
                    </div>                 
                </div>
            ) : (
                <div className="h-[92vh]">
                    {renderMobileView()}
                </div>
            )}
        </div>
    );
}

export default App;