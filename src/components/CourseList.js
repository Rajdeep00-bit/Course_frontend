import React from 'react';

function CourseList({ courses, fetchCourses }) {

  const viewCourseDetails = (id) => {
    fetch(`http://127.0.0.1:8000/api/courses/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Course details:', data);
      })
      .catch((error) => {
        console.error('Error fetching course details:', error);
      });
  };

  const deleteCourse = (id) => {
    fetch(`http://127.0.0.1:8000/api/courses/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetchCourses())  // Refresh the course list after deletion
      .catch((error) => {
        console.error('Error deleting course:', error);
      });
  };

  return (
    <ul>
      {courses.map(course => (
        <li key={course.id}>
          {course.title} ({course.course_code})
          <button onClick={() => viewCourseDetails(course.id)}>View Details</button>
          <button onClick={() => deleteCourse(course.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default CourseList;
