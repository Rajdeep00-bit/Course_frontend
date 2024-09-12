import React, { useState } from 'react';

function CourseInstanceForm({ year, semester, setYear, setSemester, fetchInstances }) {
  const [courseId, setCourseId] = useState('');
  
  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure the year, semester, and course ID are provided
    if (!courseId || !year || !semester) {
      console.error('All fields must be filled');
      return;
    }

    // Create a new course instance
    fetch('http://127.0.0.1:8000/api/instances/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course: courseId,
        year: year,
        semester: semester,
      }),
    })
    .then(response => {
      if (response.ok) {
        console.log('Course instance created successfully');
        fetchInstances();  // Call fetchInstances to refresh the list
      } else {
        console.error('Failed to create course instance:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('Error creating course instance:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Course ID" 
        value={courseId} 
        onChange={(e) => setCourseId(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Year" 
        value={year} 
        onChange={(e) => setYear(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Semester" 
        value={semester} 
        onChange={(e) => setSemester(e.target.value)} 
      />
      <button type="submit">Create Instance</button>
    </form>
  );
}

export default CourseInstanceForm;
