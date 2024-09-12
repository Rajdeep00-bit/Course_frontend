import React from 'react';

function CourseInstanceList({ instances, setInstances, year, semester }) {

  // Fetch instance details (for display or debugging)
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

  // Delete an instance and update the state
  const deleteInstance = (id) => {
    if (!window.confirm('Are you sure you want to delete this instance?')) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/instances/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // Remove the deleted instance from the state
        const updatedInstances = instances.filter(instance => instance.id !== id);
        setInstances(updatedInstances); // Update state with new array
        alert('Instance deleted successfully.');
      } else {
        throw new Error('Failed to delete instance');
      }
    })
    .catch((error) => {
      console.error('Error deleting instance:', error);
      alert('Failed to delete the instance. Please try again.');
    });
  };

  return (
    <div>
      <form className="form" onSubmit={(e) => { e.preventDefault(); }}>
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
