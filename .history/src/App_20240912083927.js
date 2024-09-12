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
    console.log('Fetching courses...');
    fetch('http://127.0.0.1:8000/api/courses/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched courses:', data);
        setCourses(data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert(`Failed to fetch courses: ${error.message}`);
      });
  };

  // Auto-refresh the course list every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCourses();  // Refresh the courses list every 30 seconds
    },
   30);  // Set interval to 30 seconds

    return () => clearInterval(interval);  // Cleanup the interval when the component unmounts
  }, []);

  // View course details
  const viewCourseDetails = (id) => {
    const cleanId = id.toString().trim();  // This will remove any newlines or spaces
    fetch(`http://127.0.0.1:8000/api/courses/${cleanId}/`)
      .then(response => response.json())
      .then(data => {
        console.log('Course details:', data);
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
      });
  };

  // Handle course instance creation
  const handleInstanceCreated = () => {
    fetchInstances();  // Refresh the list after a new instance is created
  };

  // Delete a course
  const deleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/courses/${id}/`, {  // Ensure trailing slash
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const updatedCourses = courses.filter((course) => course.id !== id);
          setCourses(updatedCourses);  // Update state
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

  // Fetch course instances based on year and semester
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

  // View course instance details
  const viewInstanceDetails = (id) => {
    if (!year || !semester) {
      alert("Year and semester must be set to fetch instance details.");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setSelectedInstance(data))
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert("Failed to fetch instance details. Make sure the instance exists.");
      });
  };

  // Delete a course instance
  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        // Remove the deleted instance from state
        const updatedInstances = instances.filter((instance) => instance.id !== id);
        setInstances(updatedInstances);
        alert("Instance deleted successfully.");
      })
      .catch((error) => {
        console.error('Error deleting instance:', error);
        alert(`Failed to delete the instance: ${error.message}`);
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
