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
        setCourses(data); // Set fetched courses in state
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert(`Failed to fetch courses: ${error.message}`);
      });
  };

  // Fetch all course instances based on year and semester
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

  // Handle the creation of a new instance
  const handleInstanceCreated = (newInstance) => {
    setInstances((prevInstances) => [...prevInstances, newInstance]); // Append the new instance to the list
  };

  // View details of a selected course instance
  const viewInstanceDetails = (id) => {
    const instanceUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;

    fetch(instanceUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Instance details:', data);
        setSelectedInstance(data); // Set the selected instance
      })
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert(`Failed to fetch instance details: ${error.message}`);
      });
  };

  // Handle deletion of an instance
  const deleteInstance = (id) => {
    const deleteUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;

    if (!window.confirm("Are you sure you want to delete this instance?")) {
      return;
    }

    fetch(deleteUrl, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        // Filter out the deleted instance
        setInstances((prevInstances) => prevInstances.filter((instance) => instance.id !== id));
        alert("Instance deleted successfully.");
        setSelectedInstance(null); // Clear selected instance details after deletion
      })
      .catch((error) => {
        console.error('Error deleting instance:', error);
        alert(`Failed to delete instance: ${error.message}`);
      });
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Re-fetch instances whenever year/semester changes
  useEffect(() => {
    if (year && semester) {
      fetchInstances();
    }
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
          <CourseForm onCourseCreated={fetchCourses} />
        </section>

        {/* Section for Creating a New Course Instance */}
        <section className="section">
          <h2>Create New Course Instance</h2>
          <CourseInstanceForm
            onInstanceCreated={handleInstanceCreated} // Pass the created instance
            year={year}
            semester={semester}
            setYear={setYear}
            setSemester={setSemester}
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
            deleteInstance={deleteInstance}
            viewInstanceDetails={viewInstanceDetails}
            year={year}
            semester={semester}
            courses={courses} // Pass the list of courses to match course titles
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
