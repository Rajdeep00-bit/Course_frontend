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

  // Fetch all course instances based on year and semester or fetch all if empty
  const fetchInstances = () => {
    let apiUrl = 'http://127.0.0.1:8000/api/instances/';
    if (year && semester) {
      apiUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/`;
    }

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Instances fetched:', data);
        setInstances(data); // Update the course instance list
      })
      .catch((error) => {
        console.error('Error fetching instances:', error);
        alert(`Failed to fetch instances: ${error.message}`);
      });
  };

  // Handle new instance creation and refetch the list automatically
  const handleInstanceCreated = () => {
    fetchInstances(); // Refetch the updated list of instances after creation
  };

  // View details of a selected course instance
  const viewInstanceDetails = (id) => {
    if (!year || !semester) {
      alert("Year and semester must be set to fetch instance details.");
      return;
    }

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
    if (!year || !semester) {
      alert("Year and semester must be set to delete an instance.");
      return;
    }

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
        // Refetch instances to update the list after deletion
        fetchInstances();
        alert("Instance deleted successfully.");
        setSelectedInstance(null); // Clear selected instance details after deletion
      })
      .catch((error) => {
        console.error('Error deleting instance:', error);
        alert(`Failed to delete instance: ${error.message}`);
      });
  };

  // Fetch courses and instances on component mount
  useEffect(() => {
    fetchCourses();
    fetchInstances();
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
            onInstanceCreated={handleInstanceCreated} // Pass the refetch function to the form
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
