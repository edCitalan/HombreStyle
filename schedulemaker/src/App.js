import { useState,useEffect } from 'react';
import './App.css';
import ShiftTable from './ShiftTable';
import AllWork from './AllWork'
import { employees } from "./data"

function App() {
  const [offTimesData, setOffTimesData] = useState(employees)
  const [schedule, setSchedule] = useState(null)

  const handleChangeShift = (e, day, shift) => {
    setSchedule(pre => ({ ...pre, [day]: { ...pre[day], [shift]: e.target.value } }))
  }

const handleClick = (id) =>{
const newOffTimesdata = offTimesData.map(e => {
  if(Number(id) === e.id){
    e.off = !e.off
  }
  return e
})
    setOffTimesData(newOffTimesdata)
}
  const handleChange = (employeeId, day, i) => {
    i = i[0]
    const updatedData = offTimesData.map(employee => {
      if (employee.id === employeeId) {
        const updatedAvailability = employee.availability.map(availDay => {
          if (availDay.day === day) {
            const a = availDay.times.map(o => {
              if (Object.keys(o)[0] === i) {
                o[i] = !o[i]
                return o
              }
              return o
            })
            return {
              ...availDay,
              times: a,
            };
          }
          return availDay;
        });
        return {
          ...employee,
          availability: updatedAvailability,
        };
      }
      return employee;
    });
    setOffTimesData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateSchedule(offTimesData)
  };

  function isEmployeeAvailable(employee, day, shift) {
    const availabilityForDay = employee.availability.find(a => a.day === day);
    if (!availabilityForDay) return false;

    const timeSlot = availabilityForDay.times.find(t => t[shift]);
    return !!timeSlot;
  }

  function generateSchedule(employees) {
    const schedule = {};
    const shifts = ["0600-1400", "1400-2200", "2200-0600"];

    for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]) {
      schedule[day] = {
        "0600-1400": '',
        "1400-2200": '',
        "2200-0600": ''
      };
    }

    const maxShiftsPerEmployee = 5;
    const minHoursBetweenShifts = 12;
    const employeesShiftCount = {};
    const employeesLastShift = {};

    for (const shift of shifts) {
      for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]) {
        const availableEmployees = employees.filter(employee =>
          !employee.off &&
          isEmployeeAvailable(employee, day, shift) &&
          (!schedule[day][shift] || schedule[day][shift] !== employee.name) &&
          (!schedule[day][shifts[(shifts.indexOf(shift) + 1) % 3]] || schedule[day][shifts[(shifts.indexOf(shift) + 1) % 3]] !== employee.name) &&
          (!schedule[day][shifts[(shifts.indexOf(shift) + 2) % 3]] || schedule[day][shifts[(shifts.indexOf(shift) + 2) % 3]] !== employee.name) &&
          (employeesShiftCount[employee.name] || 0) < maxShiftsPerEmployee &&
          (!employeesLastShift[employee.name] || employeesLastShift[employee.name] + minHoursBetweenShifts <= shifts[shift])
        );

        if (availableEmployees.length > 0) {
          const randomEmployee = availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
          schedule[day][shift] = randomEmployee.name;
          employeesShiftCount[randomEmployee.name] = (employeesShiftCount[randomEmployee.name] || 0) + 1;
          employeesLastShift[randomEmployee.name] = shifts[shift];
        }
      }
    }

    setSchedule(schedule)
  }


  
  return (
    <div className="App">
      <AllWork employees={offTimesData} handleClick={handleClick}/>
      <form onSubmit={handleSubmit}>
        {offTimesData.filter(employee => !employee.off).map(employee => (
          <div key={employee.id} className="employee">
            <h2 className="employee-name">{employee.name}</h2>
            {employee.availability.map(day => (
              <div key={day.day} className="availability">
                <h3 className="day-name">{day.day}</h3>
                <div className="time-list">
                  {day.times.map((timeObj, i) => (
                    <label key={i} className="time-label">
                      <input
                        type="checkbox"
                        checked={Object.values(timeObj)[0]}
                        onChange={() => handleChange(employee.id, day.day, Object.keys(day.times[i]))}
                      />
                      {Object.keys(timeObj)[0]}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="submit-button">Ready</button>
      </form>
      {schedule && <ShiftTable schedule={schedule} handleChangeShift={handleChangeShift} />}
    </div>
  );
}

export default App;