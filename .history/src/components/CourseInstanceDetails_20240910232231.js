import React from 'react';

const CourseInstanceDetails = ({ instance, fetchInstances }) => {

    const deleteInstance = (id) => {
        if (!window.confirm("Are you sure you want to delete this course instance?")) {
            return;
        }

        fetch(`http://127.0.0.1:8000/api/instances/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert("Instance deleted successfully.");
            fetchInstances();  // Refresh the instance list after deletion
        })
        .catch((error) => {
            console.error('Error deleting instance:', error);
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
