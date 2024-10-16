import React, { useState, useRef, useEffect } from "react";

function Dropdown({ options, onSelect, placeholder = "Select an option" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setSearchTerm("");
        setFilteredOptions(options);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        setSearchTerm("");
        if (onSelect) {
            onSelect(option);
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        console.log("Original search term:", value);

        const cleanedValue = value.replace(/\s/g, "").toLowerCase();
        console.log("Cleaned search term:", cleanedValue);

        setSearchTerm(value);

        const filtered = options.filter((option) => {
            const cleanedLabel = option.label.replace(/\s/g, "").toLowerCase();
            console.log("Comparing:", cleanedLabel, "with", cleanedValue);
            return cleanedLabel.includes(cleanedValue);
        });

        console.log("Filtered options:", filtered);

        setFilteredOptions(filtered);
    };
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className="dropdown-header" onClick={toggleDropdown}>
                {selectedOption ? selectedOption.label : placeholder}
                <i className={`arrow ${isOpen ? "up" : "down"}`}></i>
            </div>
            {isOpen && (
                <div className="dropdown-content">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        onClick={(e) => e.stopPropagation()}
                        ref={searchInputRef}
                        className="dropdown-search"
                    />
                    <ul className="dropdown-options">
                        {filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.label}
                            </li>
                        ))}
                        {filteredOptions.length === 0 && (
                            <li className="no-options">No options found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
