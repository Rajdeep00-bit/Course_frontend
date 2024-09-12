import React, { useEffect, useState } from 'react';
import { BiAlignLeft } from 'react-icons/bi';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch courses from API
  const fetchCourses = () => {
    console.log('Fetching courses...');
    fetch('http://127.0.0.1:8000/api/courses/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Courses fetched:', data);
        setCourses(data);  // Store fetched courses in state
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert(`Failed to fetch courses: ${error.message}`);
      });
  };

  // Create a new course and refetch the list
  const createCourse = (newCourse) => {
    console.log('Creating new course:', newCourse);
    fetch('http://127.0.0.1:8000/api/courses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCourse),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((createdCourse) => {
        console.log('Course created:', createdCourse);
        // Refetch the updated course list to ensure consistency
        fetchCourses();  // Refetch courses after creation
      })
      .catch((error) => {
        console.error('Error creating course:', error);
        alert(`Failed to create course: ${error.message}`);
      });
  };

  // Fetch course details from API
  const viewCourseDetails = (id) => {
    console.log(`Fetching details for course ID: ${id}`);
    fetch(`http://127.0.0.1:8000/api/courses/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Course details fetched:', data);
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

  // Delete a course and refetch the list
  const deleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    console.log(`Deleting course ID: ${id}`);
    fetch(`http://127.0.0.1:8000/api/courses/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Course ID ${id} deleted successfully.`);
          // Refetch the updated course list to ensure consistency
          fetchCourses();  // Refetch courses after deletion
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
    console.log('Component mounted, fetching courses...');
    fetchCourses();  // Initial fetch on component mount
  }, []);

  // Render the list of courses
  return (
    <div>
      {courses.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>Course Title</th>
              <th style={styles.tableHeaderCell}>Code</th>
              <th style={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id} style={index % 2 === 0 ? styles.tableRowAlt : styles.tableRow}>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => viewCourseDetails(course.id)}
                    style={styles.courseTitle}
                  >
                    {course.title}
                  </button>
                </td>
                <td style={styles.tableCell}>{course.course_code}</td>
                <td style={styles.tableCell}>
                  <div style={styles.actionContainer}>
                    <button onClick={() => deleteCourse(course.id)} style={styles.actionButton}>
                      <i className="fas fa-trash"></i> {/* Icon for delete */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

// Inline CSS styles
const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
    fontSize: '16px',
  },
  tableHeader: {
    backgroundColor: '#4e73df',
    color: '#fff',
  },
  tableHeaderCell: {
    padding: '12px 15px',
    textAlign: 'left',
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
  },
  tableRowAlt: {
    backgroundColor: '#f1f1f1',
  },
  tableCell: {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
  },
  courseTitle: {
    background: 'none',
    border: 'none',
    color: 'blue',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: '0',
    textAlign: 'center',
  },
  actionContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'black',
    align-item:
  },
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
