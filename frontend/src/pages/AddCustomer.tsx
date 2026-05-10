import { useState } from "react";

export default function AddCustomer() {
  const [formData, setFormData] = useState({
    company: "",
    owner: "",
    phone: "",
    email: "",
    status: "New Lead",
    notes: "",
    clientEmail: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ ONLY ONE handleSubmit (FINAL VERSION)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.company ||
      !formData.owner ||
      !formData.clientEmail ||
      !formData.password
    ) {
      setError("Please fill required fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      setError("Invalid email format");
      return;
    }

    const payload = {
      ...formData,
      company: formData.company.trim(),
      owner: formData.owner.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      clientEmail: formData.clientEmail.trim(),
      password: formData.password.trim(),
      notes: formData.notes.trim(),
    };

    try {
      setLoading(true);

      const res = await fetch("http://localhost/crm-api/addCustomer.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!data.success) {
        setError(data.message || "Failed to create customer");
        return;
      }

      setSuccess("Customer created successfully ✅");

      setFormData({
        company: "",
        owner: "",
        phone: "",
        email: "",
        status: "New Lead",
        notes: "",
        clientEmail: "",
        password: "",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center py-10 px-4">

      <div className="bg-white/90 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl shadow-xl w-full max-w-4xl">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Add Customer</h2>
          <p className="text-gray-500 text-sm">
            Fill in the details to create a new customer
          </p>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-green-600 bg-green-100 p-2 rounded">
            {success}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-4">
              <input className="w-full border p-3 rounded-lg" placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />

              <input className="w-full border p-3 rounded-lg" placeholder="Owner Name"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              />

              <input className="w-full border p-3 rounded-lg" placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <input className="w-full border p-3 rounded-lg" placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <select className="w-full border p-3 rounded-lg"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option>New Lead</option>
                <option>Contacted</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="space-y-4">
              <input className="w-full border p-3 rounded-lg" placeholder="Client Email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />

              <input type="password" className="w-full border p-3 rounded-lg" placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <textarea className="w-full border p-3 rounded-lg" rows={6} placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Saving..." : "Create Customer"}
          </button>

        </form>
      </div>
    </div>
  );
}