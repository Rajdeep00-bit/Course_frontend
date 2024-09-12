import React, { useEffect, useState } from 'react';

function CourseInstanceList({ instances, setInstances, year, semester }) {
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Fetch instance details (for debugging, you can remove this if not needed)
  const viewInstanceDetails = (id) => {
    console.log(`Year: ${year}, Semester: ${semester}`);
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
      .then((data) => setSelectedInstance(data))
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert('Failed to fetch instance details.');
      });
  };

  // Function to delete the instance
  const deleteInstance = (id) => {
    if (!window.confirm('Are you sure you want to delete this course instance?')) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          const updatedInstances = instances.filter((instance) => instance.id !== id);
          setInstances(updatedInstances); // Update the list of instances
          alert('Instance deleted successfully.');
        } else {
          return response.text().then((err) => Promise.reject(err));
        }
      })
      .catch((error) => {
        console.error('Error deleting instance:', error);
        alert('Failed to delete the instance. Please try again.');
      });
  };

  // Fetch all course instances when the component mounts or when year/semester changes
  useEffect(() => {
    fetchInstances();
  }, [year, semester]);

  const fetchInstances = () => {
    if (!year || !semester) return;
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
      .then((response) => response.json())
      .then((data) => setInstances(data))
      .catch((error) => {
        console.error('Error fetching instances:', error);
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
                <td>{instance.course.title}</td> {/* Individual course title */}
                <td>{`${instance.year}-${instance.semester}`}</td>
                <td>{instance.code}</td> {/* Course code */}
                <td>
                  <button onClick={() => deleteInstance(instance.id)} className="action-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Selected instance details, if needed */}
      {selectedInstance && (
        <div className="selected-instance-details">
          <h2>Course Instance Details</h2>
          <p><strong>Title:</strong> {selectedInstance.course.title}</p>
          <p><strong>Year:</strong> {selectedInstance.year}</p>
          <p><strong>Semester:</strong> {selectedInstance.semester}</p>
          <p><strong>Code:</strong> {selectedInstance.code}</p>
        </div>
      )}
    </div>
  );
}

export default CourseInstanceList;
