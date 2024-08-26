import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Task } from "../../types/table";
import tasks from "../../data/tasks"
import  useOutsideClick  from '../../hooks/useOutsideClick';

const TaskTable: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterColumn, setFilterColumn] = useState<keyof Task | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");

  const handleSort = (column: keyof Task, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleFilter = (column: keyof Task, value: string) => {
    setFilterColumn(column);
    setFilterValue(value);
  };

 const sortedTasks = [...tasks].sort((a, b) => {
  if (sortColumn) {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (sortColumn === 'priority') {
      const priorityOrder = { 'Low': 0, 'Medium': 1, 'High': 2 };
      return sortDirection === 'asc'
        ? priorityOrder[aValue as keyof typeof priorityOrder] - priorityOrder[bValue as keyof typeof priorityOrder]
        : priorityOrder[bValue as keyof typeof priorityOrder] - priorityOrder[aValue as keyof typeof priorityOrder];
    }

    if (sortColumn === 'status') {
      const statusOrder = { 'Not started': 0, 'In progress': 1, 'Done': 2 };
      return sortDirection === 'asc'
        ? statusOrder[aValue as keyof typeof statusOrder] - statusOrder[bValue as keyof typeof statusOrder]
        : statusOrder[bValue as keyof typeof statusOrder] - statusOrder[aValue as keyof typeof statusOrder];
    }

    if (sortColumn === 'taskType') {
      const taskTypeOrder = { 'Improvement': 0, 'Bug': 1, 'New Feature': 2 };
      return sortDirection === 'asc'
        ? taskTypeOrder[aValue as keyof typeof taskTypeOrder] - taskTypeOrder[bValue as keyof typeof taskTypeOrder]
        : taskTypeOrder[bValue as keyof typeof taskTypeOrder] - taskTypeOrder[aValue as keyof typeof taskTypeOrder];
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
  }
  return 0;
});

const filteredTasks = sortedTasks.filter((task) => {
  if (filterColumn && filterValue !== null && filterValue !== undefined) {
    const taskValue = task[filterColumn];
    if (typeof filterValue === 'string') {
      return taskValue.toString().toLowerCase().includes(filterValue.toLowerCase());
    } else if (Array.isArray(filterValue)) {
      return filterValue.includes(taskValue);
    } else if (typeof filterValue === 'object' && filterValue.startDate && filterValue.endDate) {
      const taskDate = new Date(task.dueDate.split('/').reverse().join('-'));
      return taskDate >= filterValue.startDate && taskDate <= filterValue.endDate;
    }
  }
  return true;
});

const renderSortInfo = () => {
  if (sortColumn) {
    return (
      <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">
        Sort: {sortColumn} ({sortDirection})
      </button>
    );
  }
  return null;
};

const renderFilterInfo = () => {
  if (filterColumn) {
    let filterText = '';
    if (typeof filterValue === 'string') {
      filterText = filterValue;
    } else if (Array.isArray(filterValue)) {
      filterText = filterValue.join(', ');
    } else if (typeof filterValue === 'object' && filterValue.startDate && filterValue.endDate) {
      filterText = `${filterValue.startDate.toLocaleDateString()} - ${filterValue.endDate.toLocaleDateString()}`;
    }
    return (
      <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
        Filter: {filterColumn} ({filterText})
      </button>
    );
  }
  return null;
};


const resetFiltersAndSort = () => {
  setSortColumn(null);
  setSortDirection("asc");
  setFilterColumn(null);
  setFilterValue("");
};

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
    
        <SortDropdown onSort={handleSort} />
        {renderSortInfo()}
        {renderFilterInfo()}
        <FilterDropdown onFilter={handleFilter} />
        <button
          onClick={resetFiltersAndSort}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset All
        </button>
      </div>

      {filteredTasks.length > 0 ? (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Task Name</th>
            <th className="border border-gray-300 p-2">Due Date</th>
            <th className="border border-gray-300 p-2">Priority</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Task Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task: Task, index: number) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="border border-gray-300 p-2">{task.taskName}</td>
              <td className="border border-gray-300 p-2">{task.dueDate}</td>
              <td className="border border-gray-300 p-2">{task.priority}</td>
              <td className="border border-gray-300 p-2">{task.status}</td>
              <td className="border border-gray-300 p-2">{task.taskType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="text-center py-4 text-gray-600">No results found</div>
    )}
    </div>
  );
};

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


const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<keyof Task | null>(null);
  const [filterValues, setFilterValues] = useState<Record<keyof Task, any>>({
    taskName: "",
    dueDate: { startDate: null, endDate: null },
    priority: [],
    status: [],
    taskType: []
  });

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleFilterChange = (column: keyof Task, value: any) => {
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
            value={filterValues.taskName}
            onChange={(e) => handleFilterChange("taskName", e.target.value)}
            placeholder="Search task name"
            className="w-full p-2 border rounded"
          />
        );
        case "dueDate":
          return (
            <div>
              <DatePicker
                selected={filterValues.dueDate?.startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  handleFilterChange("dueDate", { 
                    startDate: start ? new Date(start.setHours(0, 0, 0, 0)) : null, 
                    endDate: end ? new Date(end.setHours(23, 59, 59, 999)) : null 
                  });
                }}
                startDate={filterValues.dueDate?.startDate}
                endDate={filterValues.dueDate?.endDate}
                selectsRange
                className="w-full p-2 border rounded mb-2"
                placeholderText="Select date range"
                dateFormat="dd/MM/yyyy"
              />
              {filterValues.dueDate?.startDate && filterValues.dueDate?.endDate && (
                <div className="text-sm text-gray-600">
                  Selected range: {filterValues.dueDate.startDate.toLocaleDateString()} - {filterValues.dueDate.endDate.toLocaleDateString()}
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
                  checked={filterValues.priority.includes(priority)}
                  onChange={(e) => {
                    const newPriorities = e.target.checked
                      ? [...filterValues.priority, priority]
                      : filterValues.priority.filter(p => p !== priority);
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
                  checked={filterValues.status.includes(status)}
                  onChange={(e) => {
                    const newStatuses = e.target.checked
                      ? [...filterValues.status, status]
                      : filterValues.status.filter(s => s !== status);
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
                  checked={filterValues.taskType.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filterValues.taskType, type]
                      : filterValues.taskType.filter(t => t !== type);
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


export default TaskTable;