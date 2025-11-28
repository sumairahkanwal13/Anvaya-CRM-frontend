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
    labels: ["Closed Lead", "Pipeline Lead"],
    datasets: [
      {
        data: [30, 35],
        backgroundColor: ["#4CAF50", "#2196F3"],
      },
    ],
  };

  const closedByAgentData = {
    labels: ["John Doe", "Jane Smith", "Sumaira Kanwal"],
    datasets: [
      {
        label: "Closed Leads",
        data: [12, 23, 9],
        backgroundColor: "#FF9800",
      },
    ],
  };

  const statusDistributionData = {
    labels: ["New", "Contacted", "Qualified"],
    datasets: [
      {
        data: [20, 34, 40],
        backgroundColor: ["#9C27B0", "#03A9F4", "#4CAF50"],
      },
    ],
  };

  return (
    <div className="report-page px-2 px-md-4 mt-3">
      <h2 className="mb-3 text-center">Anvaya CRM Reports</h2>

      <div className="container">
        <div className="row g-4">

          
          <div className="col-12 col-md-6">
            <div className="card p-3">
              <h4 className="text-center mb-3">Leads Closed Vs Pipeline</h4>
              <div style={{ width: "100%", height: "300px" }}>
                <Pie
                  data={closedVsPipeline}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

         
          <div className="col-12 col-md-6">
            <div className="card p-3">
              <h4 className="text-center mb-3">Closed Leads By Agent</h4>
              <div style={{ width: "100%", height: "300px" }}>
                <Bar
                  data={closedByAgentData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

          
          <div className="col-12">
            <div className="card p-3">
              <h4 className="text-center mb-3">Lead Status Distribution</h4>
              <div style={{ width: "100%", height: "300px" }}>
                <Pie
                  data={statusDistributionData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
