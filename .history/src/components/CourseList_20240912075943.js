import React, { useEffect, useState } from 'react';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  // Fetch course details from API
  const viewCourseDetails = (id) => {
    fetch(`http://127.0.0.1:8000/api/courses/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setSelectedCourse(data);  // Store the selected course details in state
      })
      .catch((error) => {
        console.error('Error fetching course details:', error);
        alert(`Failed to fetch course details: ${error.message}`);
      });
  };

  // Close the course details view
  const closeCourseDetails = () => {
    setSelectedCourse(null);  // Clear the selected course to hide details
  };

  // Example for deleting a course
  const deleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/courses/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          fetchCourses();  // Re-fetch the courses list after deletion
          alert("Course deleted successfully.");
        } else {
          return response.json().then((err) => Promise.reject(err));
        }
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
        alert("Failed to delete the course.");
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
              {/* Hyperlink-like title that fetches and shows course details */}
              <a
                href="#"
                onClick={() => viewCourseDetails(course.id)}
                style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
              >
                {course.title} ({course.course_code})
              </a>
              <button onClick={() => deleteCourse(course.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available</p>
      )}

      {/* Conditionally render the selected course details */}
      {selectedCourse && (
        <div style={styles.courseDetails}>
          <h3>Course Details</h3>
          <p><strong>Title:</strong> {selectedCourse.title}</p>
          <p><strong>Code:</strong> {selectedCourse.course_code}</p>
          <p><strong>Description:</strong> {selectedCourse.description}</p>
          <button onClick={closeCourseDetails} style={styles.closeButton}>Close</button>
        </div>
      )}
    </div>
  );
}

// Inline CSS styles for the course details box and close button
const styles = {
  courseDetails: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default CourseList;
