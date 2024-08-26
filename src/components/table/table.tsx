import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Task {
  taskName: string;
  dueDate: string;
  priority: string;
  status: string;
  taskType: string;
}

const TaskTable: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterColumn, setFilterColumn] = useState<keyof Task | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");

  const tasks: Task[] = [
    {
      taskName: "Montoya Custom Cursor",
      dueDate: "15/08/2024",
      priority: "High",
      status: "Done",
      taskType: "New Feature"
    },
    {
      taskName: "Montoya Navigation Menu",
      dueDate: "22/08/2024",
      priority: "High",
      status: "In progress",
      taskType: "New Feature"
    },
    {
      taskName: "Montoya Header",
      dueDate: "23/08/2024",
      priority: "High",
      status: "Done",
      taskType: "New Feature"
    },
    {
      taskName: "Montoya Delayed Scroll",
      dueDate: "24/08/2024",
      priority: "Medium",
      status: "In progress",
      taskType: "Bug"
    },
    {
      taskName: "Filtering and Sorting on Users Dashboard",
      dueDate: "30/08/2024",
      priority: "Low",
      status: "Not started",
      taskType: "Improvement"
    }
  ];

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
    if (filterColumn && filterValue) {
      return task[filterColumn].toLowerCase().includes(filterValue.toLowerCase());
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <SortDropdown onSort={handleSort} />
        <FilterDropdown onFilter={handleFilter} />
      </div>

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
    </div>
  );
};

const SortDropdown: React.FC<SortDropdownProps> = ({ onSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<keyof Task>("taskName");
  const [selectedDirection, setSelectedDirection] = useState<"asc" | "desc">("asc");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSort = () => {
    onSort(selectedColumn, selectedDirection);
    toggleDropdown();
  };

  return (
    <div className="relative">
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
            onChange={(e) => setSelectedColumn(e.target.value as keyof Task)}
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
            onChange={(e) => setSelectedDirection(e.target.value as "asc" | "desc")}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button
            onClick={handleSort}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Apply Sort
          </button>
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
    dueDate: null,
    priority: [],
    status: [],
    taskType: []
  });

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleColumnSelect = (column: keyof Task) => {
    setSelectedColumn(column);
  };

  const handleFilterChange = (column: keyof Task, value: any) => {
    setFilterValues(prev => ({ ...prev, [column]: value }));
  };

  const applyFilter = () => {
    if (selectedColumn) {
      onFilter(selectedColumn, filterValues[selectedColumn]);
      toggleDropdown();
    }
  };

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
          <DatePicker
            selected={filterValues.dueDate}
            onChange={(date) => handleFilterChange("dueDate", date)}
            className="w-full p-2 border rounded"
            placeholderText="Select due date"
          />
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
    <div className="relative">
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
            onChange={(e) => handleColumnSelect(e.target.value as keyof Task)}
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
          <button
            onClick={applyFilter}
            className="w-full mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Apply Filter
          </button>
        </div>
      )}
    </div>
  );
};


export default TaskTable;