import React, { useState } from 'react';

function CourseForm({ onCourseCreated, setFetchNewCourse }) {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const course = {
      title: title,
      course_code: courseCode,
      description: description
    };

    fetch('http://127.0.0.1:8000/api/courses/', {  // Added trailing slash
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(course)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error creating course');
        }
        return response.json();
      })
      .then(data => {
        setTitle('');
        setCourseCode('');
        setDescription('');
        setFetchNewCourse(true);
        onCourseCreated(); // Call this to refresh the course list in the parent component
      })
      .catch((error) => {
        console.error('Error creating course:', error);
      });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Course Code:</label>
      <input
        type="text"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        required
      />

      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <button type="submit">Create Course</button>
    </form>
  );
}

export default CourseForm;
