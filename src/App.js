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

function App() {
    const [courses, setCourses] = useState([]);
    var PAGE_SIZE = 25;
    const [filters, setFilters] = useState({});
    const [pageFilters, setPageFilters] = useState([limit(25)]);
    const [head, setHead] = useState(null);
    const [tail, setTail] = useState(null);
    const [num, setNum] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [courseInfo, setCourseInfo] = useState(null);
    const [madgrades, setMadgrades] = useState(null);
    const [selected, setSelected] = useState(0);
    const [desktop, setDesktop] = useState(false);
    const fetchCourses = useCallback(async () => {
        setIsLoading(true);

        try {
            console.log("Fetching courses with filters:", filters);
            const courseRef = collection(db, "courses");
            const constraints = [];
            for (const [field, val] of Object.entries(filters)) {
                if (val != null) {
                    if (field == "ethnic_studies" || field == "breadths" || field == "level") {
                        constraints.push(where(field, "==", val));
                        console.log("ethnic studies:" + val);
                    } else if (Array.isArray(val) && val.length > 0) {
                        if(field == 'keywords'){
                            constraints.push(where(field, 'array-contains-any', val));
                        }else{
                            constraints.push(where(field, "in", val));
                        }
                    }
                }
            }
            const q = query(
                courseRef,
                ...constraints,
                orderBy("gpa", "desc"),
                ...pageFilters
            );

            const querySnapshot = await getDocs(q);
            setHead(querySnapshot.docs[0]);
            setTail(querySnapshot.docs[querySnapshot.docs.length - 1]);
            console.log("head", head);
            console.log("tail", tail);
            const courseData = [];
            querySnapshot.forEach((doc) => {
                const name =
                    doc.data().subject_abbr + " " + doc.data().course_num;
                courseData.push({ id: doc.id, name, ...doc.data() });
            });
            console.log("Fetched courses:", courseData);

            setCourses(courseData);
            
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            setIsLoading(false);
            const scroller = document.getElementById("scroller");
            if (scroller){
            scroller.scrollTop = 0;}
        }
    }, [filters, pageFilters]);

    useEffect(() => {
        fetchCourses();

        function handleResize() {
            const aspectRatio = window.innerWidth / window.innerHeight;
            setDesktop(aspectRatio > 1);
        }
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [fetchCourses]);

    return (
        <div className="w-full font-[Poppins] h-screen bg-slate-50">
            <Header />
            {desktop ? (
                <div className="flex flex-row">
                    <div className="flex flex-row flex-1 mt-4 h-full">
                        <SearchForm
                            setFilters={setFilters}
                            setNum={setNum}
                            setPageFilters={setPageFilters}
                            setCourseInfo={setCourseInfo}
                            setMadgrades={setMadgrades}
                            setSelected={setSelected}
                        />
                        <Suspense
                            fallback={<div className="bg-cyan-950">Loading...</div>}
                        >
                            <div className="shadow-2xl shadow-slate-400 w-[100%] h-[88vh] rounded-3xl">
                                <div className="h-[91vh] overflow-y-scroll scrollbar-hide rounded-t-3xl shadow-inner shadow-fuchsia-300 min-w-[400px]">
                                    <CourseSearch
                                        courses={courses}
                                        courseInfo={courseInfo}
                                        setCourseInfo={setCourseInfo}
                                        setSelected={setSelected}
                                    />
                                    <Pagination
                                        className
                                        disabled={courses.length < PAGE_SIZE}
                                        head={head}
                                        tail={tail}
                                        num={num}
                                        setNum={setNum}
                                        setPageFilters={setPageFilters}
                                        setCourseInfo={setCourseInfo}
                                    />
                                </div>
                            </div>
                        </Suspense>
                    </div>
                    <div className="flex-1 p-4">
                        <CourseInfo
                            courseInfo={courseInfo}
                            setMadgrades={setMadgrades}
                            madgrades={madgrades}
                        />
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    {selected === 0 && (
                        <SearchForm
                            setFilters={setFilters}
                            setNum={setNum}
                            setPageFilters={setPageFilters}
                            setCourseInfo={setCourseInfo}
                            setMadgrades={setMadgrades}
                            setSelected={setSelected}
                        />
                    )}
                    {selected === 1 && (
                        <div className="h-[91vh] p-2 overflow-y-scroll scrollbar-hide rounded-t-3xl shadow-inner shadow-fuchsia-300 min-w-[400px]">
                            <CourseSearch
                                courses={courses}
                                courseInfo={courseInfo}
                                setCourseInfo={setCourseInfo}
                                setSelected={setSelected}
                            />
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
                    )}
                    {selected === 2 && (
                        <div >
                            <CourseInfo
                                courseInfo={courseInfo}
                                setMadgrades={setMadgrades}
                                madgrades={madgrades}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
