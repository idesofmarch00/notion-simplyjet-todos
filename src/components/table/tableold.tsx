import React, { useState } from "react";

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
    <div>
      {/* buttons and dropdown*/}
      <div style={{ marginBottom: "10px" }} className="">
        <button onClick={() => handleSortDropdownToggle()}>
          Sort by Column
        </button>
        <button onClick={() => handleFilterDropdownToggle()}>
          Filter by Column
        </button>


        {/* Implement dropdowns here */}
        <SortDropdown onSort={handleSort} />
        <FilterDropdown onFilter={handleFilter} />
      </div>

      {/* table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Task Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Due Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Priority</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Task Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task: Task, index: number) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{task.taskName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{task.dueDate}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{task.priority}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{task.status}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{task.taskType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


interface SortDropdownProps {
  onSort: (column: keyof Task, direction: "asc" | "desc") => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSort }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSort = (column: keyof Task, direction: "asc" | "desc") => {
    onSort(column, direction);
    toggleDropdown();
  };

  return (
    <div>
      <button onClick={toggleDropdown}>Sort</button>
      {isOpen && (
        <div>
          <button onClick={() => handleSort("taskName", "asc")}>Task Name Asc</button>
          <button onClick={() => handleSort("taskName", "desc")}>Task Name Desc</button>
          <button onClick={() => handleSort("dueDate", "asc")}>Due Date Asc</button>
          <button onClick={() => handleSort("dueDate", "desc")}>Due Date Desc</button>
          <button onClick={() => handleSort("priority", "asc")}>Priority Asc</button>
          <button onClick={() => handleSort("priority", "desc")}>Priority Desc</button>
          <button onClick={() => handleSort("status", "asc")}>Status Asc</button>
          <button onClick={() => handleSort("status", "desc")}>Status Desc</button>
          <button onClick={() => handleSort("taskType", "asc")}>Task Type Asc</button>
          <button onClick={() => handleSort("taskType", "desc")}>Task Type Desc</button>
        </div>
      )}
    </div>
  );
};

interface FilterDropdownProps {
  onFilter: (column: keyof Task, value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleFilter = (column: keyof Task) => {
    onFilter(column, filterValue);
    toggleDropdown();
  };

  return (
    <div>
      <button onClick={toggleDropdown}>Filter</button>
      {isOpen && (
        <div>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Filter value"
          />
          <button onClick={() => handleFilter("taskName")}>Task Name</button>
          <button onClick={() => handleFilter("dueDate")}>Due Date</button>
          <button onClick={() => handleFilter("priority")}>Priority</button>
          <button onClick={() => handleFilter("status")}>Status</button>
          <button onClick={() => handleFilter("taskType")}>Task Type</button>
        </div>
      )}
    </div>
  );
};

export default TaskTable;