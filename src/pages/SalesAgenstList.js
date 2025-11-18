import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function SalesAgentsList(){
    const { data: agents, loading, error } = useFetch("https://anvaya-crm-backend-rosy.vercel.app/agents", [])

    if(loading) return <p className="text-center mt-4">Loading....</p>
    if(error) return <p className="text-center mt-4">Error occurred while fetching data.</p>
    
    return (
    <div className="flex-grow-1 px-4">
        <h2 className="text-center mb-4 mt-4">Lead Management: {leads.name}</h2>

        
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
  );
}
