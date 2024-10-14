import { Routes, Route, BrowserRouter, HashRouter } from "react-router-dom";
import CourseSearchScreen from "./CourseSearchScreen";
import App from "./App";
import About from "./About";
import Report from "./Report";
import Home from "./Home";
import NotFound from "./NotFound";
function BadgerRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route
                        path="/course_search"
                        element={<CourseSearchScreen />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
export default BadgerRouter;
