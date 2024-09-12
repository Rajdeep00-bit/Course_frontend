import React from 'react';

const CourseInstanceDetails = ({ instance, fetchInstances }) => {

    const deleteInstance = (id) => {
        if (!window.confirm("Are you sure you want to delete this course instance?")) {
            return;
        }

        // Sending the DELETE request
        fetch(`http://127.0.0.1:8000/api/instances/${id}`, {
            method: 'DELETE'
        })
        .then((response) => {
            if (response.ok) {
                // Refreshing the instance list after successful deletion
                fetchInstances();  
                alert("Instance deleted successfully.");
            } else {
                return response.json().then(err => Promise.reject(err));
            }
        })
        .catch((error) => {
            console.error('Error deleting instance:', error);
            alert("Failed to delete the instance. Please try again.");
        });
    };

    return (
        <div>
            <h3>Course Instance Details</h3>
            <p><strong>Course:</strong> {instance.course.title}</p>
            <p><strong>Year:</strong> {instance.year}</p>
            <p><strong>Semester:</strong> {instance.semester}</p>
            <button onClick={() => deleteInstance(instance.id)}>Delete Instance</button>
        </div>
    );
};

export default CourseInstanceDetails;
