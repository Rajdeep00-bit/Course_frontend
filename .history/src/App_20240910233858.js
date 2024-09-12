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
  const [fetchNewCourse, setFetchNewCourse] = useState(true);

  // Fetch all courses
  const fetchCourses = () => {
    fetch('http://127.0.0.1:8000/api/courses')
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  };

  // Fetch all course instances based on year and semester
  const fetchInstances = () => {
    if (!year || !semester) return;  // Prevent fetching if year or semester is not set
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
      .then(response => response.json())
      .then(data => setInstances(data))  // Immediately update state with fetched instances
      .catch((error) => {
        console.error('Error fetching instances:', error);
      });
  };

  // Fetch course instance details for a specific instance
  const viewInstanceDetails = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}`)
      .then(response => response.json())
      .then(data => setSelectedInstance(data))  // Set selected instance to display its details
      .catch((error) => {
        console.error('Error fetching instance details:', error);
      });
  };

  // Delete a course instance and update the state in real-time
  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        alert("Instance deleted successfully.");
        setSelectedInstance(null); // Clear selected instance after deletion
        fetchInstances();  // Force-refresh the instance list after deletion
      } else {
        return response.json().then(err => Promise.reject(err));
      }
    })
    .catch((error) => {
      console.error('Error deleting instance:', error);
      alert("Failed to delete the instance. Please try again.");
    });
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Re-fetch instances whenever year/semester changes
  useEffect(() => {
    fetchInstances();
  }, [year, semester]);

  return (
    <div className="App">
      <header className="header">
        <h1>Courses Management</h1>
      </header>

      <div className="container">
        {/* Section for Creating a New Course */}
        <section className="section">
          <h2>Create New Course</h2>
          <CourseForm onCourseCreated={fetchCourses} setFetchNewCourse={setFetchNewCourse} />
        </section>

        {/* Section for Creating a New Course Instance */}
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

        {/* Section for Displaying the List of Courses */}
        <section className="section">
          <h2>Courses</h2>
          <CourseList 
            courses={courses} 
            fetchCourses={fetchCourses} 
          />
        </section>

        {/* Section for Displaying the List of Course Instances */}
        <section className="section">
          <h2>Course Instances</h2>
          <CourseInstanceList 
            instances={instances} 
            fetchInstances={fetchInstances}
            year={year}
            semester={semester}
            viewInstanceDetails={viewInstanceDetails}  // Pass function to view instance details
          />
        </section>

        {/* Section for Displaying Selected Course Instance Details */}
        {selectedInstance && (
          <section className="section">
            <h2>Course Instance Details</h2>
            <CourseInstanceDetails
              instance={selectedInstance}
              fetchInstances={fetchInstances}  // Pass fetchInstances to refresh list after deletion
            />
            <button onClick={() => deleteInstance(selectedInstance.id)}>Delete Instance</button> {/* Delete Button */}
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
