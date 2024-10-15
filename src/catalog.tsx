import React, { useState, useEffect } from "react";
import Select from "react-select";

interface Course {
  course_number: string;
  course_name: string;
  credits: string;
  description: string;
  prerequisites: string[][];
  corequisites: string[][];
}

// Helper function to format prerequisites/corequisites
const formatRequisites = (requisites: string[][]) => {
  return requisites.map((group, index) => {
    const groupText = group.join(" or ");

    // If there are multiple groups, add parentheses around each group for "and"
    const formattedGroup = requisites.length > 1 ? `(${groupText})` : groupText;

    return (
      <span key={index}>
        {formattedGroup} {index < requisites.length - 1 && " and "}
      </span>
    );
  });
};

const Catalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedDepartment, setSelectedDepartment] = useState<{
    value: string;
    label: string;
  } | null>(null);
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
      .then((data) =>
        setDepartments(
          data.map((dept: string) => ({
            value: dept,
            label: dept.toUpperCase(),
          }))
        )
      )
      .catch((error) => {
        setError("Error fetching departments: " + error.message);
        console.error(error);
      });
  }, []);

  // Fetch courses based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      fetch(
        `http://localhost:8080/catalog?department=${selectedDepartment.value}`
      )
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
      <Select
        id="department"
        options={departments} // The options are populated here
        value={selectedDepartment} // The current selected value
        onChange={(selectedOption) => setSelectedDepartment(selectedOption)} // Handle selection change
        isClearable // Allow clearing the selection
        placeholder="Select a department..." // Placeholder text
      />

      {/* Display courses if a department is selected */}
      {selectedDepartment && (
        <div>
          <h2>Courses in {selectedDepartment.label} Department</h2>
          <ul>
            {courses.map((course) => (
              <li key={course.course_number}>
                <h3>
                  {course.course_number}: {course.course_name}
                </h3>
                <p>Credits: {course.credits}</p>
                <p>{course.description}</p>
                <p>
                  <strong>Prerequisites: </strong>
                  {course.prerequisites.length > 0
                    ? formatRequisites(course.prerequisites)
                    : "None"}
                </p>
                <p>
                  <strong>Corequisites: </strong>
                  {course.corequisites.length > 0
                    ? formatRequisites(course.corequisites)
                    : "None"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Catalog;
