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
  const [year, setYear] = useState('');  // Initialize as string
  const [semester, setSemester] = useState('');  // Initialize as string
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [fetchNewCourse, setFetchNewCourse] = useState(true);

  // Fetch all courses
  const fetchCourses = () => {
    fetch('http://127.0.0.1:8000/api/courses/')
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  };

  const handleInstanceCreated = () => {
    fetchInstances();  // Refresh the list after a new instance is created
  };

  // Fetch all course instances based on year and semester
  const fetchInstances = () => {
    if (!year || !semester) return;  // Prevent fetching if year or semester is not set
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/`)  // Add trailing slash
      .then((response) => response.json())
      .then((data) => setInstances(data))  // Immediately update state with fetched instances
      .catch((error) => {
        console.error('Error fetching instances:', error);
      });
  };

  // Fetch course instance details for a specific instance
  const viewInstanceDetails = (id) => {
    if (!year || !semester) {
      alert("Year and semester must be set to fetch instance details.");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`)  // Add trailing slash
      .then((response) => response.json())
      .then((data) => setSelectedInstance(data))  // Set selected instance to display its details
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert("Failed to fetch instance details. Make sure the instance exists.");
      });
  };

  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${id}/`, {  // Ensure trailing slash
      method: 'DELETE'
    })
      .then((response) => {
        if (response.ok) {
          const updatedInstances = instances.filter((instance) => instance.id !== id);
          setInstances(updatedInstances);
          alert("Instance deleted successfully.");
        } else {
          return response.json().then((err) => Promise.reject(err));
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
            onInstanceCreated={handleInstanceCreated}
            year={year}
            semester={semester}
            setYear={setYear}
            setSemester={setSemester}
            fetchNewCourse={fetchNewCourse}
            setFetchNewCourse={setFetchNewCourse}
            fetchInstances={fetchInstances}
          />
        </section>

        {/* Section for Displaying the List of Courses */}
        <section className="section">
          <h2>Courses</h2>
          <CourseList courses={courses} fetchCourses={fetchCourses} deleteCourse={deleteCourse} />
        </section>

        {/* Section for Displaying the List of Course Instances */}
        <section className="section">
          <h2>Course Instances</h2>
          <CourseInstanceList
            instances={instances}
            fetchInstances={fetchInstances}
            year={year}
            semester={semester}
            viewInstanceDetails={viewInstanceDetails}
            deleteInstance={deleteInstance}
          />
        </section>

        {/* Section for Displaying Selected Course Instance Details */}
        {selectedInstance && (
          <section className="section">
            <h2>Course Instance Details</h2>
            <CourseInstanceDetails
              instance={selectedInstance}
              fetchInstances={fetchInstances}
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
