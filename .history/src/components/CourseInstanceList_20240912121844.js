import React, { useState } from 'react';

function CourseInstanceList({ instances, deleteInstance, viewInstanceDetails, year, semester, courses }) {
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Fetch instance details using the GET endpoint and store it in selectedInstance state
  const fetchInstanceDetails = (id) => {
    if (!year || !semester) {
      alert("Year and semester must be set to fetch instance details.");
      return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;
    console.log("Fetching details from:", apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch instance details: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched instance details:", data);
        setSelectedInstance(data);
      })
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert('Failed to fetch instance details.');
      });
  };

  // Delete instance using the DELETE endpoint
  const handleDeleteInstance = (id) => {
    if (!year || !semester) {
      alert("Year and semester must be set to delete an instance.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this instance?")) {
      return;
    }

    const deleteUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;
    console.log("Deleting instance from:", deleteUrl);

    fetch(deleteUrl, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete instance: ${response.status}`);
        }
        console.log("Instance deleted successfully.");
        deleteInstance(id); // Call the deleteInstance function passed as a prop to update the list
      })
      .catch((error) => {
        console.error('Error deleting instance:', error);
        alert('Failed to delete instance.');
      });
  };

  // Function to find the course title and code for each instance based on course ID
  const getCourseDetails = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? { title: course.title, code: course.code } : { title: 'Unknown Course', code: 'N/A' };
  };

  return (
    <div className="course-instance-list">
      <h2>Course Instances</h2>
      {instances.length === 0 ? (
        <p>No course instances available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Year-Semester</th>
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instances.map((instance) => {
              const { title, code } = getCourseDetails(instance.course); // Get course details
              return (
                <tr key={instance.id}>
                  <td>{title}</td>
                  <td>{`${instance.year}-${instance.semester}`}</td>
                  <td>{code}</td>
                  <td>
                    <button onClick={() => fetchInstanceDetails(instance.id)}>View Details</button>
                    <button onClick={() => handleDeleteInstance(instance.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Display the selected instance details if available */}
      {selectedInstance && (
        <div className="selected-instance-details">
          <h2>Course Instance Details</h2>
          <p><strong>Title:</strong> {getCourseDetails(selectedInstance.course).title}</p>
          <p><strong>Year:</strong> {selectedInstance.year}</p>
          <p><strong>Semester:</strong> {selectedInstance.semester}</p>
          <p><strong>Code:</strong> {getCourseDetails(selectedInstance.course).code}</p>
        </div>
      )}
    </div>
  );
}

export default CourseInstanceList;
