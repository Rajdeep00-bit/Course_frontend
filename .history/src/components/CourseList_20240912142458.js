import React, { useEffect, useState } from 'react';
import { BiTrash } from 'react-icons/bi'; // Use react-icons for cleaner icons

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
      .then((data) => setCourses(data))
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert(`Failed to fetch courses: ${error.message}`);
      });
  };

  // Delete a course
  const deleteCourse = (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    fetch(`http://127.0.0.1:8000/api/courses/${id}/`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to delete course: ${response.status}`);
        fetchCourses();
      })
      .catch((error) => alert('Failed to delete the course.'));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="course-list">
      <h2>Courses</h2>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>Course Title</th>
              <th style={styles.tableHeaderCell}>Course Code</th>
              <th style={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id} style={index % 2 === 0 ? styles.tableRowAlt : styles.tableRow}>
                <td style={styles.tableCell}>{course.title}</td>
                <td style={styles.tableCell}>{course.course_code}</td>
                <td style={styles.actions}> {/* Action column class */}
                  <button
                    className="icon-btn"
                    onClick={() => deleteCourse(course.id)}
                    style={styles.actionButton}
                  >
                    <BiTrash size={20} color="red" /> {/* Using react-icons for a trash icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Inline styles
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
  actions: {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
  },
};

export default CourseList;
