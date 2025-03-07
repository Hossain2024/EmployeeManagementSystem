import { useState, useEffect } from 'react';
import './projectlist.css'

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  
    return (
      <div className="project-container">
      <h2 className="project-header">Projects</h2>
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Department Name</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.ProjectID}>
              <td>{project.ProjectName}</td>
              <td>{project.DepartmentName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
}

export default ProjectList;
