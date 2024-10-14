import { IonIcon } from "@ionic/react";
import { menu, close } from "ionicons/icons";
import { useState } from "react";
import runViewTransition from "./RunViewTransition";
import { Link } from "react-router-dom";

function Header() {
    const [icon, setIcon] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const handleClick = () => {
        setIcon(1 - icon);
        setOpacity(0);
    };
    return (
        <nav className="p-3 h-[8vh] min-h-15 bg-slate-50 border-b-2 border-slate-200 md:flex md:items-center md:justify-between">
            <div className="flex justify-between items-center">
                <span className="text-3xl font-semibold font-[Poppins] cursor-pointer">
                    <Link to="/badger-grades/home">Badger Grades</Link>
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
                className={`md:flex items md:items-center z-10 md:z-auto md:static absolute bg-slate-50 w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 ${
                    icon === 0 ? "top-[-400px]" : "top-[8vh]"
                } transition-all ease-in duration-500`}
            >
                <li className="mx-4 my-6 md:my-0">
                    <Link to="/badger-grades/home">
                        <div
                            className="text-xl font-medium hover:text-blue-500 duration-200"
                            href="#"
                        >
                            HOME
                        </div>
                    </Link>
                </li>
                <li className="mx-4 my-6 md:my-0">
                    <Link to="/badger-grades/course_search">
                        <div
                            className="text-xl font-medium hover:text-blue-500 duration-200"
                            href="#"
                        >
                            COURSE SEARCH
                        </div>
                    </Link>
                </li>
                <li className="mx-4 my-6 md:my-0">
                    <Link to="/badger-grades/about">
                        <div
                            className="text-xl font-medium hover:text-blue-500 duration-200"
                            href="#"
                        >
                            ABOUT
                        </div>
                    </Link>
                </li>
                <li className="mx-4 my-6 md:my-0">
                    <Link to="/badger-grades/report">
                        <div
                            className="text-xl font-medium hover:text-blue-500 duration-200"
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
