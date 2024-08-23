import React from 'react';

const CourseDetails = ({ course }) => {
    return (
        <div>
            <h3>Course Details</h3>
            <p><strong>Title:</strong> {course.title}</p>
            <p><strong>Course Code:</strong> {course.course_code}</p>
            <p><strong>Description:</strong> {course.description}</p>
        </div>
    );
};

export default CourseDetails;
