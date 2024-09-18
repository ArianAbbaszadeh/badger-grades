import React from "react";
import Header from "./Header";
import CourseSearchScreen from "./CourseSearchScreen";
import { BrowserRouter as Router, Routes, Route, BrowserRouter, Outlet } from "react-router-dom";



function App() {
    return (
        <div>
            <Header/>
            <Outlet />
        </div>
    )
}


export default App;