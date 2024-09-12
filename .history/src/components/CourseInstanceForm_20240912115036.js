import React, { useState } from 'react';

function CourseInstanceForm({ onInstanceCreated, year, semester, setYear, setSemester }) {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new course instance
    const newInstance = {
      id: Date.now(), // Temporary ID, in a real app this would come from the backend
      course: { title: courseTitle },
      year,
      semester,
      code: courseCode,
    };

    // Pass the new instance back to the parent
    onInstanceCreated(newInstance);

    // Clear form fields
    setCourseTitle('');
    setCourseCode('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Course Title:</label>
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
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
      <div>
        <label>Year:</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Semester:</label>
        <input
          type="text"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Course Instance</button>
    </form>
  );
}

export default CourseInstanceForm;
