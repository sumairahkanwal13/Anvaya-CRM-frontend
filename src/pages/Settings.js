import { useState, useEffect } from "react";

export default function Settings() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); 

  
  const fetchLeads = async () => {
    const res = await fetch("https://anvaya-crm-backend-rosy.vercel.app/leads");
    const data = await res.json();
    setLeads(data);
  };

  
  const fetchAgents = async () => {
    const res = await fetch("https://anvaya-crm-backend-rosy.vercel.app/agents");
    const data = await res.json();
    setAgents(data.map(a => ({ ...a, id: a._id })));
  };

  
  useEffect(() => {
    const load = async () => {
      await fetchLeads();
      await fetchAgents();
      setLoading(false);
    };
    load();
  }, []);

 
  const confirmDelete = (type, id) => {
    setDeleteTarget({ type, id: id.trim() });
    setShowModal(true);
  };

  
  const handleDelete = async () => {
  if (!deleteTarget) return;

  const { type, id } = deleteTarget;
  const cleanId = id.trim();

  const endpoint =
    type === "lead"
      ? `https://anvaya-crm-backend-rosy.vercel.app/leads/${cleanId}`
      : `https://anvaya-crm-backend-rosy.vercel.app/agents/${cleanId}`;


  try {
    const res = await fetch(endpoint, { method: "DELETE",});
    const data = await res.json();

    if (!res.ok) {
      console.error("Delete failed:", data.error || data);
      alert(`Delete failed: ${data.error || "Unknown error"}`);
      return;
    }

    if (type === "lead") {
      setLeads((prev) => prev.filter((item) => item.id !== id));
    } else {
      setAgents((prev) => prev.filter((item) => item._id !== id));
    }

    setShowModal(false);
    setDeleteTarget(null);
    alert(`${type} deleted successfully!`);
  } catch (err) {
    alert("Failed to delete. Please try again.");
  }
};


  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <h2 className="text-center mb-4">Settings</h2>

      
      <h4 className="mt-3 mb-2">Manage Leads</h4>
      <div className="card p-3 mb-4">
        {leads.length === 0 && <p>No leads found.</p>}

        {leads.map((lead) => (
          <div
            key={lead._id}
            className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{lead.name}</strong>
              <p className="mb-0">{lead.email}</p>
              <p className="mb-0">Status: {lead.status}</p>
            </div>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => confirmDelete("lead", lead.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      
      <h4 className="mt-4 mb-2">Manage Agents</h4>
      <div className="card p-3 mb-4">
        {agents.length === 0 && <p>No agents found.</p>}

        {agents.map((agent) => (
          <div
            key={agent._id}
            className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{agent.name}</strong>
              <p className="mb-0">{agent.email}</p>
            </div>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => confirmDelete("agent", agent._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title text-danger">Confirm Delete</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button> 
              </div>

              <div className="modal-body">
                Are you sure you want to delete this{" "}
                <strong>{deleteTarget?.type}</strong>?
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}