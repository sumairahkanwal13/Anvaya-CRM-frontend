import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    tags: [],
    timeToClose: "",
    priority: "Medium",
  });

  const [agents, setAgents] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetch("https://anvaya-crm-backend-rosy.vercel.app/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data))
      .catch(() => setAgents([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://anvaya-crm-backend-rosy.vercel.app/leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add new lead.");
      }

      await response.json();
      toast.success("New Lead added successfully!");

      // Reset form after success
      setFormData({
        name: "",
        source: "",
        salesAgent: "",
        status: "",
        tags: [],
        timeToClose: "",
        priority: "Medium",
      });
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the lead. Please try again.");
    }
  };

  return (
    <div className="lead-form-page px-4 mt-4">
      <h2 className="text-center mb-4">Create New Lead</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Lead Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Lead Source:</label>
          <select
            name="source"
            className="form-select"
            value={formData.source}
            onChange={handleChange}
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Email">Email</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Sales Agent:</label>
          <select
            name="salesAgent"
            className="form-select"
            value={formData.salesAgent}
            onChange={handleChange}
          >
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Lead Status:</label>
          <select
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tags:</label>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAddTag}
            >
              Add Tag
            </button>
          </div>
        </div>

        {formData.tags.map((tag) => (
          <span
            key={tag}
            className="badge bg-success me-2"
            onClick={() => handleRemoveTag(tag)}
            style={{ cursor: "pointer" }}
          >
            {tag}
          </span>
        ))}

        <div className="mb-3 mt-3">
          <label className="form-label">Time to Close (days):</label>
          <input
            type="number"
            name="timeToClose"
            className="form-control"
            value={formData.timeToClose}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Priority:</label>
          <select
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <button className="btn btn-success w-100" type="submit">
          Add New Lead
        </button>
      </form>
    </div>
  );
}
