import React, { useEffect, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseList from './components/CourseList';
import CourseInstanceDetails from './components/CourseInstanceDetails';

function App() {
  const [courses, setCourses] = useState([]);
  const [instances, setInstances] = useState([]);  // State to hold the course instances
  const [year, setYear] = useState('');  // Initialize as string
  const [semester, setSemester] = useState('');  // Initialize as string
  const [selectedInstance, setSelectedInstance] = useState(null);

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
        console.log('Courses fetched:', data);
        setCourses(data); // Set fetched courses
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert(`Failed to fetch courses: ${error.message}`);
      });
  };

  // Handle course creation: either append manually or refetch
  const handleCourseCreated = (newCourse) => {
    console.log('Course created:', newCourse);  // Debug log
    fetchCourses();
  };

  // Handle course deletion: remove the course from the existing courses array
  const deleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    console.log(`Deleting course with ID: ${id}`);
    fetch(`http://127.0.0.1:8000/api/courses/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        fetchCourses(); // Refetch courses after deleting a course
        alert("Course deleted successfully.");
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
        alert(`Failed to delete the course: ${error.message}`);
      });
  };

  // Fetch course instances based on year and semester
  const fetchInstances = () => {
    if (!year || !semester || year === '' || semester === '') {
      console.log("Year or Semester is missing");
      return;  // Don't proceed if year or semester isn't set
    }

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setInstances(data))  // Set the fetched instances
      .catch((error) => {
        console.error('Error fetching instances:', error);
        alert(`Failed to fetch instances: ${error.message}`);
      });
  };

  // Handle course instance creation: Append the new instance to the list
  const handleInstanceCreated = (newInstance) => {
    setInstances((prevInstances) => [...prevInstances, newInstance]);  // Append new instance
  };

  // Define the deleteInstance function for course instances
// Define the deleteInstance function for course instances
const deleteInstance = (id) => {
  if (!window.confirm("Are you sure you want to delete this course instance?")) {
    return;
  }

  // Construct the correct URL, ensuring there are no extra slashes
// Define the deleteInstance function for course instances
const deleteInstance = (id) => {
  if (!window.confirm("Are you sure you want to delete this course instance?")) {
    return;
  }

  // Ensure the year and semester are passed correctly and avoid extra slashes in the URL
  const yearValue = year || '';  // If year is undefined or empty, fallback to an empty string
  const semesterValue = semester || '';  // If semester is undefined or empty, fallback to an empty string

  // Construct the correct URL without extra slashes
  const url = `http://127.0.0.1:8000/api/instances/${yearValue}/${semesterValue}/${id}/`;

  fetch(url, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      // Remove the deleted instance from the UI
      const updatedInstances = instances.filter((instance) => instance.id !== id);
      setInstances(updatedInstances); // Update the state after deletion
      alert("Instance deleted successfully.");
    })
    .catch((error) => {
      console.error('Error deleting instance:', error);
      alert(`Failed to delete the instance: ${error.message}`);
    });
};



  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses(); // Fetch the courses only once when the component mounts
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
          <CourseForm onCourseCreated={handleCourseCreated} />
        </section>

        {/* Section for Creating a New Course Instance */}
        <section className="section">
          <h2>Create New Course Instance</h2>
          <CourseInstanceForm
            onInstanceCreated={handleInstanceCreated}  // Pass the created instance to be appended
            year={year}
            semester={semester}
            setYear={setYear}
            setSemester={setSemester}
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
            setInstances={setInstances}  // Ensure to pass setInstances here
            year={year}
            semester={semester}
            deleteInstance={deleteInstance}  // Pass the deleteInstance function
          />
        </section>

        {/* Section for Displaying Selected Course Instance Details */}
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
