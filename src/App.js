import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dashboard from './pages/Dashboard';
import LeadForm from './pages/LeadForm';
import LeadDetails from './pages/LeadDetails';
import LeadList from './pages/LeadList';
import SalesAgentsList from './pages/SalesAgenstList';
import AddSalesAgent from './pages/AddSalesAgent';
import Report from './pages/Report';
import LeadStatusView from './pages/LeadStatusView';
import SalesAgentDetails from './pages/SalesAgentDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Dashboard/>}/>
        <Route path="/leadForm" element={<LeadForm/>}/>
        <Route path="/leadList" element={<LeadList/>}/>
        <Route path="/leadDetails/:id" element={<LeadDetails/>}/>
        <Route path='/salesAgentsList' element={< SalesAgentsList/>}/>
        <Route path='/addSalesAgent' element={<AddSalesAgent/>}/>
        <Route path='/leadStatusView' element={<LeadStatusView/>}/>
        <Route path='/salesAgentDetails' element={<SalesAgentDetails/>}/>
        <Route path='/report' element={<Report/>}/>
      </Routes>
    </Router>
  );
}

export default App;
