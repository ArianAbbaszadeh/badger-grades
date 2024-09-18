import { BrowserRouter as Router, Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import CourseSearchScreen from "./CourseSearchScreen";
import App from "./App";
function BadgerRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
					<Route path="/home" element={<></>}/>
                    <Route path="/course_search" element={<CourseSearchScreen/>}/>
                    <Route path="/about" element={<></>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
export default BadgerRouter;