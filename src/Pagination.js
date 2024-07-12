import React from 'react';
import { endBefore, limit, limitToLast, startAfter } from "firebase/firestore";
import './page.css'
import { Button } from 'react-bootstrap';

function Pagination({disabled, head, tail, num, setNum, setPageFilters, setCourseInfo}){
	const next_page = () => {
		const constraints = [];
		constraints.push(startAfter(tail));
		constraints.push(limit(25));
		setPageFilters(constraints);
		setNum(num+1)
		setCourseInfo(null)
	}

	const prev_page = () => {
		const constraints = [];
		constraints.push(endBefore(head));
		constraints.push(limitToLast(25))
		setPageFilters(constraints);
		setNum(num-1)
		setCourseInfo(null);
	}
	return (
		<div className='page-box'>
			<div className="page-selector">
				<Button 
					onClick={prev_page} 
					disabled={num <= 1}
				>{"<"}</Button>
				{num}
				<Button 
					onClick={next_page} 
					disabled={disabled}
					variant='primary'
				>{">"}</Button>
			</div>
	  	</div>
	);
}
export default Pagination;