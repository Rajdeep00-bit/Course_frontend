import React, { useEffect, useState } from 'react';
import { FaTrash, FaSearch } from 'react-icons/fa'; // FontAwesome icons

function CourseInstanceList({ instances, setInstances, year, semester }) {
  const [selectedInstance, setSelectedInstance] = useState(null); 

  // Function to fetch all course instances
  const fetchInstances = () => {
    if (!year || !semester) return;  // Prevent fetching if year or semester is not set
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
      .then((response) => response.json())
      .then((data) => setInstances(data))
      .catch((error) => {
        console.error('Error fetching instances:', error);
      });
  };

  // Fetch course instances when year or semester changes
  useEffect(() => {
    fetchInstances();
  }, [year, semester]);

  // View instance details
  const viewInstanceDetails = (id) => {
    if (!year || !semester) {
      alert("Year and semester must be set to fetch instance details.");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`)
      .then((response) => response.json())
      .then((data) => setSelectedInstance(data))
      .catch((error) => {
        console.error("Error fetching instance details:", error);
        alert("Failed to fetch instance details. Make sure the instance exists.");
      });
  };

  // Delete instance
  const deleteInstance = (id) => {
    if (!window.confirm("Are you sure you want to delete this course instance?")) return;

    fetch(`http://127.0.0.1:8000/api/instances/${id}/`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          const updatedInstances = instances.filter((instance) => instance.id !== id);
          setInstances(updatedInstances);  // Remove deleted instance from the state
          alert("Instance deleted successfully.");
        } else {
          alert("Failed to delete the instance.");
        }
      })
      .catch((error) => {
        console.error("Error deleting instance:", error);
        alert("Failed to delete the instance. Please try again.");
      });
  };

  return (
    <div className="course-instance-list">
      <table>
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Year-Sem</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {instances.length === 0 ? (
            <tr>
              <td colSpan="4">No instances found for the given year and semester.</td>
            </tr>
          ) : (
            instances.map((instance) => (
              <tr key={instance.id}>
                <td>{instance.course.title}</td>
                <td>{`${instance.year}-${instance.semester}`}</td>
                <td>{instance.code}</td>
                <td>
                  <button onClick={() => viewInstanceDetails(instance.id)}>
                    <FaSearch />
                  </button>
                  <button onClick={() => deleteInstance(instance.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CourseInstanceList;
