import React, { useEffect, useState } from 'react';

function CourseInstanceForm({
  onInstanceCreated,
  year,
  semester,
  setYear,
  setSemester,
  courses: propCourses,
}) {
  const [courseId, setCourseId] = useState(''); // Local state for selected course
  const [courses, setCourses] = useState(propCourses || []); // Use passed courses or fetch them if needed

  // Fetch courses if they are not passed as props
  useEffect(() => {
    if (!propCourses || propCourses.length === 0) {
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
        setYear(''); // This will call setYear from parent
        setSemester(''); // This will call setSemester from parent

        // Notify the parent component that a new instance has been created
        onInstanceCreated(newInstance); // Pass the new instance to the parent
      })
      .catch((error) => {
        console.error('Error creating course instance:', error);
        alert('Failed to create course instance.');
      });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label>Year:</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)} // Correct usage of setYear
          required
        />
      </div>

      <div>
        <label>Semester:</label>
        <input
          type="text"
          value={semester}
          onChange={(e) => setSemester(e.target.value)} // Correct usage of setSemester
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
