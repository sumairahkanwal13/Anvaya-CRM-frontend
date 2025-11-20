import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await fetch(
          `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}`
        );
        const data = await res.json();

        setLead(data);
        setComments(data.comments || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load lead details...");
        setLoading(false);
      }
    }
    fetchLead();
  }, [id]);

  
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newComment, author: authorId, }),
        }
      );

      const data = await res.json();
      setComments([...comments, data]);
      setNewComment("");
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading Lead Details...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!lead) return <p className="text-center mt-5">Lead not found.</p>;

  return (
    <div className="container mt-4">

      
      <h2 className="text-center border-bottom pb-2 mb-4">
        Lead Management: {lead.name}
      </h2>

      
      <div className="mb-3">
        <Link to="/leadList" className="btn btn-secondary">
          Back to Lead List
        </Link>
      </div>

      
      <div className="card p-4 shadow-sm mb-4">
        <h4 className="border-bottom pb-2 mb-3">Lead Details</h4>

        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Sales Agent:</strong> {lead.salesAgent?.name || "Not Assigned"}</p>
        <p><strong>Lead Source:</strong> {lead.source}</p>
        <p><strong>Lead Status:</strong> {lead.status}</p>
        <p><strong>Priority:</strong> {lead.priority}</p>
        <p><strong>Time to Close:</strong> {lead.timeToClose} days</p>

        <button className="btn btn-primary mt-3">Edit Lead Details</button>
      </div>

      
      <div className="card p-4 shadow-sm mb-5">
        <h4 className="border-bottom pb-2 mb-3">Comments</h4>

        {comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="border rounded p-2 mb-3">
              <p className="mb-1">
                <strong>{c.author || "Anonymous"}</strong>
              </p>
              <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
                {new Date(c.createdAt).toLocaleString()}
              </p>
              <p className="mb-0">{c.text}</p>
            </div>
          ))
        )}

        
        <textarea
          className="form-control"
          rows="3"
          placeholder="Add a new comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>

        <button
          className="btn btn-success mt-2"
          onClick={handleCommentSubmit}
        >
          Submit Comment
        </button>
      </div>
    </div>
  );
}
