import React, { useEffect, useState } from 'react';

function CourseInstanceList({ instances, setInstances, year, semester }) {
  const [selectedInstance, setSelectedInstance] = useState(null);  // State to store the selected course instance details

  // Function to fetch the instance details for the "View Details" button
  const viewInstanceDetails = (id) => {
    console.log(`Year: ${year}, Semester: ${semester}`);  // Debug year and semester values
    if (!year || !semester) {
      alert("Year and semester must be set to fetch instance details.");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`)
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK (e.g., 404), handle it
          return response.text().then((text) => { 
            throw new Error(`Failed to fetch instance details: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setSelectedInstance(data);  // Set the selected instance details
      })
      .catch((error) => {
        console.error("Error fetching instance details:", error);
        alert("Failed to fetch instance details. Make sure the instance exists.");
      });
  };

  // Function to delete an instance for the "Delete" button
  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted instance from the state
          const updatedInstances = instances.filter((instance) => instance.id !== id);
          setInstances(updatedInstances);  // Update the list of instances
          alert("Instance deleted successfully.");
        } else {
          return response.text().then((err) => {
            throw new Error(`Failed to delete the instance: ${response.status} - ${err}`);
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting instance:", error);
        alert("Failed to delete the instance. Please try again.");
      });
  };

  // Fetch all course instances when component mounts or when year/semester changes
  useEffect(() => {
    console.log(`Year: ${year}, Semester: ${semester}`);  // Log year and semester values
    fetchInstances();
  }, [year, semester]);

  const fetchInstances = () => {
    if (!year || !semester) return;  // Prevent fetching if year or semester is not set

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
      .then((response) => {
        if (!response.ok) {
          // Handle non-JSON responses (like HTML error pages)
          return response.text().then((text) => { 
            throw new Error(`Failed to fetch instances: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => setInstances(data))
      .catch((error) => {
        console.error('Error fetching instances:', error);
        alert("Failed to fetch instances. Please check the year/semester and try again.");
      });
  };

  return (
    <div>
      <ul>
        {instances.length === 0 ? (
          <li>No instances found for the given year and semester.</li>
        ) : (
          instances.map((instance) => (
            <li key={instance.id}>
              {instance.course.title} - {instance.year}/{instance.semester}
              <button onClick={() => viewInstanceDetails(instance.id)}>View Details</button>
              <button onClick={() => deleteInstance(instance.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>

      {/* Display the selected instance details if available */}
      {selectedInstance && (
        <div>
          <h2>Course Instance Details</h2>
          <p><strong>Title:</strong> {selectedInstance.course.title}</p>
          <p><strong>Year:</strong> {selectedInstance.year}</p>
          <p><strong>Semester:</strong> {selectedInstance.semester}</p>
          <p><strong>Code:</strong> {selectedInstance.code}</p>
          {/* You can add more details if needed */}
        </div>
      )}
    </div>
  );
}

export default CourseInstanceList;
