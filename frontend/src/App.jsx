import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import AlumniDashboard from "./components/AlumniDashboard";
import Company from "./components/Company";
import "./css/OverallStyle.css";
import UserDashboard from "./components/UserDasboard";
import JobForm from "./components/JobForm";
import UserList from "./Data_Retrieval/UserList";
import JobList from "./Data_Retrieval/JobList";
import ContactUs from "./components/ContactUs";
import Events from "./components/Events";
import EventList from "./Data_Retrieval/EventList";
import CompanyList from "./Data_Retrieval/CompanyList";
import AlumniInfo from "./components/AlumniInfo";
import AlumniList from "./Data_Retrieval/AlumniList";
import CompanyOwnerDashboard from "./components/CompanyOwner";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/alumnidashboard" element={<AlumniDashboard />} />
        <Route path="/company" element={<Company />} />
        <Route path="/alumni" element={<AlumniInfo />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/job" element={<JobForm />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/joblist" element={<JobList />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/eventlist" element={<EventList />} />
        <Route path="/companylist" element={<CompanyList />} />
        <Route path="/alumnilist" element={<AlumniList />} />
        <Route path="/companyowner" element={<CompanyOwnerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;