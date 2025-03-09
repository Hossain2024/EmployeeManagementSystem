import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Employees from './Employees';
import Managers from './Managers';
import Roles from './Roles';
import Departments from './Departments';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/Email')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <Router>
      <div>
        <h1>Employee Management System</h1>

        {/* Main Landing page*/}
        <div>
          <button>
            <Link to="/employees" style={{ textDecoration: 'none', color: 'black' }}>
              Employees
            </Link>
          </button>
          <button>
            <Link to="/managers" style={{ textDecoration: 'none', color: 'black' }}>
              Managers
            </Link>
          </button>
          <button>
            <Link to="/projects" style={{ textDecoration: 'none', color: 'black' }}>
              Projects
            </Link>
          </button>
          <button>
            <Link to="/leaves" style={{ textDecoration: 'none', color: 'black' }}>
              Leaves
            </Link>
          </button>
          <button>
            <Link to="/training" style={{ textDecoration: 'none', color: 'black' }}>
              Training
            </Link>
          </button>
          <button>
            <Link to="/analysis" style={{ textDecoration: 'none', color: 'black' }}>
              Analysis
            </Link>
          </button>
          <button>
            <Link to="/roles" style={{ textDecoration: 'none', color: 'black' }}>
              Roles
            </Link>
          </button>
          <button>
            <Link to="/departments" style={{ textDecoration: 'none', color: 'black' }}>
              Departments
            </Link>
          </button>
        </div>

        {/* Define routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees data={data} />} />
          <Route path="/managers" element={<Managers data={data} />} />
          <Route path="/projects" element={<Projects data={data} />} />
          <Route path="/leaves" element={<Leaves />} >
            <Route path="leave-requests" element={<LeaveRequests />} />
            <Route path="on-leave" element={<OnLeave />} />
          </Route>
          <Route path="/training" element={<Training />} ></Route>
          <Route path="/analysis" element={<Analysis />} ></Route>
          <Route path="/roles" element={<Roles />} ></Route>
          <Route path="/departments" element={<Departments />} ></Route>
        </Routes>
      </div>
    </Router>
  );
}

// Home page
function Home() {
  return (
    <div>
      <h2>Welcome to the Employee Management System</h2>
      <p>Select a page to view employee information.</p>
    </div>
  );
}

function Projects() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <h2>Projects</h2>
      <button onClick={openModal}>Add Project</button>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
          </div>
        </div>
      )}

      <style>
        {`
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

          .modal-content {
            background: white;
            width: 600px; /* Adjust width */
            height: 600px; /* Adjust height */
            padding: 30px;
            border-radius: 10px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .close-button {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}


function Leaves() {
  return (
    <div>
      <h2>Leaves</h2>
      <button>
        <Link to="leave-requests" style={{ textDecoration: 'none', color: 'black' }}>
          Leave Requests 
        </Link>
      </button>
      <button>
        <Link to="on-leave" style={{ textDecoration: 'none', color: 'black' }}>
          Employees on Leave
        </Link>
      </button>
      <Outlet /> 
    </div>
  );
}

function LeaveRequests() {
  return (
    <div>
      <h2>Leave Requests</h2>
    </div>
  );
}

function OnLeave() {
  return (
    <div>
      <h2>Employees on Leave</h2>
    </div>
  );
}

function Training() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <h2>Projects</h2>
      <button onClick={openModal}>Add Training</button>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
          </div>
        </div>
      )}
      <style>
        {`
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

          .modal-content {
            background: white;
            width: 600px; /* Adjust width */
            height: 600px; /* Adjust height */
            padding: 30px;
            border-radius: 10px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .close-button {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}

function Analysis() {
  return (
    <div>
      <h2>Analysis</h2>
    </div>
  );
}

export default App;
