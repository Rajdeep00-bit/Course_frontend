import React, { useEffect, useState } from 'react';

function CourseList() {
  const [courses, setCourses] = useState([]);

  // Fetch courses from API
  const fetchCourses = () => {
    fetch('http://127.0.0.1:8000/api/courses/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data);  // Store fetched courses in state
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert(`Failed to fetch courses: ${error.message}`);
      });
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Render the list of courses
  return (
    <div>
      <h2>Courses List</h2>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              {course.title} ({course.course_code})
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available</p>
      )}
    </div>
  );
}

export default CourseList;
