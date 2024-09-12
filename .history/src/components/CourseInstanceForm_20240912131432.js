import React, { useState, useEffect } from 'react';

function CourseInstanceForm({
  onInstanceCreated,
  year,
  semester,
  setYear,
  setSemester,
  courses: propCourses, // Courses passed as props
}) {
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState(propCourses || []); // Use passed courses or fetch them

  // Fetch courses if not passed as props
  useEffect(() => {
    if (!propCourses) {
      fetch('http://127.0.0.1:8000/api/courses/')
        .then((response) => response.json())
        .then((data) => setCourses(data))
        .catch((error) => console.error('Error fetching courses:', error));
    }
  }, [propCourses]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const courseInstance = {
      course: courseId,
      year: year,
      semester: semester,
    };

    // Send POST request to create a new course instance
    fetch('http://127.0.0.1:8000/api/instances/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseInstance),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create course instance');
        }
        return response.json();
      })
      .then((newInstance) => {
        // Clear the form fields
        setCourseId('');
        setYear('');
        setSemester('');
        
        // Call the callback to update the parent component
        onInstanceCreated(newInstance);
      })
      .catch((error) => console.error('Error creating course instance:', error));
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
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

      <div>
        <label>Course:</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Create Course Instance</button>
    </form>
  );
}

export default CourseInstanceForm;
