import React from "react";
import "./App.css";


function CourseSearch({courses, setCourseInfo, courseInfo}) {
  console.log("Rendering CourseSearch with courses:", courses);
  
  if (!courses || courses.length === 0) {
    return <div>No courses found. Try adjusting your search criteria.</div>;
  }


  return (
	<div className="course">
		<div className="course-scroll">
		{courses.map((course) => (
			<div key={course.id} className="course-box" onClick={() => setCourseInfo(course)}>  
			<div className="course-top">
				<div className="course-title">{course.name}</div>
				<div className="course-gpa">
				GPA: {course.grade_info && course.grade_info.total_gpa > 0 ? Number(course.grade_info.total_gpa).toFixed(2) : "None"}
				</div>
			</div>
			<div className="course-description">{course.title}</div>
			</div>
		))}
		</div>
	</div>
  );
}

export default CourseSearch;