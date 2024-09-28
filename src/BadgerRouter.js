import { BrowserRouter as Router, Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import CourseSearchScreen from "./CourseSearchScreen";
import App from "./App";
import About from "./About";
import Report from "./Report";
import Home from "./Home"
function BadgerRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/badger-grades" element={<App/>}>
					<Route path="/badger-grades/home" element={<Home/>}/>
                    <Route path="/badger-grades/course_search" element={<CourseSearchScreen/>}/>
                    <Route path="/badger-grades/about" element={<About/>}/>
					<Route path="/badger-grades/report" element={<Report/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
export default BadgerRouter;