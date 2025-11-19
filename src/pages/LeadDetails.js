import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../useFetch";

export default function LeadDetails() {
  const { id } = useParams();
  console.log("useParams id:", id);

  const { data: Lead, loading: leadLoading, error: leadError } = useFetch(
    `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}`,
    {}
  );

  
  const { data: comments, loading: commentsLoading, error: commentsError } = useFetch(
    `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`,
    []
  );

  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  
  useEffect(() => {
    if (!commentsLoading && Array.isArray(comments)) {
      setCommentList(comments);
    }
  }, [comments, commentsLoading]);

  const handleSubmit = async () => {
    const text = newComment.trim();
    if (!text) {
      alert("Please enter a comment first.");
      return;
    }

    
    const authorId = Lead?.salesAgent?._id || Lead?.salesAgent?.id;
    if (!authorId) {
      alert("No sales agent assigned to this lead. Cannot post comment.");
      return;
    }

    try {
      const response = await fetch(
        `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commentText: text,
            author: authorId,
          }),
        }
      );

      const responseBody = await response.json();
      console.log("POST comment response:", response.status, responseBody);

      if (!response.ok) {
        throw new Error(responseBody.error || "Failed to post comment");
      }

      
      setCommentList([responseBody, ...commentList]);
      setNewComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Could not submit comment: " + err.message);
    }
  };

  if (leadLoading) return <p className="text-center mt-5">Loading Lead Data …</p>;
  if (leadError) return <p className="text-center mt-5">Error fetching lead.</p>;

  return (
    <div className="flex-grow-1 px-4">
      <h2 className="text-center mb-4 mt-4">Lead Management: {Lead.name}</h2>

      <div className="mb-4">
        <h4 className="mb-3">Lead Details</h4>
        <ul className="list-group" style={{ maxWidth: "400px" }}>
          <li className="list-group-item">
            <strong>Lead Name:</strong> {Lead.name}
          </li>
          <li className="list-group-item">
            <strong>Sales Agent:</strong> {Lead.salesAgent?.name || "N/A"}
          </li>
          <li className="list-group-item">
            <strong>Lead Source:</strong> {Lead.source}
          </li>
          <li className="list-group-item">
            <strong>Lead Status:</strong> {Lead.status}
          </li>
          <li className="list-group-item">
            <strong>Priority:</strong> {Lead.priority}
          </li>
          <li className="list-group-item">
            <strong>Time to Close:</strong> {Lead.timeToClose} Days
          </li>
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
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!Lead?.salesAgent?._id && !Lead?.salesAgent?.id}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
