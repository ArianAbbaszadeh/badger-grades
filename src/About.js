function About() {
    return (
        <div className="bg-slate-200 h-[92vh] flex flex-col justify-center items-center">
            <div className="z-10 text-3xl font-semibold max-w-[90%] text-center">
                I made this website because I was tired of switching between the
                Course Search & Enroll and Madgrades
            </div>
            <div className=" z-10 text-center text-sm text-slate-500">
                Shout out to{" "}
                <a
                    target="blank"
                    href="https://api.madgrades.com/"
                    className="underline"
                >
                    Madgrades API
                </a>{" "}
                though.
            </div>
            <div className="w-3/5 h-2/5 absolute bg-fuchsia-300 top-50 left-10 blur-2xl rounded-full"></div>
            <div className="w-3/5 h-3/5 absolute bg-teal-200 top-40 right-24 blur-3xl rounded-full"></div>
            <div className="w-1/5 h-3/5 absolute bg-sky-300 bottom-16 left-50 blur-3xl rounded-full"></div>
            <div className="fixed bottom-2 text-center text-sm text-slate-500 font-medium">
                <div>Not Affiliated With UW Madison</div>
                <div>Courses Updated Fall 2023</div>
            </div>
        </div>
    );
}
export default About;
