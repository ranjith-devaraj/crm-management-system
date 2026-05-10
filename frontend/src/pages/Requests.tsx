import { useEffect, useState } from "react";

export default function Requests() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await fetch("http://localhost/crm-api/request_list.php?email=");
    const data = await res.json();

    if (data.success) {
      setRequests(data.data);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch("http://localhost/crm-api/request_update.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    fetchRequests();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Service Requests</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="p-4">Client</th>
              <th className="p-4">Service</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-4">{r.client_email}</td>
                <td className="p-4">{r.service}</td>
                <td className="p-4">{r.description}</td>

                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                    {r.status}
                  </span>
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => updateStatus(r.id, "Approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(r.id, "Rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}