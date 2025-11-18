import useFetch from "../useFetch";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"; // <-- Import useEffect

export default function LeadDetails() {
  const { id } = useParams();
  const { data: Lead, loading, error } = useFetch(`https://anvaya-crm-backend-rosy.vercel.app/leads/${id}`, {});
  const { data: initialComments, loading: commentsLoading } = useFetch(`https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`, []);

  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  // --- IMPROVEMENT: Use useEffect to sync comments ---
  // This is a more robust way to update the comment list when the data is fetched.
  useEffect(() => {
    if (!commentsLoading && initialComments) {
      setCommentList(initialComments);
    }
  }, [initialComments, commentsLoading]);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment first."); // <-- IMPROVEMENT: Show an alert to the user
      return;
    }

    try {
      const response = await fetch(`https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commentText: newComment,
          // --- PRIMARY FIX IS HERE ---
          // Add the 'lead' ID to the request body as expected by the backend.
          lead: id, 
          author: Lead?.salesAgent?._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment.");
      }

      const createdComment = await response.json();
      setCommentList([createdComment, ...commentList]);
      setNewComment("");
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`); // <-- IMPROVEMENT: Show a more descriptive error
    }
  };

  if (loading) return <p className="text-center mt-5">.....Loading Lead Data</p>;
  if (error) return <p className="text-center mt-5">Error occurred while fetching data.</p>;

  return (
    <div className="flex-grow-1 px-4">
      <h2 className="text-center mb-4 mt-4">Lead Management: {Lead.name}</h2>

      <div className="mb-4">
        <h4 className="mb-3">Lead Details</h4>
        {Lead && (
          <ul className="list-group" style={{ maxWidth: "400px" }}>
            <li className="list-group-item"><strong>Lead Name:</strong> {Lead.name}</li>
            <li className="list-group-item"><strong>Sales Agent:</strong> {Lead.salesAgent?.name || "N/A"}</li>
            <li className="list-group-item"><strong>Lead Source:</strong> {Lead.source}</li>
            <li className="list-group-item"><strong>Lead Status:</strong> {Lead.status}</li>
            <li className="list-group-item"><strong>Priority:</strong> {Lead.priority}</li>
            <li className="list-group-item"><strong>Time to Close:</strong> {Lead.timeToClose} Days</li>
          </ul>
        )}
      </div>

      <div className="mt-4">
        <h4>Comments</h4>
        {commentsLoading ? (
          <p>Loading Comments...</p>
        ) : commentList.length === 0 ? ( // <-- FIX: Check commentList.length instead of comments.length
          <p>No Comments yet</p>
        ) : (
          commentList.map((comment) => (
            <div key={comment.id || comment._id} className="border p-2 mb-2 rounded">
              <p>
                <strong>
                  {comment.author?.name || "Anonymous"} -{" "}
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
          placeholder="Add a new comment..."
          rows="2"
          cols="50"
          value={newComment} // <-- GOOD PRACTICE: Make this a controlled component
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}