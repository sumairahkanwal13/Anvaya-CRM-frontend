import useFetch from "../useFetch";
import { Link } from "react-router-dom";

export default function SalesAgentsList() {
  const { data: agents, loading, error } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/agents",
    []
  );

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4">Error fetching agents.</p>;

  return (
    <div className="flex-grow-1 px-4 mt-4">
      <h1 className="text-center mb-4">Sales Agent Management</h1>

      <div className="card p-4 shadow-sm mb-4">
        <h3 className="mb-3">Sales Agents List</h3>

        {agents.length === 0 ? (
          <p>No agents found.</p>
        ) : (
          <ul className="list-group">
            {agents.map((agent) => (
              <li
                key={agent._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{agent.name}</strong>
                  <br />
                  <small className="text-muted">{agent.email}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-end">
        <Link className="btn btn-primary" to="/addSalesAgent">
          Add New Agent
        </Link>
      </div>
    </div>
  );
}
