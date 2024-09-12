import React, { useEffect, useState } from 'react';
import './App.css';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';

function App() {
  const [courses, setCourses] = useState([]); // Store all courses
  const [instances, setInstances] = useState([]); // Store all course instances
  const [year, setYear] = useState(''); // Manage year
  const [semester, setSemester] = useState(''); // Manage semester
  const [loading, setLoading] = useState(false); // Manage loading state for better UX

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
    setLoading(true); // Start loading before fetching
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
      .then((data) => {
        setInstances(data);
        setLoading(false); // Stop loading once fetch completes
      })
      .catch((error) => {
        console.error('Error fetching course instances:', error);
        alert('Failed to fetch course instances.');
        setLoading(false);
      });
  };

  // Handle new instance creation
  const handleInstanceCreated = () => {
    fetchInstances(); // Re-fetch instances to update the list after a new instance is created
  };

  // Fetch courses and instances on component mount
  useEffect(() => {
    fetchCourses();
    fetchInstances();
  }, []); // Empty dependency array ensures this only runs once, when component mounts

  return (
    <div className="App">
      <header>
        <h1>Course Management</h1>
      </header>

      <section>
        <h2>Create New Course Instance</h2>
        <CourseInstanceForm
          onInstanceCreated={handleInstanceCreated}
          year={year}
          semester={semester}
          setYear={setYear}
          setSemester={setSemester}
          courses={courses}
        />
      </section>

      <section>
        <h2>Course Instances</h2>
        {/* Pass the loading state to provide better UX */}
        {loading ? (
          <p>Loading course instances...</p>
        ) : (
          <CourseInstanceList
            instances={instances}
            fetchInstances={fetchInstances} // In case list needs manual refresh
            courses={courses}
          />
        )}
      </section>
    </div>
  );
}

export default App;
