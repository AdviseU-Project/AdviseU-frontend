import React, { useState, useEffect } from "react";

interface Course {
  course_number: string;
  course_name: string;
  credits: string;
  description: string;
  prerequisites: string;
  corequisites: string;
}

const Catalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch available departments
  useEffect(() => {
    fetch("http://localhost:8080/catalogs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch departments.");
        }
        return response.json();
      })
      .then((data) => setDepartments(data))
      .catch((error) => {
        setError("Error fetching departments: " + error.message);
        console.error(error);
      });
  }, []);

  // Fetch courses based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      fetch(`http://localhost:8080/catalog?department=${selectedDepartment}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch catalog.");
          }
          return response.json();
        })
        .then((data) => setCourses(data))
        .catch((error) => {
          setError("Error fetching catalog: " + error.message);
          console.error(error);
        });
    }
  }, [selectedDepartment]);

  return (
    <div>
      <h1>Course Catalog</h1>

      {/* Display any errors */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Department Selection Dropdown */}
      <label htmlFor="department">Choose a department:</label>
      <select
        id="department"
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
      >
        <option value="">Select a department</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* Display courses if a department is selected */}
      {selectedDepartment && (
        <div>
          <h2>Courses in {selectedDepartment} Department</h2>
          <ul>
            {courses.map((course) => (
              <li key={course.course_number}>
                <h3>
                  {course.course_number}: {course.course_name}
                </h3>
                <p>Credits: {course.credits}</p>
                <p>{course.description}</p>
                <p>Prerequisites: {course.prerequisites}</p>
                <p>Corequisites: {course.corequisites}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Catalog;
