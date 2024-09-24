import React from "react";
import Header from "./Header";
import { BrowserRouter as Router, Routes, Route, BrowserRouter, Outlet } from "react-router-dom";



function App() {
    return (
        <div>
            <Header/>
            <Outlet />
        </div>
    )
}
//test

export default App;