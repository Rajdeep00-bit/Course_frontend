import React, { useState } from 'react';

function CourseForm({ onCourseCreated }) {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const course = {
      title: title,
      course_code: courseCode,
      description: description,
    };

    fetch('http://127.0.0.1:8000/api/courses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    })
      .then((response) => response.json())
      .then((data) => {
        // Clear form fields
        setTitle('');
        setCourseCode('');
        setDescription('');

        // Trigger the callback to refresh the course list
        if (onCourseCreated) {
          onCourseCreated();
        }
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
