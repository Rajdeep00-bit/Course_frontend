import React from 'react';

function CourseInstanceList({ instances, fetchInstances, year, semester }) {

  const viewInstanceDetails = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Instance details:', data);
      })
      .catch((error) => {
        console.error('Error fetching instance details:', error);
      });
  };

  const deleteInstance = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetchInstances())  // Refresh the instance list after deletion
      .catch((error) => {
        console.error('Error deleting instance:', error);
      });
  };

  return (
    <div>
      <form className="form" onSubmit={(e) => {e.preventDefault(); fetchInstances();}}>
        <button type="submit">List Instances</button>
      </form>
      
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
