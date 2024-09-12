import React, { useState, useEffect } from 'react';

function CourseInstanceList({ year, semester, setInstances }) {
  const [instances, setLocalInstances] = useState([]);

  const fetchInstances = () => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}`)
      .then(response => response.json())
      .then(data => {
        setLocalInstances(data);  // Update local state with fetched instances
        setInstances(data);       // Optionally update parent state if necessary
      })
      .catch((error) => {
        console.error('Error fetching instances:', error);
      });
  };

  useEffect(() => {
    fetchInstances();  // Fetch instances when the component mounts
  }, [year, semester]);

  const deleteInstance = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${id}`, {
      method: 'DELETE'
    })
    .then(() => fetchInstances())  // Refresh the instance list after deletion
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
              <button onClick={() => deleteInstance(instance.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CourseInstanceList;
