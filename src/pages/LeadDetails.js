import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../useFetch";

export default function LeadDetails() {

  

  // ❗ FIXED THIS LINE
  const { id } = useParams();

  console.log("useParams id:", id);

  const { data: Lead, loading: leadLoading, error: leadError } = useFetch(
    id ? `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}` : null,
    {}
  );

  const { data: comments, loading: commentsLoading, error: commentsError } = useFetch(
    id ? `https://anvaya-crm-backend-rosy.vercel.app/leads/${id}/comments` : null,
    []
  );

  const { data: agents } = useFetch(id ? `https://anvaya-crm-backend-rosy.vercel.app/agents` : null);

  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [isEditing, setIsEditing ] = useState(false);
  const [ editData, setEditData ] = useState({});

  useEffect(() => {
    if (!commentsLoading && Array.isArray(comments)) {
      setCommentList(comments);
    }
  }, [comments, commentsLoading]);


  useEffect(() => {
    if(Lead){
      setEditData({
        name: Lead.name,
        salesAgent: Lead.salesAgent?.id || Lead.salesAgent?._id || "",
        status: Lead.status,
        priority: Lead.priority,
        source: Lead.source,
        timeToClose: Lead.timeToClose,

      })
    }
  }, [Lead]);


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
          })
        }
      );

      const responseBody = await response.json();
      console.log("POST comment response:", response.status, responseBody);

      if (!response.ok) throw new Error(responseBody.error);

      setCommentList([responseBody, ...commentList]);
      setNewComment("");

    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Could not submit comment: " + err.message);
    }
  };

  const handleSavedLead = async() => {
    try{
      const payLoad = {
        ...editData,
        salesAgent: editData.salesAgent
      };

      const response = await fetch(`https://anvaya-crm-backend-rosy.vercel.app/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(payLoad)
      });

      if(!response.ok) throw new Error("Update Failed")
        alert("Lead updated successfully!")
      setIsEditing(false)
      window.location.reload()
    } catch(err){
      alert("Error updating lead" + err.message)
    }
  }

  if (leadLoading) return <p className="text-center mt-5">Loading Lead Data …</p>;
  if (leadError) return <p className="text-center mt-5">Error fetching lead.</p>;

  return (
    <div className="flex-grow-1 px-4">
      <h2 className="text-center mb-4 mt-4">Lead Management: {Lead.name}</h2>

      {!isEditing && (
        <button className="btn btn-warning mb-3" onClick={() => setIsEditing(true)}>
          Edit Lead
          </button>
      )}

      {isEditing && (
        <div className="card p-3 mb-3">
          <h5>Edit Lead</h5>

          <label className="mt-2">Lead Name</label>

          <input className="form-control" 
          value={editData.name} 
          onChange={(e) => setEditData({...editData, name: e.target.value})}
          />

          <label className="mt-2"> Sales Agent </label>
          <select className="form-select" value={editData.salesAgent} onChange={(e) => setEditData({...editData, salesAgent: e.target.value})}>
            <option value="">
              Select Sales Agent
            </option>
            {agents?.map((agent) => (
              <option key={agent._id} value={agent._id}>{agent.name}</option>
            ))}
          </select>

          <label className="mt-2">Source</label>
          <select
            className="form-select"
            value={editData.source}
            onChange={(e) => setEditData({ ...editData, source: e.target.value })}
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Email">Email</option>
            <option value="Other">Other</option>
          </select>

          <label className="mt-2">Status</label>
          <select
            className="form-select"
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
          >
            <option value="">Select Status</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>

          <label className="mt-2">Priority</label>
          <select
            className="form-select"
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <label className="mt-2">Time to Close</label>
          <input
            type="number"
            className="form-control"
            value={editData.timeToClose}
            onChange={(e) =>
              setEditData({ ...editData, timeToClose: Number(e.target.value) })
            }
          />

          <div className="mt-3">
            <button className="btn btn-success me-2" onClick={handleSavedLead}>Save</button>

            <button className="btn btn-primary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

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
                <strong>{comment.author?.name || "Anonymous"} – {new Date(comment.createdAt).toLocaleString()}</strong>
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
