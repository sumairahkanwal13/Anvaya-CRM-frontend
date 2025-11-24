import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: Lead, loading, error } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/leads",
    []
  );

  const { data: report } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/report/pipeline",
    {
      new: 0,
      contacted: 0,
      qualified: 0,
    }
  );

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error)
    return <p className="text-center mt-5">Error occurred while fetching data.</p>;

  return (
    <div className="px-4 mt-4">
      <h2 className="text-center mb-4">Anvaya CRM Dashboard</h2>

      
      <div className="mb-4">
        <h4 className="mb-3">Leads Overview</h4>

        <div className="d-flex flex-wrap gap-3">
          {Lead.slice(0, 3).map((lead) => (
            <div
              key={lead._id || lead.name}
              className="card p-3 shadow-sm"
              style={{ width: "220px" }}
            >
              <h6 className="mb-2">{lead.name}</h6>
              <p className="small mb-1">Status: {lead.status}</p>
              <p className="small text-muted">Priority: {lead.priority}</p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Lead Status Summary</h5>
        <ul className="list-unstyled mt-3">
          <li className="mb-2">
            New: <span className="badge bg-success">{report?.new ?? 0}</span>
          </li>

          <li className="mb-2">
            Contacted:{" "}
            <span className="badge bg-warning text-dark">
              {report?.contacted ?? 0}
            </span>
          </li>

          <li className="mb-2">
            Qualified:{" "}
            <span className="badge bg-info text-dark">
              {report?.qualified ?? 0}
            </span>
          </li>
        </ul>
      </div>

      
      <div className="d-flex align-items-center justify-content-between mt-3">
        <div>
          <span className="badge bg-success me-2 px-3 py-2">New</span>
          <span className="badge bg-warning text-dark me-2 px-3 py-2">
            Contacted
          </span>
          <span className="badge bg-info text-dark me-2 px-3 py-2">
            Qualified
          </span>
        </div>

        <Link to="/leadForm" className="btn btn-primary px-4">
          Add New Lead
        </Link>
      </div>
    </div>
  );
}
