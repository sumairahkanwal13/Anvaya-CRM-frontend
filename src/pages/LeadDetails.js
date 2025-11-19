import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function LeadDetails() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Lead + Comments
  useEffect(() => {
    fetchLead();
    fetchComments();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leads/${id}`);
      setLead(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching lead:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
      setComments(res.data);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/comments", {
        leadId: id,
        text: newComment,
        author: "Admin", // replace with logged-in user later
      });

      setNewComment("");
      fetchComments(); // refresh comments instantly
    } catch (error) {
      console.log("Error posting comment:", error);
    }
  };

  if (loading || !lead) return <p>Loading lead...</p>;

  return (
    <div className="container mt-4">

      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lead Management: {lead.name}</h2>
        <Link to="/leadList" className="btn btn-secondary">Back to Leads</Link>
      </div>

      <div className="row">

        {/* LEFT SIDEBAR (BACK / DASHBOARD) */}
        <div className="col-3">
          <div className="list-group">
            <Link to="/" className="list-group-item list-group-item-action">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* MAIN LEAD DETAILS */}
        <div className="col-9">
          <div className="card p-3 shadow-sm">
            <h4>Lead Details</h4>

            <p><strong>Lead Name:</strong> {lead.name}</p>
            <p><strong>Sales Agent:</strong> {lead.salesAgent?.name || "Not Assigned"}</p>
            <p><strong>Lead Source:</strong> {lead.leadSource}</p>
            <p><strong>Lead Status:</strong> {lead.leadStatus}</p>
            <p><strong>Priority:</strong> {lead.priority}</p>
            <p><strong>Time to Close:</strong> {lead.timeToClose || "N/A"}</p>

            <Link
              to={`/leadForm?id=${lead._id}`}
              className="btn btn-primary mt-2"
            >
              Edit Lead Details
            </Link>
          </div>

          {/* COMMENTS SECTION */}
          <div className="card p-3 mt-4 shadow-sm">
            <h4>Comments</h4>

            {/* LIST OF COMMENTS */}
            <div className="mt-3">
              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="border p-2 mb-2 rounded">
                    <p><strong>{c.author}</strong> – {new Date(c.createdAt).toLocaleString()}</p>
                    <p>{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* ADD COMMENT */}
            <form onSubmit={handleCommentSubmit} className="mt-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>

              <button type="submit" className="btn btn-success mt-2">
                Submit Comment
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
