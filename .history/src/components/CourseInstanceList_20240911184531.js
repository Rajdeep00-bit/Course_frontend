import React from 'react';

function CourseInstanceList({ instances, setInstances, year, semester }) {

  // Fetch instance details (for display or debugging)
  const viewInstanceDetails = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${year}/${semester}/${id}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Instance not found: ${response.status}`); // Throw error if response is not OK
        }
        return response.json();
      })
      .then(data => {
        console.log('Instance details:', data);  // Log or display instance details
      })
      .catch((error) => {
        console.error('Error fetching instance details:', error);
        alert('Failed to fetch instance details. Make sure the instance exists.');
      });
  };
  

  // Function to delete the instance
  const deleteInstance = (id) => {
    const currentYear = year || 2023;  // Set a default year
    const currentSemester = semester || 1;  // Set a default semester

    // Clean the ID: remove any spaces, newlines, or unwanted characters
    const cleanId = id.toString().trim();

    console.log(`Attempting to delete instance with ID: ${cleanId}`);
    
    const url = `http://127.0.0.1:8000/api/instances/${currentYear}/${currentSemester}/${cleanId}/`;  // Trailing slash

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            const updatedInstances = instances.filter(instance => instance.id !== cleanId);
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
              <button onClick={() => deleteInstance(instance.id)}>Delete</button> {/* Delete without confirmation */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CourseInstanceList;
