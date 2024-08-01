import React, {Suspense, useCallback, useEffect, useRef, useState} from "react";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale, scales} from "chart.js";
import { collection, doc, getDoc} from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { apiToken } from "./token";
import { db } from "./firebase"
import ReactLoading from 'react-loading';

//register BarChart ELements
ChartJS.register(
	BarElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
  )
function sem_from_term(term){
	if ((term - Math.floor((term/10))*10) == 2){
		return `Fall ${1899 + Math.floor(term/10)}`;
	} else if((term - Math.floor((term/10))*10) == 4){
		return `Spring ${1900 + Math.floor(term/10)}`;
	} else if((term - Math.floor((term/10))*10) == 6){
		return `Summer ${1900 + Math.floor(term/10)}`;
	} else{
		return "";
	}
}

function CourseInfo({courseInfo, setMadgrades, madgrades}){
	const [offering, setOffering] = useState(null);
	const [instructor, setInstructor] = useState(null);
	const [instructorTerm, setInstructorTerm] = useState(null);
	const [info, setInfo] = useState({});
	
	//get course grade distribution information
	const fetchGradeInfo = useCallback(async (url) => {
		setMadgrades(null);
		setOffering(null);
		setInstructor(null);
		setInstructorTerm(null);
		try{			
		  console.log("url", url);
		  const response = await fetch(url, {
			method: 'GET',
			headers: {
			  'Authorization': 'Token token=' + apiToken,
			  'Accept': 'application/json'
			}
		  })
		  
		  if(!response.ok){
			console.log("url", url);
			return null;
		  }
		  
		  const json = await response.json();
		  try{
			const response2 = await fetch(json.gradesUrl, {
				method: 'GET',
				headers: {
				'Authorization': 'Token token=' + apiToken,
				'Accept': 'application/json'
				}
			});
			if (!response.ok){
				return null
			}

			const grade_json = await response2.json();
			const temp = {};
			temp.cumulative = grade_json.cumulative
			temp.terms = {}
			temp.instructors = {}
			grade_json.courseOfferings.map((offer) => {
				const temp_term = sem_from_term(offer.termCode)
				const temp_offer = {};
				temp_offer.cumulative = offer.cumulative;
				temp_offer.instructors = {};
				offer.sections.map((section) => {
					section.instructors.map((instructor) => {
						if(Object.keys(temp_offer.instructors).includes(instructor.name)){
							temp_offer.instructors[instructor.name].A += section.aCount;
							temp_offer.instructors[instructor.name].AB += section.abCount;
							temp_offer.instructors[instructor.name].B += section.bCount;
							temp_offer.instructors[instructor.name].BC += section.bcCount;
							temp_offer.instructors[instructor.name].C += section.cCount;
							temp_offer.instructors[instructor.name].D += section.dCount;
							temp_offer.instructors[instructor.name].F += section.fCount;
							temp_offer.instructors[instructor.name].total += section.total;
						} else{
							temp_offer.instructors[instructor.name] = {};
							temp_offer.instructors[instructor.name].A = section.aCount;
							temp_offer.instructors[instructor.name].AB = section.abCount;
							temp_offer.instructors[instructor.name].B = section.bCount;
							temp_offer.instructors[instructor.name].BC = section.bcCount;
							temp_offer.instructors[instructor.name].C = section.cCount;
							temp_offer.instructors[instructor.name].D = section.dCount;
							temp_offer.instructors[instructor.name].F = section.fCount;
							temp_offer.instructors[instructor.name].total = section.total;
						}
					})
				})
				temp.terms[temp_term] = temp_offer;
			})
			
			Object.entries(temp.terms).forEach(([term_name, term_info]) => {
				if(term_info.instructors == null){
					return;
				}
				Object.entries(term_info.instructors).forEach(([inst_name, inst_info]) => {
					if(Object.keys(temp.instructors).includes(inst_name)){
						Object.keys(inst_info).forEach((key) => {
							temp.instructors[inst_name][key] += inst_info[key];
						});
					} else {
						temp.instructors[inst_name] = {}
						Object.keys(inst_info).forEach((key) => {
							temp.instructors[inst_name][key] = inst_info[key];
						});
					}
				})
			})
			setMadgrades(temp);
		  } catch(error){
			console.error(error.message);
		  }
		  
		} catch(error) {
		  console.error(error.message);
		}
	});

	const fetchCourseInfo = useCallback(async () => {
		var max = -1;
		var max_uuid;
		if(courseInfo.course_info_uuid != null){
			for (const [term, uuid] of Object.entries(courseInfo.course_info_uuid)){
				const tempterm = parseInt(term);
				if(tempterm > max){
					max = tempterm;
					max_uuid = uuid
				}
			}
		
			setInfo((await getDoc(doc(collection(db, "course_info"), max_uuid))).data());
		}
	})
	useEffect(() => {
		if(courseInfo == null){
			return;
		}
		fetchGradeInfo(courseInfo.mad_url);
		fetchCourseInfo();
	
	}, [courseInfo]);

	let total = 1;
	let labels = [];
	let values = [];

	if(madgrades != null){
		total = madgrades.cumulative.total;
		const gradeData = Object.fromEntries(
		Object.entries(madgrades.cumulative).filter(([key]) => !['total', 'crCount', 'iCount', 'nCount', 'nwCount', 'pCount', 'sCount', 'uCount', 'nrCount', 'otherCount'].includes(key)));
		const cleaned = Object.fromEntries(Object.entries(gradeData).map(([key, value]) => [key.slice(0, -5).toUpperCase(), value]));
		const sorted = Object.fromEntries(Object.entries(cleaned).sort((a,b) => a[0].localeCompare(b[0])));
			
		labels = Object.keys(sorted);
		values = Object.values(sorted);
	}
	const data = {
		labels: labels,
		datasets:[{
			label: ["Cumulative Course Data"],
			data: values.map(value => 100*(value/total)),
			backgroundColor: "black"
		},],
	};
	
	if(offering != null){
		let values2 = [];
		const offering_total = offering["info"].cumulative.total;
		const gradeData = Object.fromEntries(
			Object.entries(offering["info"].cumulative).filter(([key]) => !['total', 'crCount', 'iCount', 'nCount', 'nwCount', 'pCount', 'sCount', 'uCount', 'nrCount', 'otherCount'].includes(key)));
		const cleaned = Object.fromEntries(Object.entries(gradeData).map(([key, value]) => [key.slice(0, -5).toUpperCase(), value]));
		const sorted = Object.fromEntries(Object.entries(cleaned).sort((a,b) => a[0].localeCompare(b[0])));

		values2 = Object.values(sorted)

		data.datasets.push({label:[`${offering["term"]} Course Data`], 
		data: values2.map(value => 100 * (value/offering_total)), 
		backgroundColor: "red"})
	}

	if(instructor != null){
		console.log("instructor", JSON.stringify(instructor))
		let values2 = [];
		const inst_total = instructor["info"].total;
		const gradeData = Object.fromEntries(
			Object.entries(instructor["info"]).filter(([key]) => !['total'].includes(key)));
		const sorted = Object.fromEntries(Object.entries(gradeData).sort((a,b) => a[0].localeCompare(b[0])));

		values2 = Object.values(sorted)

		data.datasets.push({label:[`${instructor["name"]} Course Data`], 
		data: values2.map(value => 100 * (value/inst_total)), 
		backgroundColor: "orange"})
	}

	if(instructorTerm != null){
		console.log(JSON.stringify(instructorTerm));
		let values = [];
		const inst_total = instructorTerm["info"].total;
		const gradeData = Object.fromEntries(
			Object.entries(instructorTerm["info"]).filter(([key]) => !['total'].includes(key)));
		const sorted = Object.fromEntries(Object.entries(gradeData).sort((a,b) => a[0].localeCompare(b[0])));

		values = Object.values(sorted)

		data.datasets.push({label:[`${instructorTerm["name"]} ${instructorTerm["term"]} Course Data`], 
		data: values.map(value => 100 * (value/inst_total)), 
		backgroundColor: "gold"})
	}
	if(madgrades == null || courseInfo == null){
		return <></>
	}
	const options={
		scales:{
			y:{
				min: 0, 
				max: 100,
			},
		},
	};

	return(
		<div>
			<div className="text-4xl font-semibold">{info.title_suggest}</div>
			<div className="flex flex-col min-h-[600px] rounded-3xl bg-neutral-200 shadow-2xl md:w-[100%] relative">
				<Suspense>
					<div className="flex flex-row w-[49vw] overflow-x-scroll border-black scrollbar-hide ">
						{Object.entries(madgrades.terms).map(([term, term_info]) => [
							<div className="p-5 m-2 bg-white rounded-3xl min-w-36 shadow-md"
								>
								{term}
							</div>
						])}
					</div>
					<div className="p-5">
							<Bar 
										data={data}
										options={options}
							/>
					</div>
				</Suspense>
			</div>
		</div>
	)
	/** 
	return(
		<div className="info">
				<h1>{courseInfo.name}</h1>
				<div>
					<h2>Grade Distribution: </h2>
					<Suspense fallback={<ReactLoading type="spin">|</ReactLoading>}>
						<div >
							<div >
							{	
								Object.entries(madgrades.terms).map(([term, term_info]) => [
									<div >
										<div style={{transition: "0.2s", padding: "5px", borderRadius: "inherit", backgroundColor: offering != null && offering["term"] == term? "red" : "inherit"}}onClick={() => {
											setInstructorTerm(null);
											setInstructor(null);
											if(offering != null && offering["info"] == term_info){
												setOffering(null);
											} else {
												setOffering({"term" : term, "info" : term_info}); 
											}}}>{term}</div> 
										{(offering != null && offering["info"] == term_info) || (instructor != null && Object.keys(term_info.instructors).includes(instructor["name"])) ? Object.entries(term_info.instructors).map(([inst_name, inst_info]) => ([
											<div style={{transition: "0.2s",
														paddingLeft: "20px", 
														borderRadius: "inherit",
														backgroundColor: instructor != null && inst_name == instructor["name"] ? 
														instructorTerm != null && instructorTerm["term"] == term ? "gold": "orange" : "inherit"}} onClick={() => {
												if(instructor == null) {
													setInstructor({"name": inst_name, "info": madgrades.instructors[inst_name]})	
													setInstructorTerm(null);											
												} else if(instructor["name"] != inst_name){
													setInstructor({"name": inst_name, "info": madgrades.instructors[inst_name]})												
													setInstructorTerm(null);
													setOffering({"term" : term, "info" : term_info}); 
												} else if (instructor != null && instructorTerm == null) {
													setInstructorTerm({"term": term, "name": inst_name, "info": inst_info});
													setOffering({"term" : term, "info" : term_info});
												} else if (instructor != null && instructorTerm != null){
													if(instructorTerm["info"] == inst_info){
														setInstructorTerm(null);
													}else if(instructorTerm["name"] == inst_name){
														setInstructorTerm({"term": term, "name": inst_name, "info": inst_info});
														setOffering({"term" : term, "info" : term_info});
													}
												}
											}}>{inst_name}</div>
										])) : <></>}
									</div>
								])
							}	
							</div>
							<div className="graph">
								<Bar 
									data={data}
									options={options}
								/>
							</div>
						</div>
					</Suspense>
				</div>
			<div>
				<h2>Description: </h2>{info.description}
			</div>
		</div>
	);
	*/
}

export default CourseInfo;