import React from 'react';
import Papa from 'papaparse';

// Function to save the schedule to a CSV file
export default function saveScheduleToCSV(schedule) {
  const csvData = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Add headers for days
  const headers = ['Time', ...days];

  // Prepare data for CSV
  const times = ['0600-1400', '1400-2200', '2200-0600'];

  for (const time of times) {
    const rowData = [time];
    for (const day of days) {
      rowData.push(schedule[day][time] || '');
    }
    csvData.push(rowData);
  }

  // Create a CSV string
  const csvString = Papa.unparse({ fields: headers, data: csvData });

  // Create a Blob object from the CSV string
  const blob = new Blob([csvString], { type: 'text/csv' });

  // Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create a link to download the CSV file
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'schedule.csv');
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}