import { BrowserRouter as Router, Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import CourseSearchScreen from "./CourseSearchScreen";
import App from "./App";
import About from "./About";
import Report from "./Report";
function BadgerRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/cuck-the-curve" element={<App/>}>
					<Route path="/cuck-the-curve/home" element={<></>}/>
                    <Route path="/cuck-the-curve/course_search" element={<CourseSearchScreen/>}/>
                    <Route path="/cuck-the-curve/about" element={<About/>}/>
					<Route path="/cuck-the-curve/report" element={<Report/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
export default BadgerRouter;