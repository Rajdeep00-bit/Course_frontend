import React, { useState } from 'react';
import CourseInstanceList from './CourseInstanceList'; // Ensure this path is correct

function ParentComponent() {
  const [instances, setInstances] = useState([]);
  
  // Ensure that the year and semester are properly set here
  const year = 2023;  // Replace with the correct year value
  const semester = 1;  // Replace with the correct semester value

  return (
    <div>
      <h1>Course Instances</h1>
      {/* Pass the year, semester, instances, and setInstances */}
      <CourseInstanceList
        instances={instances}
        setInstances={setInstances}
        year={year}
        semester={semester}
      />
    </div>
  );
}

export default ParentComponent;
