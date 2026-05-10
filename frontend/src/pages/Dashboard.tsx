import Card from "../components/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b"];

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("http://localhost/crm-api/dashboard.php");
        const result = await res.json();

        if (result.success) {
          setData(result);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!data) {
    return <div className="p-6 text-gray-500">No data available</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-500 text-sm">
          Overview of customer insights
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Customers" value={data.total} icon="👥" />
        <Card title="In Progress" value={data.inProgress} icon="⏳" />
        <Card title="Completed" value={data.completed} icon="✅" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BAR */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4">Customer Growth</h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.monthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4">Customer Status</h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.status} dataKey="value" outerRadius={100} label>
                {data.status.map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}