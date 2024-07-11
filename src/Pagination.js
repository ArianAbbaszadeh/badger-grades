import React, { useState } from 'react';
import { db } from "./firebase";
import { collection, endBefore, limit, limitToLast, startAfter, doc } from "firebase/firestore";
import './App.css'

function Pagination({disabled, head, tail, num, setNum, setPageFilters}){
	const next_page = () => {
		const constraints = [];
		constraints.push(startAfter(tail));
		constraints.push(limit(25))
		setPageFilters(constraints);
		setNum(num+1)
	}

	const prev_page = () => {
		const constraints = [];
		constraints.push(endBefore(head));
		constraints.push(limitToLast(25))
		setPageFilters(constraints);
		setNum(num-1)
	}
	return (
		<div className="page-selector">
        <button 	
          className="page-button page-left" 
          onClick={prev_page}
          disabled={num === 1}
        >
          {'<'}
        </button>
        {num}
        <button 
          className="page-button page-right"
          onClick={next_page}
		  disabled={disabled}
        >
          {'>'}
        </button>
      </div>
	);
}
export default Pagination;