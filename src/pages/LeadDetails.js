import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function LeadDetails() {
  const { id } = useParams();
  const { data: leads, loading, error } = useFetch(`https://anvaya-crm-backend-rosy.vercel.app/leads/${id}`, {});
  const { data: comments, loading: commentsLoading } = useFetch(`https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`, []);

  const [ newComment, setNewComment ] = useState("");
  const [ commentList, setCommentList ] = useState([]);
  if(!commentsLoading && commentList.length === 0 && comments.length > 0 ){
    setCommentList(comments)
  }

  const handleSubmit = async() =>{
    if(!newComment.trim()) return ("Please enter a comment first.")
        try{
    const response = await fetch(`https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            commentText: newComment,
            author: leads.salesAgent?._id
        })
    })

    if(!response.ok) throw new Error ("Failed to post comment.")

        const createdComment = await response.json();
        setCommentList([createdComment, ...commentList]);
        setNewComment("");
    } catch (error){
        console.log(error)
    }
  }
  if (loading) return <p className="text-center mt-5">.....Loading Lead Data</p>;
  if (error) return <p className="text-center mt-5">Error occurred while fetching data.</p>;

  return (
    <div className="d-flex mt-4">
      <Sidebar />

      <div className="flex-grow-1 px-4">
        <h2 className="text-center mb-4 mt-4">Lead Management: {leads.name}</h2>

        
        <div className="mb-4">
          <h4 className="mb-3">Lead Details</h4>
          {leads && (
            <ul className="list-group" style={{ maxWidth: "400px" }}>
              <li className="list-group-item"><strong>Lead Name:</strong> {leads.name}</li>
              <li className="list-group-item"><strong>Sales Agent:</strong> {leads.salesAgent?.name || "N/A"}</li>
              <li className="list-group-item"><strong>Lead Source:</strong> {leads.source}</li>
              <li className="list-group-item"><strong>Lead Status:</strong> {leads.status}</li>
              <li className="list-group-item"><strong>Priority:</strong> {leads.priority}</li>
              <li className="list-group-item"><strong>Time to Close:</strong> {leads.timeToClose} Days</li>
            </ul>
          )}
        </div>

        
        <div className="mt-4">
          <h4>Comments</h4>
          {commentsLoading ? (
            <p>Loading Comments...</p>
          ) : comments.length === 0 ? (
            <p>No Comments yet</p>
          ) : (
            commentList.map((comment) => (
              <div key={comment.id} className="border p-2 mb-2 rounded">
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
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
