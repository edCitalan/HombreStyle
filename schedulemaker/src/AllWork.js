import React from 'react';
import './App.css'; 

const AllWork = ({ employees, handleClick }) => {
  return (
    <div className="all-work-container">
      <h4>Current Employees</h4>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            <span>{employee.name}</span>
            <span>
              <button
                onClick={() => handleClick(employee.id)}
                className={employee.off ? 'off' : 'on'}
              >
                {employee.off ? 'Off' : 'On'}
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllWork;