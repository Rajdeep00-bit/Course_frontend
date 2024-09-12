import React from 'react';

function CourseInstanceList({ instances, courses, fetchInstances }) {
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
    return course ? { title: course.title, code: course.code } : { title: 'Unknown Course', code: 'N/A' };
  };

  return (
    <div className="course-instance-list">
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
              return (
                <tr key={instance.id}>
                  <td>{title}</td>
                  <td>{`${instance.year}-${instance.semester}`}</td>
                  <td>{code}</td>
                  <td>
                    <button onClick={() => handleDeleteInstance(instance.id, instance.year, instance.semester)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CourseInstanceList;
