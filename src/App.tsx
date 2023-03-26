import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import _ from 'lodash'
import { calculateTotalHoursPerWeek } from './services/getTogglReport'
import moment from 'moment'

function App() {
  const [data, setData] = useState<any[]>([]);
  const startDate = moment().startOf('month');
  const endDate = moment().endOf('month');

  useEffect(() => {
    calculateTotalHoursPerWeek(startDate.toISOString(), endDate.toISOString()).then(res => setData(res));
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
      </div>
      <h1>Toggl Overtime Calculator</h1>
      <p>For {endDate.format('MMMM')}</p>
      <div className="card">
        {data?.map(week =>
          <p key={week.weekNumber}>{`Week ${week.weekNumber}: ${(week.hours - 40).toFixed(2)} h of overtime`}</p>
        )}
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>Total overtime this month: {calculateTotalOvertime()}</p>
      </div>
    </div>
  )
}

export default App
