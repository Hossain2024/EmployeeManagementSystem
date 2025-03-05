import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/Email')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <h1>Employee Emails</h1>
      <ul>
        {data.map((item) => (
          <li key={item.EmployeeID}>
            <strong>Email:</strong> {item.EmailAdress} <br />
            <strong>Employee ID:</strong> {item.EmployeeID} <br />
            <strong>Type:</strong> {item.Type}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
