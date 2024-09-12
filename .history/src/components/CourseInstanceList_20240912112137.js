import React from 'react';

function CourseInstanceList({ instances, setInstances, year, semester, deleteInstance }) {

  return (
    <div className="course-instance-list">
      <table>
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Year-Sem</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {instances.length === 0 ? (
            <tr>
              <td colSpan="4">No instances found for the given year and semester.</td>
            </tr>
          ) : (
            instances.map((instance) => (
              <tr key={instance.id}>
                {/* Check if instance.course exists and has a title */}
                <td>{instance.course ? instance.course.title : "No course title"}</td>
                <td>{`${instance.year}-${instance.semester}`}</td>
                <td>{instance.code ? instance.code : "No code available"}</td> {/* Check if code exists */}
                <td>
                  <button onClick={() => deleteInstance(instance.id)} className="action-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CourseInstanceList;
