import React, { useEffect, useState } from 'react';

function CourseInstanceList({ instances, setInstances, year, semester, deleteInstance }) {
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Fetch instance details
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

      {/* Display the selected instance details, if needed */}
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
