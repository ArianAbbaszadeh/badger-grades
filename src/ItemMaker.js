import "./App.css"

export function TitleBox(name, desc, gpa){
	return (
		<div className="course-box">
			<div className="course-top">
				<div className="course-title">{name}</div>
				<div className="course-desc">{desc}</div>
			</div>
			<div className="course-gpa">
			</div>
		</div>
		
	);
}
