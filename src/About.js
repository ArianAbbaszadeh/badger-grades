function About() {
    return (
        <div className="bg-slate-200 h-[92vh] flex justify-around items-center">
            <div className="z-10 text-3xl font-semibold">
                I made this website because I was getting bad grades
            </div>
            <div className="w-3/5 h-2/5 absolute bg-fuchsia-300 top-50 left-10 blur-2xl rounded-full"></div>
            <div className="w-3/5 h-3/5 absolute bg-teal-200 top-40 right-24 blur-3xl rounded-full"></div>
            <div className="w-1/5 h-3/5 absolute bg-sky-300 bottom-16 left-50 blur-3xl rounded-full"></div>
            <div className="fixed bottom-2 text-center text-sm text-slate-500 font-medium">
                <div>Not affiliated with UW Madison</div>
                <div>Updated Fall 2023</div>
            </div>
        </div>
    );
}
export default About;
