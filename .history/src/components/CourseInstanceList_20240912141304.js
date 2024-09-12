import React, { useEffect, useState } from 'react';

function CourseInstanceList({ courses }) {
  const [instances, setInstances] = useState([]); // Store all course instances
  const [selectedInstance, setSelectedInstance] = useState(null); // Manage selected instance state

  // Fetch all instances when the component mounts
  const fetchInstances = () => {
    fetch('http://127.0.0.1:8000/api/instances/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch course instances: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setInstances(data); // Store all fetched instances
        console.log('Fetched instances:', data);
      })
      .catch((error) => {
        console.error('Error fetching course instances:', error);
        alert('Failed to fetch course instances.');
      });
  };

  // Fetch instance details using the GET endpoint
  const fetchInstanceDetails = (id, year, semester) => {
    const apiUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;
    console.log('Fetching details from:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch instance details: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched instance details:', data);
        setSelectedInstance(data); // Store fetched instance details
      })
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert('Failed to fetch instance details.');
      });
  };

  // Delete instance using the DELETE endpoint
  const handleDeleteInstance = (id, year, semester) => {
    const deleteUrl = `http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`;

    if (!window.confirm('Are you sure you want to delete this instance?')) {
      return;
    }

    fetch(deleteUrl, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete instance: ${response.status}`);
        }
        console.log('Instance deleted successfully.');
        fetchInstances(); // Fetch the updated list after deletion
      })
      .catch((error) => {
        console.error('Error deleting instance:', error);
        alert('Failed to delete instance.');
      });
  };

  // Find the course title and code for each instance
  const getCourseDetails = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      console.error(`Course not found for courseId: ${courseId}`);
    }
    return course ? { title: course.title, code: course.code } : { title: 'Unknown Course', code: 'N/A' };
  };

  // Use effect to fetch course instances on component mount
  useEffect(() => {
    fetchInstances(); // Fetch course instances when the component mounts
  }, []);

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
              const { title, code } = getCourseDetails(instance.course);
              console.log(`Instance: ${instance.id}, Course Title: ${title}, Course Code: ${code}`); // Debugging statement
              return (
                <tr key={instance.id}>
                  <td>{title}</td>
                  <td>{`${instance.year}-${instance.semester}`}</td>
                  <td>{code}</td>
                  <td>
                    <button
                      onClick={() => fetchInstanceDetails(instance.id, instance.year, instance.semester)}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteInstance(instance.id, instance.year, instance.semester)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Display selected instance details */}
      {selectedInstance && (
        <div className="selected-instance-details">
          <h2>Course Instance Details</h2>
          <p><strong>Title:</strong> {getCourseDetails(selectedInstance.course).title}</p>
          <p><strong>Year:</strong> {selectedInstance.year}</p>
          <p><strong>Semester:</strong> {selectedInstance.semester}</p>
          <p><strong>Code:</strong> {getCourseDetails(selectedInstance.course).code}</p>
          <button onClick={() => setSelectedInstance(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default CourseInstanceList;
