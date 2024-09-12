import React, { useEffect, useState } from 'react';

function CourseInstanceList({ year, semester }) {
  const [instances, setInstances] = useState([]);

  // Fetch instances for a particular year and semester
  useEffect(() => {
    if (year && semester) {
      fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
        .then(response => response.json())
        .then(data => {
          setInstances(data);  // Update state with fetched instances
        })
        .catch((error) => {
          console.error('Error fetching instances:', error);
        });
    }
  }, [year, semester]);

  // View instance details (for display or debugging)
  const viewInstanceDetails = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Instance details:', data);  // Log the instance details (can be displayed in a modal or separate UI element)
      })
      .catch((error) => {
        console.error('Error fetching instance details:', error);
      });
  };

  // Delete an instance and update the state without confirmation
  const deleteInstance = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // Filter out the deleted instance from the state and update the list
        const updatedInstances = instances.filter(instance => instance.id !== id);
        setInstances(updatedInstances); // Update state with the new instance list
      } else {
        console.error('Failed to delete instance:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('Error deleting instance:', error);
    });
  };

  return (
    <div>
      <h3>Course Instances for {year} - Semester {semester}</h3>

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
    </div>
  );
}

export default CourseInstanceList;
