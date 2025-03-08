/**
 * 
 * Main page contains navigations to each page
 */
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProjectList from './projectcomponent';
import AssignProjectForm from './assignprojectform';
import AssignedProject from './Assingedprojects';
import  ApprovedLeaveRequests from './leaverequestcomponent'
import PendingLeaveRequests from './onleavecomponent'
import AssignTrainingForm from './assigntrainingform'
import AssignedTrainingTable from './trainingdata'
import LeavesRequestList from './sortedleaves.jsx'
function App() {
  return (
    <Router>
      <div>
        <h1>Employee Management System</h1>

        {/* Main Landing page*/}
        <div>
          <button>
            <Link to="/employees" style={{ textDecoration: 'none', color: 'black' }}>
              Employee
            </Link>
          </button>
          <button>
            <Link to="/update" style={{ textDecoration: 'none', color: 'black' }}>
              Update Employee
            </Link>
          </button>
          <button>
            <Link to="/attendance-status" style={{ textDecoration: 'none', color: 'black' }}>
              Attendance
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
          <button>
            <Link to="/benefits" style={{ textDecoration: 'none', color: 'black' }}>
              Employee Benefits
            </Link>
          </button>
        </div>

        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees data={data} />} />
          <Route path="/update" element={<UpdateInfo data={data} />} />
          <Route path="/attendance-status" element={<AttendanceStatus data={data} />} />
          <Route path="/projects" element={<Projects data={data} />} />
          <Route path="/leaves" element={<Leaves />} >
            <Route path="leave-requests" element={<LeaveRequests />} />
            <Route path="on-leave" element={<OnLeave />} />
          </Route>
          <Route path="/training" element={<Training />} ></Route>
          <Route path="/analysis" element={<Analysis />} ></Route>
          <Route path="/roles" element={<Roles />} ></Route>
          <Route path="/departments" element={<Departments />} ></Route>
          <Route path="/benefits" element={<EmployeeBenefits />} ></Route>
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

// Employee info page
function Employees({ data }) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <h2>Employee Information</h2>
      <button onClick={openModal}>Add Employee</button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            {/* Blank content for now */}
          </div>
        </div>
      )}

      {/* Styling for Larger Modal */}
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
/**
 * 
 * @param {data} param0 
 * @returns the content of the update info tab
 */
function UpdateInfo({ data }) {
  return (
    <div>
      <h2>Update Employee Information</h2>
    </div>
  );
}

/**
 * 
 * @param {data} param0 
 * @returns attendance data  
 */
function AttendanceStatus({ data }) {
  return (
    <div>
      <h2>Attendance</h2>
    </div>
  );
}
/**
 * this tab allows users to assign a project and see a list of project and  see a list of assignedproject 
 * along with the emplyees working on that project
 * @returns content of project tab
 */
function Projects() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <h2>Projects</h2>
      <button onClick={openModal}>Assign Project</button>
      {<ProjectList />}
      {<AssignedProject />}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            {<AssignProjectForm />} {/** form component to assign a project*/}
          </div>
        </div>
      )}

      {/* Styling for Larger Modal */}
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

/**
 * shows enployees who has submitted leaverequests and pending 
 * @returns pendingLeaveRequest
 */
function LeaveRequests() {
  return (
    <div>
      <h2>Leave Requests</h2>
      <PendingLeaveRequests/>
      
    </div>
  );
}
/**
 * shows employees who are on leave 
 * @returns ApprovedLeaverequestcomponent
 */
function OnLeave() {
  return (
    <div>
      <h2>Employees on Leave</h2>
      {<ApprovedLeaveRequests />}
    </div>
  );
}
/**
 * In this tab user will be able to add 
 * @returns trainingcomponent
 */
function Training() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <h2>Projects</h2>
      <button onClick={openModal}>Add Training</button>
      {<AssignedTrainingTable />} {/*assigned trainging table*/}
      
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            {<AssignTrainingForm />} {/** form to assign table */}
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

/**
 * retuns the number of leave request each employee made
 * @returns LeavesRequestList component 
 */
function Analysis() {
  return (
    <div>
      <h2>Analysis</h2>
      {<LeavesRequestList/>}  
    </div>
  );
}


function Roles() {
  return (
    <div>
      <h2>Roles</h2>
    </div>
  );
}

function Departments() {
  return (
    <div>
      <h2>Departments</h2>
    </div>
  );
}

function EmployeeBenefits() {
  return (
    <div>
      <h2>Benefits</h2>
    </div>
  );
}


export default App;
