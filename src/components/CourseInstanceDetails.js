import React from 'react';

const CourseInstanceDetails = ({ instance }) => {
    return (
        <div>
            <h3>Course Instance Details</h3>
            <p><strong>Course:</strong> {instance.course.title}</p>
            <p><strong>Year:</strong> {instance.year}</p>
            <p><strong>Semester:</strong> {instance.semester}</p>
        </div>
    );
};

export default CourseInstanceDetails;
