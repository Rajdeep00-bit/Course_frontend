import React, { useEffect, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseList from './components/CourseList';

function App() {
  const [courses, setCourses] = useState([]);
  const [instances, setInstances] = useState([]);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [fetchNewCourse, setFetchNewCourse] = useState(true);

  const fetchCourses = () => {
    fetch('http://127.0.0.1:8000/api/courses')
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  };

  const fetchInstances = () => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
      .then(response => response.json())
      .then(data => setInstances(data))
      .catch((error) => {
        console.error('Error fetching instances:', error);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>Courses Management</h1>
      </header>

      <div className="container">
        <section className="section">
          <h2>Create New Course</h2>
          <CourseForm onCourseCreated={fetchCourses} setFetchNewCourse={setFetchNewCourse}/>
        </section>

        <section className="section">
          <h2>Create New Course Instance</h2>
          <CourseInstanceForm 
            onInstanceCreated={fetchInstances}
            year={year} 
            semester={semester} 
            setYear={setYear} 
            setSemester={setSemester} 
            fetchNewCourse={fetchNewCourse}
            setFetchNewCourse={setFetchNewCourse}
          />
        </section>

        <section className="section">
          <h2>Courses</h2>
          <CourseList 
            courses={courses} 
            fetchCourses={fetchCourses} 
          />
        </section>

        <section className="section">
          <h2>Course Instances</h2>
          <CourseInstanceList 
            instances={instances} 
            fetchInstances={fetchInstances}
            year={year} 
            semester={semester}
          />
        </section>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Courses Management. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
