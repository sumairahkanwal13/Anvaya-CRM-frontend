import { useState } from "react";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";

export default function LeadList() {
  const [status, setStatus] = useState("");
  const [salesAgent, setSalesAgent] = useState("");
  const [sort, setSort] = useState("");

  
  const { data: Lead, loading, error } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/leads",
    []
  );

  const { data: agents } = useFetch(
    "https://anvaya-crm-backend-rosy.vercel.app/agents",
    []
  );

  if (loading) return <p className="text-center mt-5">Loading Leads...</p>;
  if (error) return <p className="text-center mt-5">Error occurred while fetching data.</p>;

  

  let filteredLeads = [...Lead];

  if (status) {
    filteredLeads = filteredLeads.filter((lead) => lead.status === status);
  }

  if (salesAgent) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.salesAgent?.id === salesAgent
    );
  }

  if (sort === "asc") {
    filteredLeads.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "desc") {
    filteredLeads.sort((a, b) => b.name.localeCompare(a.name));
  }

 

  return (
    <div className="flex-grow-1 px-2">
      <h2 className="text-center mb-4">Lead List</h2>

      
      <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">

        <select
          className="form-select w-auto"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          className="form-select w-auto"
          value={salesAgent}
          onChange={(e) => setSalesAgent(e.target.value)}
        >
          <option value="">Filter by Sales Agent</option>
          {agents?.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>

        <select
          className="form-select w-auto"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="asc">Oldest</option>
          <option value="desc">Newest</option>
        </select>
      </div>

      
      <div className="row g-3">
        {filteredLeads.length === 0 ? (
          <p className="text-center mt-4">No leads found.</p>
        ) : (
          filteredLeads.map((lead) => (
            <div className="col-md-4" key={lead._id}>
              <div className="card p-3 shadow-sm">
                <h5>{lead.name}</h5>
                <p>Status: {lead.status}</p>
                <p>Sales Agent: {lead.salesAgent?.name || "Unassigned"}</p>

                <Link to={`/leadDetails/${lead.id}`} className="btn btn-primary w-100">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
