import useFetch from "../useFetch";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LeadDetails() {
  const { id } = useParams();
  const { data: Lead, loading, error } = useFetch(
    `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}`,
    {}
  );
  const { data: comments, loading: commentsLoading, error: commentsError } = useFetch(
    `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`,
    []
  );

  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  // Initialize comment list once when comments are fetched
  useEffect(() => {
    if (!commentsLoading && comments && comments.length > 0) {
      setCommentList(comments);
    }
  }, [comments, commentsLoading]);

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) {
      console.log("Please enter a comment first.");
      return;
    }

    const authorId = Lead?.salesAgent?._id;
    if (!authorId) {
      console.log("No salesAgent assigned, cannot post comment.");
      return;
    }

    try {
      const response = await fetch(
        `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentText: trimmed,
            author: authorId,
          }),
        }
      );

      const body = await response.json();
      console.log("POST comment response:", response.status, body);

      if (!response.ok) {
        throw new Error(body.error || "Failed to post comment.");
      }

      // Assuming backend returns populated comment with ._id and author.name
      setCommentList([body, ...commentList]);
      setNewComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading Lead Data …</p>;
  if (error) return <p className="text-center mt-5">Error fetching lead.</p>;

  return (
    <div className="flex-grow-1 px-4">
      <h2 className="text-center mb-4 mt-4">Lead Management: {Lead.name}</h2>

      <div className="mb-4">
        <h4 className="mb-3">Lead Details</h4>
        <ul className="list-group" style={{ maxWidth: "400px" }}>
          <li className="list-group-item"><strong>Lead Name:</strong> {Lead.name}</li>
          <li className="list-group-item"><strong>Sales Agent:</strong> {Lead.salesAgent?.name || "N/A"}</li>
          <li className="list-group-item"><strong>Lead Source:</strong> {Lead.source}</li>
          <li className="list-group-item"><strong>Lead Status:</strong> {Lead.status}</li>
          <li className="list-group-item"><strong>Priority:</strong> {Lead.priority}</li>
          <li className="list-group-item"><strong>Time to Close:</strong> {Lead.timeToClose} Days</li>
        </ul>
      </div>

      <div className="mt-4">
        <h4>Comments</h4>
        {commentsLoading ? (
          <p>Loading Comments …</p>
        ) : commentsError ? (
          <p>Error loading comments.</p>
        ) : commentList.length === 0 ? (
          <p>No Comments yet</p>
        ) : (
          commentList.map((comment) => (
            <div key={comment._id} className="border p-2 mb-2 rounded">
              <p>
                <strong>
                  {comment.author?.name || "Anonymous"} –{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </strong>
              </p>
              <p>{comment.commentText}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <textarea
          className="form-control mb-2"
          placeholder="Add a new comment…"
          rows="2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
