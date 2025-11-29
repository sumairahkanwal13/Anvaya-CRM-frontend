import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AddSalesAgent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [existingEmail, setExistingEmail] = useState([]);

  useEffect(() => {
    const fetchExistingEmails = async () => {
      try {
        const response = await fetch(
          "https://anvaya-crm-backend-rosy.vercel.app/agents"
        );
        if (!response.ok) throw new Error("Failed to fetch agents.");
        const data = await response.json();
        const emails = data.map((agent) => agent.email);
        setExistingEmail(emails);
      } catch (error) {
        console.error("Error fetching agent: ", error);
        toast.error("Failed to load agents.");
      }
    };
    fetchExistingEmails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingEmail.includes(formData.email)) {
      toast.error("This email already exists. Please choose another.");
      return;
    }

    try {
      const response = await fetch(
        "https://anvaya-crm-backend-rosy.vercel.app/agents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add new agent.");
      }

      const data = await response.json();
      console.log("New agent added:", data);

      toast.success("New agent added successfully!");

      // Reset form
      setFormData({ name: "", email: "" });

      // Update email list instantly
      setExistingEmail((prev) => [...prev, formData.email]);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the agent.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Add New Sales Agent</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Agent Name:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter agent's name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter agent's email"
                  required
                />
              </div>

              <button className="btn btn-success w-100" type="submit">
                Create Agent
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
