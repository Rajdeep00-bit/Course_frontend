import React, { useEffect, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseList from './components/CourseList';
import CourseInstanceDetails from './components/CourseInstanceDetails';

function App() {
  const [courses, setCourses] = useState([]);

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

  const handleCourseCreated = (newCourse) => {
    console.log('New course created:', newCourse);  // Debug log
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  useEffect(() => {
    fetchCourses();
  }, []);  // Fetch courses once on mount

  return (
    <div className="App">
      <header className="header">
        <h1>Courses Management</h1>
      </header>

      <div className="container">
        <section className="section">
          <h2>Create New Course</h2>
          <CourseForm onCourseCreated={handleCourseCreated} />
        </section>

        <section className="section">
          <h2>Courses</h2>
          <CourseList courses={courses} />
        </section>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Courses Management. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
