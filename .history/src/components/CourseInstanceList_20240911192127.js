import React, { useEffect, useState } from 'react';

function CourseInstanceList({ instances, setInstances, year, semester }) {
  const [selectedInstance, setSelectedInstance] = useState(null);  // Define the state for selectedInstance

  // Fetch instance details
  const viewInstanceDetails = (id) => {
    if (!year || !semester) {
      alert("Year and semester must be set to fetch instance details.");
      return;
    }
  
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch instance details: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setSelectedInstance(data))  // Set selected instance for viewing
      .catch((error) => {
        console.error("Error fetching instance details:", error);
        alert("Failed to fetch instance details. Make sure the instance exists.");
      });
  };

  // Delete instance function
  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) {
      return;
    }
  
    // Make sure the API URL is correct and the id is passed properly
    fetch(`http://127.0.0.1:8000/api/instances/${id}/`, {  // Ensure the trailing slash
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',  // Ensure the headers are correctly set
      },
    })
      .then((response) => {
        if (response.ok) {
          const updatedInstances = instances.filter((instance) => instance.id !== id);
          setInstances(updatedInstances);  // Update the instances state
          alert("Instance deleted successfully.");
        } else {
          return response.json().then((err) => {
            console.error('Error during deletion:', err);
            alert('Failed to delete the instance.');
          });
        }fetch(`http://127.0.0.1:8000/api/instances/${id}/`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then((response) => {
    console.log(response);  // Add this line for debugging
    if (response.ok) {
      const updatedInstances = instances.filter((instance) => instance.id !== id);
      setInstances(updatedInstances);  // Update state
      alert("Instance deleted successfully.");
    } else if (response.status === 404) {
      alert("Instance not found. It might have already been deleted.");
    } else {
      return response.json().then((err) => Promise.reject(err));
    }
  })
  .catch((error) => {
    console.error("Error deleting instance:", error);
    alert("Failed to delete the instance. Please try again.");
  });

      })
      .catch((error) => {
        console.error("Error deleting instance:", error);
        alert("Failed to delete the instance. Please try again.");
      });
  };
  

  // Fetch all course instances based on year and semester
  const fetchInstances = () => {
    if (!year || !semester) return;  // Prevent fetching if year or semester is not set
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/`)
      .then(response => response.json())
      .then(data => setInstances(data))
      .catch((error) => {
        console.error('Error fetching instances:', error);
      });
  };

  // Fetch all course instances when year or semester changes
  useEffect(() => {
    fetchInstances();
  }, [year, semester]);

  return (
    <div>
      <ul>
        {instances.length === 0 ? (
          <li>No instances found for the given year and semester.</li>
        ) : (
          instances.map(instance => (
            <li key={instance.id}>
              {instance.course.title} - {instance.year}/{instance.semester}
              <button onClick={() => viewInstanceDetails(instance.id)}>View Details</button>
              <button onClick={() => deleteInstance(instance.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>

      {/* Display selected instance details */}
      {selectedInstance && (
        <div>
          <h2>Course Instance Details</h2>
          <p>Course Title: {selectedInstance.course.title}</p>
          <p>Year: {selectedInstance.year}</p>
          <p>Semester: {selectedInstance.semester}</p>
          {/* Add more fields as needed */}
          <button onClick={() => setSelectedInstance(null)}>Close Details</button>  {/* Close details */}
        </div>
      )}
    </div>
  );
}

export default CourseInstanceList;
