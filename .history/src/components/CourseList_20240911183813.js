import React from 'react';

function CourseList({ courses, fetchCourses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const viewCourseDetails = (id) => {
    fetch(`http://127.0.0.1:8000/api/courses/${id}/`)  // Add trailing slash if your backend requires it
      .then(response => {
        if (!response.ok) {
          throw new Error(`Course not found: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Course details:', data);
      })
      .catch((error) => {
        console.error('Error fetching course details:', error);
        alert('Failed to fetch course details. Make sure the course exists.');
      });
  };
  

  const deleteCourse = (id) => {
    fetch(`http://127.0.0.1:8000/api/courses/${id}/`, {  // Make sure the trailing slash is added
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          fetchCourses();  // Refresh the course list after deletion
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      })
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
