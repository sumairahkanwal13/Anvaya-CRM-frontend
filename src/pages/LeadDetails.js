import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LeadDetails() {
  const { id } = useParams();

  const { data: Lead, loading, error } = useFetch(
    `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}`,
    {}
  );

  const { data: comments } = useFetch(
    `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`,
    []
  );

  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  // 🔍 Add console.log here to inspect data structure
  console.log("LEAD FROM API:", Lead);

  useEffect(() => {
    if (comments && comments.length > 0) {
      setCommentList(comments);
    }
  }, [comments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return alert("Please enter a comment.");

    try {
      const response = await fetch(
        `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commentText: newComment,

            // ❗ Temporary log added — we will fix after we see the structure
            author: Lead?.salesAgent?.id,  
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment.");

      const createdComment = await response.json();
      setCommentList([createdComment, ...commentList]);
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading Lead...</p>;
  if (error) return <p>Error fetching lead.</p>;

  return (
    <div className="d-flex mt-4">
      <Sidebar />

      <div className="flex-grow-1 px-4">
        <h2 className="text-center mt-4">Lead: {Lead?.name}</h2>

        <h4 className="mt-4">Comments</h4>
        {commentList.map((comment) => (
          <div key={comment._id} className="border p-2 mb-2 rounded">
            <strong>
              {comment.author?.name} —{" "}
              {new Date(comment.createdAt).toLocaleString()}
            </strong>
            <p>{comment.commentText}</p>
          </div>
        ))}

        <textarea
          className="form-control mb-2"
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
