//dependencies
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
//imports
import { Task } from "../../types/table";
import DatePicker from "react-datepicker";
//hooks
import useOutsideClick from '../../hooks/useOutsideClick';

interface FilterDropdownProps {
    onFilter: (column: keyof Task, value: unknown) => void;
  }

const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<keyof Task | null>(null);
    const [filterValues, setFilterValues] = useState<Record<keyof Task, unknown>>({
      taskName: "",
      dueDate: { startDate: null, endDate: null },
      priority: [],
      status: [],
      taskType: []
    });
  
    const toggleDropdown = () => setIsOpen(!isOpen);
  
    const handleFilterChange = (column: keyof Task, value: unknown) => {
      const newFilterValues = { ...filterValues, [column]: value };
      setFilterValues(newFilterValues);
      if (selectedColumn) {
        onFilter(selectedColumn, newFilterValues[selectedColumn]);
      }
    };
    const dropdownRef = useOutsideClick(() => {
      setIsOpen(false);
    });
  
    const renderFilterOptions = () => {
      switch (selectedColumn) {
        case "taskName":
          return (
            <input
              type="text"
              value={filterValues.taskName as string}
              onChange={(e) => handleFilterChange("taskName", e.target.value)}
              placeholder="Search task name"
              className="w-full p-2 border rounded"
            />
          );
        case "dueDate":
          return (
            <div>
              <DatePicker
                selected={(filterValues.dueDate as { startDate: Date | null, endDate: Date | null })?.startDate || undefined}
                onChange={(dates: [Date | null, Date | null]) => {
                  const [start, end] = dates;
                  handleFilterChange("dueDate", { 
                    startDate: start ? new Date(start.setHours(0, 0, 0, 0)) : null, 
                    endDate: end ? new Date(end.setHours(23, 59, 59, 999)) : null 
                  });
                }}
                startDate={(filterValues.dueDate as { startDate: Date | null, endDate: Date | null })?.startDate || undefined}
                endDate={(filterValues.dueDate as { startDate: Date | null, endDate: Date | null })?.endDate || undefined}
                selectsRange
                className="w-full p-2 border rounded mb-2"
                placeholderText="Select date range"
                dateFormat="dd/MM/yyyy"
              />
              {(filterValues.dueDate as { startDate: Date | null, endDate: Date | null })?.startDate && 
           (filterValues.dueDate as { startDate: Date | null, endDate: Date | null })?.endDate && (
                <div className="text-xs text-gray-600">
                  Selected range: {((filterValues.dueDate as { startDate: Date, endDate: Date }).startDate).toLocaleDateString()} - 
                  {((filterValues.dueDate as { startDate: Date, endDate: Date }).endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        case "priority":
          return (
            <div>
              {["Low", "Medium", "High"].map(priority => (
                <label key={priority} className="block">
                  <input
                    type="checkbox"
                    checked={(filterValues.priority as string[]).includes(priority)}
                    onChange={(e) => {
                      const newPriorities = e.target.checked
                        ? [...(filterValues.priority as string[]), priority]
                        : (filterValues.priority as string[]).filter(p => p !== priority);
                      handleFilterChange("priority", newPriorities);
                    }}
                  /> {priority}
                </label>
              ))}
            </div>
          );
        case "status":
          return (
            <div>
              {["Not started", "In progress", "Done"].map(status => (
                <label key={status} className="block">
                  <input
                    type="checkbox"
                    checked={(filterValues.status as string[]).includes(status)}
                    onChange={(e) => {
                      const newStatuses = e.target.checked
                        ? [...(filterValues.status as string[]), status]
                        : (filterValues.status as string[]).filter((s:string) => s !== status);
                      handleFilterChange("status", newStatuses);
                    }}
                  /> {status}
                </label>
              ))}
            </div>
          );
        case "taskType":
          return (
            <div>
              {["Improvement", "Bug", "New Feature"].map(type => (
                <label key={type} className="block">
                  <input
                    type="checkbox"
                    checked={(filterValues.taskType as string[]).includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...(filterValues.taskType as string[]), type]
                        : (filterValues.taskType as string[]).filter((t: string) => t !== type);
                      handleFilterChange("taskType", newTypes);
                    }}
                  /> {type}
                </label>
              ))}
            </div>
          );
        default:
          return null;
      }
    };  

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Filter by Column
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
            <select
              value={selectedColumn || ""}
              onChange={(e) => {
                const newColumn = e.target.value as keyof Task;
                setSelectedColumn(newColumn);
                if (newColumn) {
                  onFilter(newColumn, filterValues[newColumn]);
                }
              }}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="">Select Column</option>
              <option value="taskName">Task Name</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="taskType">Task Type</option>
            </select>
            {selectedColumn && renderFilterOptions()}
          </div>
        )}
      </div>
    );
  };

  export default FilterDropdown;