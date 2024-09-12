import React, { useState } from 'react';

function CourseInstanceList({ instances, deleteInstance, viewInstanceDetails, year, semester, courses }) {
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Fetch instance details and store it in selectedInstance state
  const fetchInstanceDetails = (id) => {
    console.log(`Fetching details for ID: ${id}, Year: ${year}, Semester: ${semester}`);

    if (!year || !semester) {
      alert("Year and semester must be set to fetch instance details.");
      return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;
    console.log("API URL:", apiUrl);

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
                    <button onClick={() => deleteInstance(instance.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Display the selected instance details if available */}
      {selectedInstance && selectedInstance.course && (
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
