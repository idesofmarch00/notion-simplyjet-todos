//dependencies
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
//data
import tasks from "../../data/tasks"
//types
import { Task } from "../../types/table";
//imports
import SortDropdown from "../sort";
import FilterDropdown from "../filter";

const TaskTable: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterColumn, setFilterColumn] = useState<keyof Task | null>(null);

  const [filterValue, setFilterValue] = useState<unknown>("");

  const handleSort = (column: keyof Task, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };


  const handleFilter = (column: keyof Task, value: unknown) => {
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
      return String(taskValue).toLowerCase().includes(filterValue.toLowerCase());
    } else if (Array.isArray(filterValue)) {
      return filterValue.includes(taskValue);
    } else if (typeof filterValue === 'object' && 'startDate' in filterValue && 'endDate' in filterValue) {
      const taskDate = new Date(String(task.dueDate).split('/').reverse().join('-'));
      const startDate = filterValue.startDate instanceof Date ? filterValue.startDate : new Date(String(filterValue.startDate));
      const endDate = filterValue.endDate instanceof Date ? filterValue.endDate : new Date(String(filterValue.endDate));
      return taskDate >= startDate && taskDate <= endDate;
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
  if (filterColumn && filterValue !== null) {
    let filterText = '';
    if (typeof filterValue === 'string') {
      filterText = filterValue;
    } else if (Array.isArray(filterValue)) {
      filterText = filterValue.join(', ');
    } else if (typeof filterValue === 'object' && 'startDate' in filterValue && 'endDate' in filterValue) {
      filterText = `${filterValue.startDate instanceof Date ? filterValue.startDate.toLocaleDateString() : ''} - ${filterValue.endDate instanceof Date ? filterValue.endDate.toLocaleDateString() : ''}`;
    }
    return (
      <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
        Filter: {filterColumn} ({filterText})
      </button>
    );
  }
  return null;
};const resetFiltersAndSort = () => {
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





export default TaskTable;