// CourseForm.js

import React, { useState } from 'react';

function CourseForm({ onCourseCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Assuming the API accepts a POST request to create a new course
    fetch('http://127.0.0.1:8000/api/courses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error creating course');
        }
        return response.json();
      })
      .then((data) => {
        // Notify the parent component that a new course was created
        onCourseCreated();
        
        // Reset form fields
        setName('');
        setDescription('');
      })
      .catch((error) => {
        console.error('Error creating course:', error);
        alert('Failed to create course. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Course Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Course Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Course</button>
    </form>
  );
}

export default CourseForm;
