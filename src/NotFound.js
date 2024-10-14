import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="bg-slate-200 h-screen flex flex-col items-center justify-center p-2 space-y-5">
            <div className="text-4xl font-semibold text-center">
                404 - Page Not Found
            </div>

            <div className="w-full max-w-2xl">
                <p className="block text-xl font-medium leading-6 text-gray-900 text-center">
                    Oops! The page you're looking for doesn't exist.
                </p>
            </div>

            <Link to="/home">
                <div className="bg-wisco-700 text-slate-50 text-xl font-medium py-3 px-6 rounded hover:bg-wisco-600 transition duration-300">
                    Back to Safety
                </div>
            </Link>
        </div>
    );
};

export default NotFound;
