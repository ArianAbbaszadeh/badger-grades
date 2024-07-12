import React, { useState, useEffect, useCallback } from "react";
import CourseSearch from './SearchCourses';
import './App.css';
import SearchForm from "./SearchForm";
import { db } from "./firebase";
import { collection, query, where, getDocs, limit, orderBy} from "firebase/firestore";
import Pagination from "./Pagination";
import CourseInfo from "./CourseInfo";


function App() {
  const [courses, setCourses] = useState([]);
  var PAGE_SIZE = 25;
  const [filters, setFilters] = useState({});
  const [pageFilters, setPageFilters] = useState([limit(25)])
  const [head, setHead] = useState(null);
  const [tail, setTail] = useState(null);
  const [num, setNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);
  const [madgrades, setMadgrades] = useState(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log("Fetching courses with filters:", filters);
      const courseRef = collection(db, "courses");
      const constraints = [];
      for (const [field, val] of Object.entries(filters)) {
        if (val != null) {
          if (field == "ethnic_studies") {
            constraints.push(where(field, '==', val));
            console.log("ethnic studies:" + val);
          } else if((Array.isArray(val) && val.length > 0)){
              if(field == "general_ed" || field == "level") {
              constraints.push(where(field, 'in', val));
            } else {
              constraints.push(where(field, "array-contains-any", val));
            }
          }
        }
      }

      const q = query(
        courseRef,
        ...constraints,
        orderBy("gpa", "desc"),
        ...pageFilters,
      );
      

      const querySnapshot = await getDocs(q);
      setHead(querySnapshot.docs[0]);
      setTail(querySnapshot.docs[querySnapshot.docs.length-1]);
      console.log("head", head)
      console.log("tail", tail)
      const courseData = [];
      querySnapshot.forEach((doc) => {
        const name = doc.data().subject_abbrv[0] + " " + doc.data().course_num;
        courseData.push({ id: doc.id, name, ...doc.data() });
      });
      console.log("Fetched courses:", courseData);
      
      setCourses(courseData);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pageFilters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (

    <div className="course-search">
      <div className="course-select">
        <SearchForm 
          setFilters={setFilters} 
          setNum={setNum} 
          setPageFilters={setPageFilters} 
          setMadgrades={setMadgrades} 
          setCourseInfo={setCourseInfo}
        />
        {isLoading ? (
          <div className="courses-scroll">              
            <Pagination 
              disabled={courses.length < PAGE_SIZE} 
              head={head} 
              tail={tail} 
              num={num} 
              setNum={setNum} 
              setPageFilters={setPageFilters}
            />
          </div>
        ) : (
          <div className="courses-scroll">
            <CourseSearch 
              courses={courses} 
              courseInfo={courseInfo} 
              setCourseInfo={setCourseInfo} 
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
      </div>
      <div className="course-info">
        <CourseInfo 
          courseInfo={courseInfo} 
          setMadgrades={setMadgrades} 
          madgrades={madgrades}
        />
      </div>
    </div>
  );
}

export default App;