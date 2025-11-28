import { useState } from "react";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";

export default function LeadList() {
    const [status, setStatus] = useState("");
    const [salesAgent, setSalesAgent] = useState("");
    const [sort, setSort] = useState("");

    const { data: agents } = useFetch("https://anvaya-crm-backend-rosy.vercel.app/agents", []);

    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (salesAgent) queryParams.append("salesAgent", salesAgent);
    if (sort) queryParams.append("sort", sort);

    const apiUrl = `https://anvaya-crm-backend-rosy.vercel.app/leads?${queryParams.toString()}`;


    const { data: Lead, loading, error } = useFetch(apiUrl, []);
    console.log(Lead[1])

    if (loading) return<p className="text-center mt-5">Loading Leads...</p>;
    if (error) return <p className="text-center mt-5">Error occurred while fetching data.</p>;

    return (
        <div className="container-fluid px-4" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2 className="text-center mb-4">Lead List</h2>

            <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
                <select
                    className="form-select w-auto"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Filter by Status</option>
                    <option value="New">New</option>
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
                    <option value="Priority">Priority</option>
                    <option value="timeToClose">Time to Close</option>
                </select>

                <Link
                    className="text-decoration-none text-white btn btn-primary ms-auto"
                    to="/leadForm"
                >
                    Add New Lead
                </Link>
            </div>

            <div className="mb-4">
                <h4>Lead Overview</h4>
                <div className="d-flex flex-wrap gap-3">
                    {Lead.length > 0 ? (
                        Lead.map((lead) => {
                            const leadId = lead._id || lead.id;
                            return (
                                <div key={leadId} className="card p-3 shadow-sm mb-3">
                                    <p><strong>Name:</strong> {lead.name}</p>
                                    <p><strong>Status:</strong> {lead.status}</p>
                                    <p><strong>Sales Agent:</strong> {lead.salesAgent?.name || "N/A"}</p>
                                    <p><strong>Source:</strong> {lead.source}</p>

                                    {leadId ? (
                                        <Link to={`/leadDetails/${leadId}`}>
                                            View Details
                                        </Link>
                                    ) : (
                                        <p className="text-muted">ID not available</p>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-muted">No Lead Found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
