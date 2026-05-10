import { useState, useEffect } from "react";

export default function Customers() {

  const [customers, setCustomers] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({
    company: "",
    owner: "",
    status: "New Lead",
    clientEmail: "",
    password: "",
  });

  // 🔥 FETCH FROM API (GROUP + SORT)
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("http://localhost/crm-api/getCustomers.php");
        const data = await res.json();

        if (data.success) {

          // 🔥 GROUP BY OWNER (CLIENT)
          const grouped = data.data.reduce((acc: any, curr: any) => {
            const key = curr.owner;

            if (!acc[key]) acc[key] = [];
            acc[key].push(curr);

            return acc;
          }, {});

          // 🔥 SORT INSIDE EACH CLIENT
          const sorted = Object.values(grouped)
            .map((group: any) =>
              group.sort((a: any, b: any) => {
                const order: any = {
                  "In Progress": 1,
                  "New Lead": 2,
                  "Completed": 3,
                };
                return (order[a.status] || 99) - (order[b.status] || 99);
              })
            )
            .flat();

          setCustomers(sorted);
        }

      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchCustomers();
  }, []);

  // 🔥 DELETE
  const handleDelete = async (index: number) => {
    if (!confirm("Delete this customer?")) return;

    const id = customers[index].id;

    try {
      const res = await fetch("http://localhost/crm-api/deleteCustomer.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        const updated = customers.filter((_, i) => i !== index);
        setCustomers(updated);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 STATUS COLOR
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "In Progress":
        return "bg-blue-100 text-blue-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // 🔥 EDIT
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setFormData({ ...customers[index] });
  };

  // 🔥 UPDATE
  const handleUpdate = async (e: any) => {
    e.preventDefault();

    if (!formData.company || !formData.owner) {
      alert("Company & Owner required");
      return;
    }

    try {
      const res = await fetch("http://localhost/crm-api/updateCustomer.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: customers[editIndex!].id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const updated = [...customers];
        updated[editIndex!] = { ...formData };
        setCustomers(updated);
        setEditIndex(null);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
        <p className="text-gray-500 text-sm">Manage and update customer details</p>
      </div>

      <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">Company</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    No customers found
                  </td>
                </tr>
              )}

              {customers.map((c, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{c.company}</td>
                  <td className="p-4">{c.owner}</td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => handleEdit(i)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(i)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

            <h3 className="font-semibold">Edit Customer</h3>

            <form onSubmit={handleUpdate} className="space-y-3">

              <input
                className="w-full border p-2 rounded"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
                }
              />

              <select
                className="w-full border p-2 rounded"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option>New Lead</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <input
                className="w-full border p-2 rounded"
                value={formData.clientEmail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, clientEmail: e.target.value })
                }
              />

              <input
                type="password"
                className="w-full border p-2 rounded"
                value={formData.password || ""}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setEditIndex(null)} className="bg-gray-200 px-3 py-1 rounded">
                  Cancel
                </button>

                <button className="bg-black text-white px-3 py-1 rounded">
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}