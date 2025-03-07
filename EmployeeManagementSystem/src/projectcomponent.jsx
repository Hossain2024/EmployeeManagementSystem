import { useState, useEffect } from 'react';

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  
    return (
      <div>
        <h2>Projects</h2>
        <ul> {/* Wrap the list items in <ul> */}
          {projects.map((project) => (
            <li key={project.ProjectID}>
              <strong>Project Name:</strong> {project.ProjectName} <br />
              <strong>Department Name:</strong> {project.DepartmentName} <br />
            </li>
          ))}
        </ul>
      </div>
    );
}

export default ProjectList;
