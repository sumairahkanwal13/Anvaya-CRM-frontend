import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useFetch from "../useFetch";


export default function LeadDetails() {
  const params = useParams();
  const location = useLocation();
  
  // Try to get id from params first, if not available, extract from pathname
  let id = params?.id;
  if (!id && location.pathname) {
    const pathParts = location.pathname.split('/');
    const leadDetailsIndex = pathParts.indexOf('leadDetails');
    if (leadDetailsIndex !== -1 && pathParts[leadDetailsIndex + 1]) {
      id = pathParts[leadDetailsIndex + 1];
    }
  }
  
  // If id is the string "undefined" or actually undefined, treat as invalid
  if (id === 'undefined' || id === undefined || id === null || id === '') {
    id = null;
  }

  useEffect(() => {
    console.log("All params:", params);
    console.log("Location pathname:", location.pathname);
    console.log("Extracted id:", id);
  }, [params, location.pathname, id]);



  const { data: Lead, loading: leadLoading, error: leadError } = useFetch(
    id ? `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}` : null,
    {}
  );

  // Fetch Comments
  const {
    data: comments,
    loading: commentsLoading,
    error: commentsError,
  } = useFetch(id ? `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments` : null, []);

  const [ newComments, setNewComments ] = useState("")
  const [ commentsList, setNewCommentsList ] = useState([]);

  // Set Comments when Fetched

  useEffect(() => {
    if(Array.isArray (comments)){
      setNewCommentsList(comments)
    }
  }, [comments])
 
  // Log the complete Lead object when it's fetched
  useEffect(() => {
    if (Lead && Object.keys(Lead).length > 0) {
      console.log("Complete Lead Object:", Lead);
      console.log("Lead Keys:", Object.keys(Lead));
    }
  }, [Lead]);

  const handleSubmit = async () => {
    const text = newComments.trim();
    if(!text) return alert("Please write a comment first.");

    const authorId = Lead?.salesAgent?._id || Lead?.salesAgent?.id

    if(!authorId) {
      alert("Lead has no sales agent assigned; cannot post comment.")
    } 

    try{
      const response = await fetch(
        `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type" : "application/json"},
          body: JSON.stringify({
            commentText: text,
            author: authorId, 
          })
        }
      );

      const responseBody = await response.json();
      if(!response.ok) throw new Error(responseBody.error || "Failed to post comment")

        // Add new comment
        setNewCommentsList([responseBody, ...commentsList]);
        setNewComments("")

    } catch(err){
      console.error(err)
      alert("Enter posting comments: " + err.message)
    }
  }

  if (!id) return <p className="text-center mt-5">Invalid lead ID. Please go back and select a valid lead.</p>;
  if (leadLoading) return <p className="text-center mt-5">Loading Lead Data …</p>;
  if (leadError) return <p className="text-center mt-5">Error fetching lead.</p>;

 return (
    <div className="flex-grow-1 px-4">
      <h2 className="text-center mb-4">Lead Management {Lead.name}</h2>
      <div className="mb-4">
        <h4>Lead Details</h4>
        <ul className="list-group" style={{maxWidth: "400px"}}>
          <li className="list-group-item">
            <strong>Name: </strong> {Lead.name}
          </li>

          <li className="list-group-item">
            <strong>Sales Agent: </strong> {Lead.salesAgent?.name || "N/A"}
          </li>

          <li className="list-group-item">
            <strong>Source: </strong> {Lead.source}
          </li>

          <li className="list-group-item">
            <strong>Status: </strong> {Lead.status}
          </li>

          <li className="list-group-item">
            <strong>Priority: </strong> {Lead.priority}
          </li>

          <li className="list-group-item">
            <strong>Time to Close: </strong> {Lead.timeToClose} Days
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <h4>Comments</h4>

        {commentsLoading ? (
          <p>Loading comments...</p>
        ) : commentsError ? (
          <p>Error loading comments.</p>
        ) : commentsList.length === 0 ? (
          <p>No comments yet</p>
        ) : commentsList.map((c) => (
          <div className="border p-2 mb-2 rounded" key={c._id}>
            <p>
              <strong>
                {c.author?.name || "Anonymous"} - {new Date(c.createdAt).toLocaleString()}
              </strong>
            </p>

            <p>
              {c.commentText}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 mb-5">
        <textarea className="form-control mb-2" placeholder="" rows="3"  value={newComments} onChange={(e) => setNewComments(e.target.value)}/>
          <button className="btn btn-primary shadow-sm" onClick={handleSubmit}>
            Submit Comment
          </button>
      </div>
    </div>
  );
} 
