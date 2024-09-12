import React, { useState, useEffect } from 'react';

function CourseInstanceForm({ onInstanceCreated, year, semester, setYear, setSemester, fetchNewCourse, setFetchNewCourse }) {
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);

  // Fetch courses
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/courses/')
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));
  }, [fetchNewCourse]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const courseInstance = {
      course: courseId,
      year: year,
      semester: semester
    };

    fetch('http://127.0.0.1:8000/api/instances/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(courseInstance)
    })
      .then(response => response.json())
      .then((newInstance) => {
        // Clear the form fields
        setCourseId('');
        setYear('');
        setSemester('');
        
        // Call the callback to update the parent component
        onInstanceCreated(newInstance);  // Pass the created instance to the parent
      })
      .catch(error => console.error('Error creating course instance:', error));
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Year:</label>
      <input
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />

      <label>Semester:</label>
      <input
        type="text"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        required
      />

      <label>Course:</label>
      <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>{course.title}</option>
        ))}
      </select>

      <button type="submit">Create Course Instance</button>
    </form>
  );
}

export default CourseInstanceForm;
