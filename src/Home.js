function Home() {
    return (
        <div className="bg-slate-200 min-h-screen flex flex-col items-center justify-start pt-20 px-4 space-y-16">
            <div className="z-10 text-4xl font-semibold text-center">
                Welcome to Badger Grades
            </div>

            <div className="text-1xl">
                Badger Grades Description
            </div>

            <div className="w-full max-w-2xl">
                <label htmlFor="course-search" className="block text-xl font-medium leading-6 text-gray-900 mb-4 text-center">
                    Start by searching for a Course
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        type="text"
                        name="course-search"
                        id="course-search"
                        className="block w-full rounded-lg border-0 py-3 px-4 text-lg
                            text-gray-900 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        placeholder="Ex: GERMAN 275, COMPSCI 577"
                    />
                </div>
            </div>

            <div className="w-4/5 h-1/3 absolute bg-fuchsia-300 bottom-0 blur-3xl rounded-full opacity-50">
            </div>
        </div>
    );


}

export default Home;
