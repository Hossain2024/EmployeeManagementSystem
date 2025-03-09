

function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error('Error fetching departments:', err));
  }, []);

  return (
    <div>
      <h2>Departments</h2>
      <table>
        <thead>
          <tr>
            <th>Department ID</th>
            <th>Department Name</th>
            <th>Description</th>
            <th>Number of Employees</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.DepartmentID}>
              <td>{dept.DepartmentID}</td>
              <td>{dept.Dept_Name}</td>
              <td>{dept.Dept_Description}</td>
              <td>{dept.Num_Of_Employees}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>
        {`
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
    </style>
  </div>
  );
}

export default Departments