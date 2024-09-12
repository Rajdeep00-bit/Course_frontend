import React, { useState } from 'react';

function CourseForm({ onCourseCreated }) {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCourse = {
      title: title,
      course_code: courseCode,
    };

    // Send POST request to create a new course
    fetch('http://127.0.0.1:8000/api/courses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCourse),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create course');
        }
        return response.json();
      })
      .then(() => {
        setTitle(''); // Clear the form
        setCourseCode(''); // Clear the form

        // Notify the parent that a new course has been created
        onCourseCreated(); // Call the parent function to refetch courses
      })
      .catch((error) => {
        console.error('Error creating course:', error);
        alert('Failed to create course.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Course Code:</label>
        <input
          type="text"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
        />
      </div>

      <button type="submit">Create Course</button>
    </form>
  );
}

export default CourseForm;
