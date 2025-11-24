import Sidebar from "../components/Sidebar";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Report() {
    const closedVsPipeline = {
        labels: [ "Closed Lead" , "Pipeline Lead"],
        datasets: [
            {
                data: [ 30, 35],
                backgroundColor: ["#4CAF50", "#2196F3"]
            },
        ],
    };

    const closedByAgentData = {
        labels: [ "John Doe", "Jane Smith", "Sumaira Kanwal"],
        datasets: [
            {
                label: "Closed Leads",
                data: [12, 23, 9],
                backgroundColor: "#FF9800",
            },
        ],
    };

    const statusDistributionData = {
        labels: [ "New", "Contacted", "Qualified", ],
        datasets: [
            {
                data: [20, 34, 40],
                backgroundColor: ["#9C27B0", "#03A9F4", "#4CAF50", "#FFC107"],
            },
        ],
    };
  return (
    <div className="report-page px-4 mt-4">
      <h2 className="mb-3 text-center">Anvaya CRM Reports</h2>

      <div className="container">
        <div className="card mb-4 p-3">
          <h4 className="text-center mb-3">Leads Closed Vs Pipeline</h4>
          <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
            <Pie data={closedVsPipeline} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4 p-3">
              <h4 className="text-center mb-3">Lead Closed by Sales Agent</h4>
              <Bar data={closedByAgentData} />
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4 p-3">
              <h4 className="text-center mb-3">Lead Status Distribution</h4>
              <Pie data={statusDistributionData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
