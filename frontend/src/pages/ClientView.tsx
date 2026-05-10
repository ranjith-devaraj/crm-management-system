import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ClientView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState<any[]>([]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔥 STATUS ORDER (TOP → BOTTOM)
  const sortRequests = (list: any[]) => {
    const order: any = {
      Approved: 1,
      "In Progress": 2,
      Pending: 3,
      Completed: 4,
      Rejected: 5,
    };

    return list.sort(
      (a, b) => (order[a.status] || 99) - (order[b.status] || 99)
    );
  };

  // 🔥 FETCH DATA
  useEffect(() => {
    async function fetchData() {
      try {
        // 🔹 CLIENT DATA (fallback)
        const res = await fetch(
          `http://localhost/crm-api/client.php?email=${user?.email}`
        );
        const result = await res.json();

        if (result.success && result.data) {
          setData({
            company: result.data.company,
            service: result.data.notes || "Service Not Specified",
            status: result.data.status,
            notes: result.data.notes || "No notes available",
          });
        }

        // 🔹 REQUESTS
        const reqRes = await fetch(
          `http://localhost/crm-api/request_list.php?email=${user?.email}`
        );
        const reqData = await reqRes.json();

        if (reqData.success) {
          const sorted = sortRequests(reqData.data);

          setRequests(sorted);

          // 🔥 TOP PROJECT (Approved / In Progress)
          const active = sorted.find(
            (r) =>
              r.status === "Approved" || r.status === "In Progress"
          );

          if (active) {
            setData({
              company: active.service,
              service: active.service,
              status: active.status,
              notes: active.description,
            });
          }
        }
      } catch (err) {
        console.error("Client fetch error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // 🔥 SUBMIT REQUEST
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost/crm-api/request_create.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email,
            service,
            description,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);

        setService("");
        setDescription("");
        setShowForm(false);

        // 🔥 RELOAD REQUESTS
        const reqRes = await fetch(
          `http://localhost/crm-api/request_list.php?email=${user?.email}`
        );
        const reqData = await reqRes.json();

        if (reqData.success) {
          const sorted = sortRequests(reqData.data);
          setRequests(sorted);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100">

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="fixed top-5 right-5 bg-green-600 shadow-xl text-white px-5 py-3 rounded-lg">
          ✅ Request submitted successfully
        </div>
      )}

      {/* NAVBAR */}
      <div className="bg-white/80 backdrop-blur-lg border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-semibold">My Project</h2>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">CLIENT</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center mt-10 px-4 gap-6">

        {/* PROJECT DETAILS */}
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full space-y-5">
          <h2 className="text-xl font-bold">Project Details</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : data ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div>
                  <p className="text-gray-500 text-sm">Company</p>
                  <p className="font-semibold text-lg">{data.company}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Service</p>
                  <p className="font-semibold text-lg">{data.service}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                    {data.status}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Last Update</p>
                  <p className="font-medium">Recently</p>
                </div>

              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">Notes</p>
                <p className="mt-1 text-gray-700">{data.notes}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-6">
              No project assigned yet
            </p>
          )}
        </div>

        {/* REQUEST BUTTON */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-8 py-3 rounded-xl"
        >
          + Request New Service
        </button>

        {/* REQUEST FORM */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full space-y-5"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">New Service Request</h3>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Service Type"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            />

            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="Describe your requirement"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="flex gap-3">
              <button className="bg-black text-white px-4 py-2 rounded-lg">
                Submit Request
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setService("");
                  setDescription("");
                }}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* REQUEST LIST */}
        {requests.length > 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
            <h3 className="font-semibold mb-4">My Requests</h3>

            {requests.map((req, i) => (
              <div key={i} className="border-b py-3">
                <p><b>{req.service}</b></p>
                <p className="text-sm text-gray-600">{req.description}</p>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}