import React, { useState } from 'react';

function CourseInstanceForm({ onInstanceCreated, year, semester, setYear, setSemester }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newInstance = {
      id: Date.now(), // Unique ID for this instance (you can change this logic)
      course: { title }, // Assuming 'course' holds the title
      year,
      semester,
      code,
    };

    // API call to create the new course instance
    fetch('http://127.0.0.1:8000/api/instances/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInstance),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create course instance');
        }
        return response.json();
      })
      .then((data) => {
        // Call the parent function to update the list
        onInstanceCreated(data);
        // Clear form
        setTitle('');
        setCode('');
        setYear('');
        setSemester('');
      })
      .catch((error) => {
        console.error('Error creating course instance:', error);
        alert('Failed to create course instance.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Code:</label>
        <input value={code} onChange={(e) => setCode(e.target.value)} required />
      </div>
      <div>
        <label>Year:</label>
        <input value={year} onChange={(e) => setYear(e.target.value)} required />
      </div>
      <div>
        <label>Semester:</label>
        <input value={semester} onChange={(e) => setSemester(e.target.value)} required />
      </div>
      <button type="submit">Create Course Instance</button>
    </form>
  );
}

export default CourseInstanceForm;
