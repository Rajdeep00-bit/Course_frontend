import React, { useEffect } from 'react';

function CourseInstanceList({ instances, setInstances, year, semester }) {
  const handleInstanceCreated = () => {
    fetchInstances();  // Refresh the list after a new instance is created
  };
  

  // Fetch instance details (for display or debugging)
  const viewInstanceDetails = (id) => {
    // Ensure year and semester are valid
    if (!year || !semester) {
      alert('Year and semester must be set to fetch instance details.');
      return;
    }
  
    const url = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;
    
    console.log("Fetching details from URL:", url);  // Log the URL being used
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Instance not found: ${response.status}`); // Throw error if response is not OK
        }
        return response.json();
      })
      .then(data => {
        console.log('Instance details:', data);  // Log or display instance details
      })
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert('Failed to fetch instance details. Make sure the instance exists.');
      });
  };
  
  
  

  // Function to delete the instance
  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) {
      return;
    }
  
    fetch(`http://127.0.0.1:8000/api/instances/${id}/`, {  // Ensure trailing slash
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const updatedInstances = instances.filter((instance) => instance.id !== id);
          setInstances(updatedInstances);  // Update state
          alert("Instance deleted successfully.");
        } else {
          return response.json().then((err) => Promise.reject(err));
        }
      })
      .catch((error) => {
        console.error("Error deleting instance:", error);
        alert("Failed to delete the instance. Please try again.");
      });
  };
  
// Fetch all course instances when component mounts
useEffect(() => {
  fetchInstances();
}, [year, semester]);

const fetchInstances = () => {
  if (!year || !semester) return;  // Prevent fetching if year or semester is not set
  fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
    .then(response => response.json())
    .then(data => setInstances(data))
    .catch((error) => {
      console.error('Error fetching instances:', error);
    });
};

  

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
              <button onClick={() => deleteInstance(instance.id)}>Delete</button> {/* Delete without confirmation */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CourseInstanceList;
