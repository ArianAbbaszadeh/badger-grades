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

function CSLoader({message}){
	return (
		<div className="h-[84%] flex items-center justify-around p-3 text-center">
			{message}
		</div> 
	)
}

export default CSLoader;