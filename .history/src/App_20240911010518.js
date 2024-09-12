import React, { useState, useEffect } from 'react';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';
  // Adjust import path accordingly

function App() {
  const [instances, setInstances] = useState([]);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  // Function to fetch course instances
  const fetchInstances = () => {
    if (!year || !semester) return;  // Prevent fetching if year or semester is not set
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
      .then(response => response.json())
      .then(data => setInstances(data))
      .catch((error) => {
        console.error('Error fetching instances:', error);
      });
  };

  // Call fetchInstances when the component mounts or when year/semester changes
  useEffect(() => {
    fetchInstances();
  }, [year, semester]);

  return (
    <div>
      <CourseInstanceForm 
        year={year} 
        semester={semester} 
        setYear={setYear} 
        setSemester={setSemester} 
        fetchInstances={fetchInstances}  // Pass fetchInstances as a prop
      />
      <CourseInstanceList 
        instances={instances} 
        setInstances={setInstances} 
        year={year} 
        semester={semester}
      />
    </div>
  );
}

export default App;
