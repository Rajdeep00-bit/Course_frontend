import React from 'react';

function CourseInstanceList({ instances, setInstances, year, semester }) {

  // Fetch instance details (for display or debugging)
  const viewInstanceDetails = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Instance details:', data);  // Log or display instance details
      })
      .catch((error) => {
        console.error('Error fetching instance details:', error);
      });
  };

  const deleteInstance = (id) => {
    const currentYear = year || 2023;  // Set a default year
    const currentSemester = semester || 1;  // Set a default semester
    
    console.log(`Attempting to delete instance with ID: ${id}`);
    
    fetch(`http://127.0.0.1:8000/api/instances/${currentYear}/${currentSemester}/${id}/`, {  // Added trailing slash
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.ok) {
        const updatedInstances = instances.filter(instance => instance.id !== id);
        setInstances(updatedInstances);  // Update state with the new instance list
        console.log('Instance deleted successfully');
      } else {
        return response.json().then(errorData => {
          console.error('Failed to delete instance:', response.status, errorData);
        });
      }
    })
    .catch((error) => {
      console.error('Error deleting instance:', error);
    });
  };
  
  
  
  
  
  
  

  return (
    <div>
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
