import useFetch from "../useFetch";
import { useState } from "react";

export default function LeadStatusView() {
  const { data: Lead, loading, error } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/leads",
    []
  );
  const { data: agents } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/agents",
    []
  );

  const [status, setStatus] = useState("New");
  const [agentFilter, setAgentFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4">Error occurred while fetching data.</p>;

  
  let filteredLeads = Lead.filter((lead) => lead.status === status);

  console.log("find agent's id:", agents)
  if (agentFilter !== "All") {
    filteredLeads = filteredLeads.filter((lead) => lead.salesAgent?.id === agentFilter);
  }

  if (priorityFilter !== "All") {
    filteredLeads = filteredLeads.filter((lead) => lead.priority === priorityFilter);
  }

  filteredLeads.sort((a, b) => {
    return sortOrder === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div className="flex-grow-1 px-4 mt-4">
      <h3 className="text-center mb-4">Leads by Status</h3>

      
      <div className="card mb-4 p-3">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="fw-bold">Status:</label>
            <select
              className="form-select mt-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="fw-bold">Sales Agent:</label>
            <select
              className="form-select mt-2"
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="All">All Agents</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="fw-bold">Priority:</label>
            <select
              className="form-select mt-2"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="fw-bold">Sort by:</label>
            <select
              className="form-select mt-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="card p-3">
        <h4 className="mb-3">Status: {status}</h4>
        {filteredLeads.length === 0 ? (
          <p>No leads found for this status.</p>
        ) : (
          <ul className="list-group">
            {filteredLeads.map((lead) => (
              <li key={lead._id} className="list-group-item">
                <strong>{lead.name}</strong>
                <br />
                <span className="text-muted">
                  Sales Agent: {lead.salesAgent?.name || "Not Assigned"}
                </span>
                <br />
                <span className="badge bg-info mt-1">Priority: {lead.priority}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
