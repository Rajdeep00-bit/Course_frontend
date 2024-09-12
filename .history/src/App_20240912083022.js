import React, { useEffect, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';

function App() {
  const [courses, setCourses] = useState([]);

  // Fetch all courses
  const fetchCourses = () => {
    fetch('http://127.0.0.1:8000/api/courses/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert(`Failed to fetch courses: ${error.message}`);
      });
  };

  // Handle course deletion
  const deleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/courses/${id}/`, {  // Ensure trailing slash
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          fetchCourses();  // Refresh the course list after deletion
          alert("Course deleted successfully.");
        } else {
          return response.json().then((err) => Promise.reject(err));
        }
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
        alert("Failed to delete the course. Please try again.");
      });
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>Courses Management</h1>
      </header>

      <div className="container">
        {/* Section for Creating a New Course */}
        <section className="section">
          <h2>Create New Course</h2>
          <CourseForm onCourseCreated={fetchCourses} />
        </section>

        {/* Section for Displaying the List of Courses */}
        <section className="section">
          <h2>Courses</h2>
          <CourseList courses={courses} deleteCourse={deleteCourse} />
        </section>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Courses Management. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
