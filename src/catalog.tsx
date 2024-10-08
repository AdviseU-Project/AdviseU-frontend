import React, { useState, useEffect } from "react";

interface Course {
  course_number: string;
  course_name: string;
  credits: number;
  description: string;
  prerequisites: string;
  corequisites: string;
}

const Catalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/catalog")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching catalog:", error));
  }, []);

  return (
    <div>
      <h1>Course Catalog</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.course_number}>
            <h2>
              {course.course_number}: {course.course_name}
            </h2>
            <p>Credits: {course.credits}</p>
            <p>{course.description}</p>
            <p>Prerequisites: {course.prerequisites}</p>
            <p>Corequisites: {course.corequisites}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;
