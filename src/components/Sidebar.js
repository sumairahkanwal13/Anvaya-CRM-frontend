import { Link } from "react-router-dom";

 export default function Sidebar(){
    return (
        <div className=" p-3 vh-100 mt-1" style={{width: "250px"}}>
            <ul className="nav flex-column">

                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/">Deshboard</Link>
                </li>
                
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/leadList">Leads</Link>
                </li>

                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/leadStatusView">Lead Status</Link>
                </li>
                
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/salesAgentsList">Sales Agent</Link>
                </li>

                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/salesAgentDetails">Sales Agent Status</Link>
                </li>
                
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/report">Report</Link>
                </li>
            
            </ul>
        </div>
    )
 }