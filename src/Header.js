import { IonIcon } from "@ionic/react";
import { menu, close } from "ionicons/icons";
import { useEffect, useState } from "react";
import runViewTransition from "./RunViewTransition";
import { Link, useLocation } from "react-router-dom";

function Header() {
    const [icon, setIcon] = useState(0);
    const [cur, setCur] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path === "/home") setCur(1);
        else if (path === "/course_search") setCur(2);
        else if (path === "/about") setCur(3);
        else if (path === "/report") setCur(4);
        else setCur(0);
    }, [location]);
    const handleClick = () => {
        setIcon(1 - icon);
    };
    return (
        <nav className="group p-3 h-[8vh] min-h-15 bg-slate-50 border-b-2 border-slate-200 hover:bg-wisco-700 hover:text-slate-50 duration-300 md:flex md:items-center md:justify-between">
            <div className="flex justify-between items-center">
                <span className="text-3xl font-semibold font-[Poppins] cursor-pointer group-hover:text-slate-50 text-wisco-700 duration-200">
                    <Link to="/home" onClick={() => setCur(1)}>
                        Badger Grades
                    </Link>
                </span>
                <span className="text-3xl cursor-pointer md:hidden mx-2 block">
                    <IonIcon
                        icon={icon === 0 ? menu : close}
                        onClick={() => {
                            runViewTransition(() => {
                                handleClick();
                            });
                        }}
                    />
                </span>
            </div>

            <ul
                className={`group md:flex items md:items-center z-10 md:z-auto md:static absolute w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 ${
                    icon === 0
                        ? "top-[-400px]"
                        : "top-[8vh] bg-slate-50 group-hover:bg-wisco-700 duration-300"
                }`}
            >
                <li className="mx-4 my-6 md:my-0">
                    <Link to="/home">
                        <div
                            className={`text-xl ${
                                cur === 1 ? "font-black" : "font-medium"
                            } hover:font-black hover:duration-200`}
                            href="#"
                        >
                            HOME
                        </div>
                    </Link>
                </li>
                <li className="mx-4 my-6 md:my-0">
                    <Link to="/course_search">
                        <div
                            className={`text-xl ${
                                cur === 2 ? "font-black" : "font-medium"
                            } hover:font-black hover:duration-200`}
                            href="#"
                        >
                            COURSE SEARCH
                        </div>
                    </Link>
                </li>
                <li className="mx-4 my-6 md:my-0">
                    <Link to="/about">
                        <div
                            className={`text-xl ${
                                cur === 3 ? "font-black" : "font-medium"
                            } hover:font-black hover:duration-200`}
                            href="#"
                        >
                            ABOUT
                        </div>
                    </Link>
                </li>
                <li className="mx-4 my-6 md:my-0">
                    <Link to="/report">
                        <div
                            className={`text-xl ${
                                cur === 4 ? "font-black" : "font-medium"
                            } hover:font-black hover:duration-200`}
                            href="#"
                        >
                            REPORT A BUG
                        </div>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
