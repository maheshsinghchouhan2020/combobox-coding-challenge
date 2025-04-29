import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./Combobox.module.css";

interface ComboboxProps {
  options: string[];
  label: string;
}

const ComboBox: React.FC<ComboboxProps> = ({ options, label }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // filter options based on the input value
  useEffect(() => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(inputValue.trim() !== "" || filtered.length === 0);
    setActiveIndex(-1);
  }, [inputValue, options]);

  // closed the dropdown when click on the outside the input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeOption = listboxRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeOption) {
        activeOption.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex((prev) =>
          prev >= filteredOptions.length - 1 ? 0 : prev + 1
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex((prev) =>
          prev <= 0 ? filteredOptions.length - 1 : prev - 1
        );
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          setInputValue(filteredOptions[activeIndex]);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.combobox} ref={comboboxRef}>
      <label htmlFor="combobox-input">{label}</label>
      <div className={styles["combobox-wrapper"]}>
        <input
          id="combobox-input"
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="combobox-listbox"
          autoComplete="off"
          aria-activedescendant={
            activeIndex >= 0 ? `option-${activeIndex}` : undefined
          }
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(inputValue.trim() !== "")}
          onKeyDown={handleInputKeyDown}
          placeholder={`Select ${label}`}
          className={styles.input}
        />
        <button
          tabIndex={-1}
          aria-label={`${label} dropdown`}
          aria-expanded={isOpen}
          aria-controls="combobox-listbox"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
          className={styles.button}
        >
          <svg width="18" height="16" aria-hidden="true">
            <polygon points="3,6 15,6 9,14" fill="currentColor" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <ul
          id="combobox-listbox"
          ref={listboxRef}
          role="listbox"
          aria-label={label}
          className={styles["combobox-listbox"]}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option}
                id={`option-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                className={`${styles.option} ${
                  activeIndex === index ? styles.active : ""
                }`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {option}
              </li>
            ))
          ) : (
            <li role="option" className={styles["no-results"]}>
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ComboBox;
