import React, { useState, useEffect, useRef } from 'react';
import { limit } from "firebase/firestore";

function SearchForm({setFilters, setNum, setPageFilters, setMadgrades, setCourseInfo}) {
  const [subject, setSubject] = useState('All subjects');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [breadths, setBreadths] = useState({
    biologicalSciences: false,
    humanities: false,
    literature: false,
    naturalSciences: false,
    physicalSciences: false,
    socialSciences: false
  });
  const [general_ed, setGeneralEducation] = useState({
    communicationA: false,
    communicationB: false,
    quantitativeReasoningA: false,
    quantitativeReasoningB: false,
  });
  const [levels, setLevels] = useState({
    elementary: false,
	intermediate: false,
	advanced: false,
  });
  const [ethnic_studies, setEthnic] = useState({
	ethnicStudies: null
  })


  const dropdownRef = useRef(null);

  // Sample list of subjects - replace with your actual list
  const subjects = [
    'All subjects',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Literature',
    'Philosophy',
    'Psychology'
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredSubjects = subjects.filter(s => 
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const handleSubjectChange = (selected) => {
    setSubject(selected);
    setSubjectSearch(selected);
    setShowDropdown(false);
  };

  const handleBreadthChange = (event) => {
    setBreadths({...breadths, [event.target.name]: event.target.checked});
  };

  const handleGeneralEducationChange = (event) => {
    setGeneralEducation({...general_ed, [event.target.name]: event.target.checked});
  };

  const handleLevelsChange = (event) => {
	setLevels({...levels, [event.target.name]: event.target.checked})
  }

  const handleEthnicChange = (event) => {
	setEthnic({...ethnic_studies, [event.target.name]: event.target.checked})
  }


  const handleSubmit = (event) => {
	event.preventDefault();
    
    const breadthMap = {
      biologicalSciences: 'B',
      humanities: 'H',
      literature: 'L',
      naturalSciences: 'N',
      physicalSciences: 'P',
      socialSciences: 'S'
    };

    const genEdMap = {
      communicationA: 'COM A',
      communicationB: 'COM B',
      quantitativeReasoningA: 'QR-A',
      quantitativeReasoningB: 'QR-B'
    };

	const levelsMap = {
		elementary: ['E'],
		intermediate: ['I'],
		advanced: ['A']
	}


    const filters = {
      "breadths": Object.entries(breadths)
        .filter(([_, value]) => value)
        .map(([key, _]) => breadthMap[key]),
      "general_ed": Object.entries(general_ed)
        .filter(([_, value]) => value)
        .map(([key, _]) => genEdMap[key]),
	  "level": Object.entries(levels)
	  	.filter(([_, value]) => value)
	 	.map(([key, _]) => levelsMap[key]),
	  "ethnic_studies": ethnic_studies.ethnicStudies ? true : null
    };
	console.log(filters);
    // Call the courseSearch function with the formatted filters
	setFilters(filters);
	setPageFilters([limit(25)]);
  setCourseInfo(null);
  setMadgrades(null);
	setNum(1);
  };

  return (
    <form id='form' onSubmit={handleSubmit} className="search-form">
      <div className="form-group dropdown-container" ref={dropdownRef}>
        <input 
          type="text"
          value={subjectSearch}
          onChange={(e) => {
            setSubjectSearch(e.target.value);
            setShowDropdown(true);
          }}
          onClick={() => setShowDropdown(true)}
          placeholder="Search subjects"
          className="form-control"
        />
        {showDropdown && (
          <div className="form-control">
            {filteredSubjects.map((s, index) => (
              <div 
                key={index} 
                className="dropdown-item"
                onClick={() => handleSubjectChange(s)}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <input 
          type="text" 
          placeholder="Keywords" 
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <h3 className="form-title">Breadths</h3>
        <div className="checkbox-group">
          {Object.entries(breadths).map(([key, value]) => (
            <label key={key} className="checkbox-label">
              <input 
                type="checkbox" 
                name={key}
                checked={value}
                onChange={handleBreadthChange}
                className="checkbox-input"
              />
              <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <h3 className="form-title">General Education</h3>
        <div className="checkbox-group">
          {Object.entries(general_ed).map(([key, value]) => (
            <label key={key} className="checkbox-label">
              <input 
                type="checkbox" 
                name={key}
                checked={value}
                onChange={handleGeneralEducationChange}
                className="checkbox-input"
              />
              <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
            </label>
          ))}
        </div>
      </div>

	  <div className="form-group">
        <h3 className="form-title">Levels</h3>
        <div className="checkbox-group">
          {Object.entries(levels).map(([key, value]) => (
            <label key={key} className="checkbox-label">
              <input 
                type="checkbox" 
                name={key}
                checked={value}
                onChange={handleLevelsChange}
                className="checkbox-input"
              />
              <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button 
          type="button" 
          onClick={() => {
            setSubject('All subjects');
            setSubjectSearch('');
            setKeywords('');
            setBreadths(Object.fromEntries(Object.keys(breadths).map(k => [k, false])));
            setGeneralEducation(Object.fromEntries(Object.keys(general_ed).map(k => [k, false])));
			setFilters({});
			setPageFilters([limit(25)]);
			setNum(1);
          }}
          className="btn btn-reset"
        >
          Reset
        </button>
        <button 
          type="submit"
          className="btn btn-search"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchForm;