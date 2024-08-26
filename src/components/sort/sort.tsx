//dependencies
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
//imports
import { Task } from "../../types/table";
//hooks
import useOutsideClick from '../../hooks/useOutsideClick';

interface SortDropdownProps {
  onSort: (column: keyof Task, direction: "asc" | "desc") => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSort }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<keyof Task>("taskName");
    const [selectedDirection, setSelectedDirection] = useState<"asc" | "desc">("asc");
  
    const toggleDropdown = () => setIsOpen(!isOpen);
  
    const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newColumn = e.target.value as keyof Task;
      setSelectedColumn(newColumn);
      onSort(newColumn, selectedDirection);
    };
  
    const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newDirection = e.target.value as "asc" | "desc";
      setSelectedDirection(newDirection);
      onSort(selectedColumn, newDirection);
    };
  
    const dropdownRef = useOutsideClick(() => {
      setIsOpen(false);
    });
  
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sort by Column
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
            <select
              value={selectedColumn}
              onChange={handleColumnChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="taskName">Task Name</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="taskType">Task Type</option>
              </select>
            <select
              value={selectedDirection}
              onChange={handleDirectionChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        )}
      </div>
    );
  };
  
  export default SortDropdown