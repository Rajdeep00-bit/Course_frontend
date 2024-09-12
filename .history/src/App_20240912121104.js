import React, { useEffect, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseList from './components/CourseList';
import CourseInstanceDetails from './components/CourseInstanceDetails';

function App() {
  const [courses, setCourses] = useState([]); // Store courses
  const [instances, setInstances] = useState([]); // Store course instances
  const [year, setYear] = useState(''); // String for year
  const [semester, setSemester] = useState(''); // String for semester
  const [selectedInstance, setSelectedInstance] = useState(null); // For viewing details of a course instance
  const [fetchNewCourse, setFetchNewCourse] = useState(false); // Trigger to refetch courses

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

  // Handle new course creation and refetch courses
  const handleCourseCreated = (newCourse) => {
    console.log('Course created:', newCourse);
    fetchCourses(); // Refetch courses
  };

  // Handle course deletion and update the state
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
        fetchCourses(); // Refetch courses after deletion
        alert("Course deleted successfully.");
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
        alert(`Failed to delete the course: ${error.message}`);
      });
  };

  // Fetch course instances based on year and semester
  const fetchInstances = () => {
    if (!year || !semester) {
      console.log("Year or Semester is missing");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setInstances(data)) // Set the fetched instances
      .catch((error) => {
        console.error('Error fetching instances:', error);
        alert(`Failed to fetch instances: ${error.message}`);
      });
  };

  // Handle new instance creation and append to the list
  const handleInstanceCreated = (newInstance) => {
    setInstances((prevInstances) => [...prevInstances, newInstance]); // Append the new instance
  };

  // View details of a selected course instance
  const viewInstanceDetails = (id) => {
    const instance = instances.find((inst) => inst.id === id);
    setSelectedInstance(instance); // Set the selected instance
  };

  // Handle deletion of a course instance
  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) {
      return;
    }

    const yearValue = year || '';
    const semesterValue = semester || '';

    const url = `http://127.0.0.1:8000/api/instances/${yearValue}/${semesterValue}/${id}/`;

    fetch(url, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const updatedInstances = instances.filter((instance) => instance.id !== id);
        setInstances(updatedInstances); // Remove the deleted instance
        alert("Instance deleted successfully.");
        setSelectedInstance(null); // Clear selected instance details
      })
      .catch((error) => {
        console.error('Error deleting instance:', error);
        alert(`Failed to delete the instance: ${error.message}`);
      });
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses(); // Fetch the courses when the component mounts
  }, []);

  // Re-fetch instances whenever year/semester changes
  useEffect(() => {
    fetchInstances(); // Fetch instances when year or semester changes
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
            onInstanceCreated={handleInstanceCreated} // Pass created instance
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
            deleteCourse={deleteCourse}
          />
        </section>

        {/* Section for Displaying the List of Course Instances */}
        <section className="section">
          <h2>Course Instances</h2>
          <CourseInstanceList
            instances={instances}
            deleteInstance={deleteInstance}
            viewInstanceDetails={viewInstanceDetails}
            year={year}
            semester={semester}
            courses={courses} // Pass courses to CourseInstanceList
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
