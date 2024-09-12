import React, { useEffect, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseList from './components/CourseList';
import CourseInstanceDetails from './components/CourseInstanceDetails';

function App() {
  const [courses, setCourses] = useState([]);
  const [instances, setInstances] = useState([]);
  const [year, setYear] = useState('');  
  const [semester, setSemester] = useState('');  
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Load year and semester from localStorage when the app loads
  useEffect(() => {
    const savedYear = localStorage.getItem('year');
    const savedSemester = localStorage.getItem('semester');
    
    if (savedYear && savedSemester) {
      setYear(savedYear);
      setSemester(savedSemester);
    }
  }, []); // Empty array means this effect will run only once when the component mounts

  // Save year and semester to localStorage whenever they change
  useEffect(() => {
    if (year) localStorage.setItem('year', year);
    if (semester) localStorage.setItem('semester', semester);
  }, [year, semester]);

  // Fetch all courses
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

  const handleCourseCreated = (newCourse) => {
    fetchCourses();
  };

  const deleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    fetch(`http://127.0.0.1:8000/api/courses/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        fetchCourses(); 
        alert("Course deleted successfully.");
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
        alert(`Failed to delete the course: ${error.message}`);
      });
  };

  const fetchInstances = () => {
    if (!year || !semester) return;

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setInstances(data))
      .catch((error) => {
        console.error('Error fetching instances:', error);
        alert(`Failed to fetch instances: ${error.message}`);
      });
  };

  const handleInstanceCreated = () => {
    fetchInstances();  
  };

  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) return;

    fetch(`http://127.0.0.1:8000/api/instances/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const updatedInstances = instances.filter((instance) => instance.id !== id);
        setInstances(updatedInstances); 
        alert("Instance deleted successfully.");
      })
      .catch((error) => {
        console.error('Error deleting instance:', error);
        alert(`Failed to delete the instance: ${error.message}`);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchInstances();
  }, [year, semester]);

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
          <h2>Create New Course Instance</h2>
          <CourseInstanceForm
            onInstanceCreated={handleInstanceCreated}
            year={year}
            semester={semester}
            setYear={setYear}
            setSemester={setSemester}
          />
        </section>

        <section className="section">
          <h2>Courses</h2>
          <CourseList courses={courses} fetchCourses={fetchCourses} deleteCourse={deleteCourse} />
        </section>

        <section className="section">
          <h2>Course Instances</h2>
          <CourseInstanceList
            instances={instances}
            setInstances={setInstances} 
            year={year}
            semester={semester}
            deleteInstance={deleteInstance}  
          />
        </section>

        {selectedInstance && (
          <section className="section">
            <h2>Course Instance Details</h2>
            <CourseInstanceDetails instance={selectedInstance} />
            <button onClick={() => deleteInstance(selectedInstance.id)}>Delete Instance</button>
          </section>
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2024 Courses Management. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
