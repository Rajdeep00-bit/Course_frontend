import React from 'react';

function CourseInstanceList({ instances, setInstances, year, semester, fetchInstances }) {

  const deleteInstance = (id) => {
    fetch(`http://127.0.0.1:8000/api/instances/${id}`, {
      method: 'DELETE'
    })
    .then(() => fetchInstances())  // Use the passed fetchInstances function
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
