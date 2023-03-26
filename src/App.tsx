import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import _ from 'lodash'
import { calculateTotalHoursPerWeek } from './services/getTogglReport'

function App() {
  const [data, setData] = useState<any[]>([]);
  const startDate = '2023-03-01';
  const endDate = '2023-03-31';

  useEffect(() => {
    calculateTotalHoursPerWeek(startDate, endDate).then(res => setData(res));
    return () => { }
  }, [])

  const calculateTotalOvertime = () => {
    const overtimeHours = data.reduce((totalOvertime, data) => {
      const overtime = data.hours - 40;
      return totalOvertime + overtime;
    }, 0);

    return overtimeHours.toFixed(2);
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Toggl Overtime Calculator</h1>
      <div className="card">
        {data?.map(week =>
          <p key={week.weekNumber}>{`Week ${week.weekNumber}: ${(week.hours - 40).toFixed(2)} hours of overtime`}</p>
        )}
        <p>Total overtime this month: {calculateTotalOvertime()}</p>
      </div>
    </div>
  )
}

export default App
