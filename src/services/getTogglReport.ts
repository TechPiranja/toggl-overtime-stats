import moment from 'moment';
import _ from 'lodash';

const fetchTimeEntries = async (startDate: string, endDate: string) => {
    const apiKey = import.meta.env.VITE_TOGGL_API_KEY;
    const url = `https://api.track.toggl.com/api/v9/me/time_entries?start_date=${startDate}&end_date=${endDate}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(apiKey + ':api_token')
        }
    });

    const data = await response.json();
    return data;
};

export const calculateTotalHoursPerWeek = async (startDate: string, endDate: string) => {
    const timeEntries = await fetchTimeEntries(startDate, endDate);
    const hoursByDate = Object.entries(_.groupBy(timeEntries, (entry) => entry.start.substr(0, 10)))
        .map(([date, entries]) => ({
            date,
            hours: entries.reduce((total, entry) => {
                const startTime = new Date(entry.start);
                const endTime = new Date(entry.stop);
                const duration = endTime.getTime() - startTime.getTime();
                return total + duration;
            }, 0) / (1000 * 60 * 60),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const hoursByWeekArray: { weekNumber: number; hours: number }[] = [];
    const daysMissingInFirstWeek = moment(startDate).startOf('month').day() - 1;
    let previousWeekHours = daysMissingInFirstWeek * 8;

    hoursByDate.forEach((entry) => {
        const weekNumber = moment(entry.date).week();
        const existingEntry = hoursByWeekArray.find(entry => entry.weekNumber === weekNumber);

        if (existingEntry) {
            existingEntry.hours += entry.hours;
        } else {
            hoursByWeekArray.push({
                weekNumber: weekNumber,
                hours: previousWeekHours + entry.hours
            });
            previousWeekHours = 0;
        }
    });

    return hoursByWeekArray;
}