import { useState } from "react";
import useFetch from "../useFetch";

export default function SalesAgentDetails() {
  const { data: Lead, loading, error } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/leads",
    []
  );
  const { data: agents } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/agents",
    []
  );

  const [selectedAgent, setSelectedAgent] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error || !Array.isArray(Lead)) return <p>Error loading agent data.</p>;

  let filteredLeads = Lead;

  if (selectedAgent !== "All") {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.salesAgent?.id === selectedAgent
    );
  }

  if (statusFilter !== "All") {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.status === statusFilter
    );
  }

  if (priorityFilter !== "All") {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.priority === priorityFilter
    );
  }

  //if (sortOrder === "newest") {
    //filteredLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //} else {
    //filteredLeads.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  //}

  filteredLeads.sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="flex-grow-1 px-4 mt-4">
      <h2 className="text-center mb-4">Leads by Sales Agent</h2>

      <div className="card p-3 mb-4">
        <label className="fw-bold">Sales Agent:</label>
        <select
          className="form-select mt-2"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
        >
          <option value="All">All Agents</option>
          {agents?.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-3 mb-4">
        <div className="row">
          <div className="col-md-4">
            <label className="fw-bold">Filter by Status:</label>
            <select
              className="form-select mt-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="fw-bold">Filter by Priority:</label>
            <select
              className="form-select mt-2"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="col-md-4">
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

      <div className="card p-3">
        <h4 className="mb-3">
          {selectedAgent === "All"
            ? "All Leads"
            : `Sales Agent: ${
                agents?.find((a) => a._id === selectedAgent)?.name
              }`}
        </h4>

        {filteredLeads.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          <ul className="list-group">
            {filteredLeads.map((lead) => (
              <li key={lead._id} className="list-group-item">
                <strong>{lead.name}</strong>
                <br />
                <span>Status: {lead.status}</span>
                <br />
                <span className="badge bg-info mt-1">
                  Priority: {lead.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
