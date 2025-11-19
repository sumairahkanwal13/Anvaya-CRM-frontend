import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function LeadDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lead, setLead] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const API = "https://anvaya-crm-backend-rosy.vercel.app";

    // Fetch Lead Details
    useEffect(() => {
        fetch(`${API}/leads/${id}`)
            .then((res) => res.json())
            .then((data) => setLead(data))
            .catch((err) => console.log(err));

        fetchComments();
    }, [id]);

    // Fetch Comments for this lead
    const fetchComments = () => {
        fetch(`${API}/comments/${id}`)
            .then((res) => res.json())
            .then((data) => setComments(data))
            .catch((err) => console.log(err));
    };

    // Add new comment
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await fetch(`${API}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                leadId: id,
                text: newComment,
                author: "Admin",
            }),
        });

        setNewComment("");
        fetchComments();
    };

    if (!lead) return <p className="text-center mt-5">Loading Lead Details...</p>;

    return (
        <div className="container mt-4">

            {/* Page Title */}
            <h2 className="text-center mb-4">Lead Management: {lead.name}</h2>

            <div className="row">

                {/* Sidebar */}
                <div className="col-3">
                    <div className="card p-3 shadow-sm">
                        <h5 className="mb-3">Menu</h5>

                        <button 
                            className="btn btn-outline-secondary w-100 mb-2"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>

                        <Link 
                            className="btn btn-outline-secondary w-100"
                            to="/leadList"
                        >
                            Back to Lead List
                        </Link>
                    </div>
                </div>

                {/* Main Section */}
                <div className="col-9">

                    {/* Lead Details */}
                    <div className="card p-4 shadow-sm">
                        <h4>Lead Details</h4>

                        <p><strong>Name:</strong> {lead.name}</p>
                        <p><strong>Sales Agent:</strong> {lead.salesAgent?.name || "Not Assigned"}</p>
                        <p><strong>Source:</strong> {lead.source}</p>
                        <p><strong>Status:</strong> {lead.status}</p>
                        <p><strong>Priority:</strong> {lead.priority}</p>
                        <p><strong>Time to Close:</strong> {lead.timeToClose || "N/A"}</p>

                        {/* Tags */}
                        <p>
                            <strong>Tags:</strong>{" "}
                            {lead.tags?.length > 0 ? (
                                lead.tags.map((tag, idx) => (
                                    <span 
                                        key={idx} 
                                        className="badge bg-info text-dark me-1"
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                "No Tags"
                            )}
                        </p>

                        <Link 
                            to={`/editLead/${lead._id}`} 
                            className="btn btn-primary mt-3"
                        >
                            Update Lead
                        </Link>
                    </div>

                    {/* Comments Section */}
                    <div className="card p-4 mt-4 shadow-sm">
                        <h4>Comments</h4>

                        {/* List of Comments */}
                        <div className="mt-3">
                            {comments.length === 0 ? (
                                <p className="text-muted">No comments yet.</p>
                            ) : (
                                comments.map((c) => (
                                    <div key={c._id} className="border rounded p-3 mb-2">
                                        <p><strong>{c.author}</strong> – {new Date(c.createdAt).toLocaleString()}</p>
                                        <p>{c.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Comment */}
                        <form onSubmit={handleSubmitComment} className="mt-3">
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            ></textarea>

                            <button className="btn btn-success mt-2">
                                Submit Comment
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
