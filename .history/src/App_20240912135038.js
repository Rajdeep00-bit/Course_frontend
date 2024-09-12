import React, { useEffect, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseList from './components/CourseList';
import CourseInstanceDetails from './components/CourseInstanceDetails';

function App() {
  const [courses, setCourses] = useState([]); // Store all courses
  const [instances, setInstances] = useState([]); // Store all course instances
  const [year, setYear] = useState(''); // Manage year
  const [semester, setSemester] = useState(''); // Manage semester
  const [selectedInstance, setSelectedInstance] = useState(null); // Manage selected instance

  // Fetch all courses when the component mounts
  const fetchCourses = () => {
    fetch('http://127.0.0.1:8000/api/courses/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCourses(data))
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert('Failed to fetch courses.');
      });
  };

  // Fetch all instances
  const fetchInstances = () => {
    let apiUrl = 'http://127.0.0.1:8000/api/instances/';
    if (year && semester) {
      apiUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/`;
    }
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch course instances: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setInstances(data))
      .catch((error) => {
        console.error('Error fetching course instances:', error);
        alert('Failed to fetch course instances.');
      });
  };

  // Handle new instance creation
  const handleInstanceCreated = () => {
    fetchInstances(); // Re-fetch instances to update the list
  };

  // Fetch courses and instances on component mount
  useEffect(() => {
    fetchCourses();
    fetchInstances();
  }, []);

  // Handle viewing details of a course instance
  const viewInstanceDetails = (id) => {
    const instanceUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;
    fetch(instanceUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch instance details: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setSelectedInstance(data))
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert('Failed to fetch instance details.');
      });
  };

  // Handle deletion of a course instance
  const deleteInstance = (id) => {
    const deleteUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;
    if (window.confirm('Are you sure you want to delete this instance?')) {
      fetch(deleteUrl, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete instance: ${response.status}`);
          }
          fetchInstances(); // Refresh instances after deletion
          setSelectedInstance(null); // Clear selected instance
          alert('Instance deleted successfully.');
        })
        .catch((error) => {
          console.error('Error deleting instance:', error);
          alert('Failed to delete instance.');
        });
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Course Management</h1>
      </header>

      <div className="container">
        {/* Section for Creating a New Course */}
        <section className="section">
          <h2>Create New Course</h2>
          <CourseForm onCourseCreated={fetchCourses} />
        </section>

        {/* Section for Creating a New Course Instance */}
        <section className="section">
          <h2>Create New Course Instance</h2>
          <CourseInstanceForm
            onInstanceCreated={handleInstanceCreated}
            courses={courses}
          />
        </section>

        {/* Section for Displaying the List of Courses */}
        <section className="section">
          <h2>Courses</h2>
          <CourseList courses={courses} fetchCourses={fetchCourses} />
        </section>

        {/* Section for Displaying the List of Course Instances */}
        <section className="section">
          <h2>Course Instances</h2>
          <CourseInstanceList
            instances={instances}
            deleteInstance={deleteInstance}
            viewInstanceDetails={viewInstanceDetails}
            courses={courses}
          />
        </section>

        {/* Section for Displaying Selected Course Instance Details */}
        {selectedInstance && (
          <section className="section">
            <h2>Course Instance Details</h2>
            <CourseInstanceDetails instance={selectedInstance} />
            <button onClick={() => deleteInstance(selectedInstance.id)}>
              Delete Instance
            </button>
          </section>
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2024 Course Management. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
