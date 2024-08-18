const runViewTransition = (callback) => {
    if (document.startViewTransition) {
        document.startViewTransition(callback);
    } else {
        callback(); 
    }
};

export default runViewTransition;