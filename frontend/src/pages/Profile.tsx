import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    role: user?.role || "",
  });

  const handleUpdate = (e: any) => {
    e.preventDefault();

    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, ...formData })
    );

    setEditMode(false);
  };

  const handleDelete = () => {
    if (confirm("Delete account?")) {
      localStorage.removeItem("user");
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-start pt-10 px-4">

      <div className="w-full max-w-2xl space-y-6">

        {/* 🔥 PROFILE HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-5">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-semibold">{user?.email}</h2>
            <p className="text-gray-500 text-sm capitalize">
              {user?.role}
            </p>
          </div>

        </div>

        {/* 🔥 PROFILE DETAILS CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">

          <div>
            <h3 className="text-lg font-semibold">Account Details</h3>
            <p className="text-gray-500 text-sm">
              Manage your account information
            </p>
          </div>

          {!editMode ? (
            <>
              {/* VIEW MODE */}
              <div className="space-y-4">

                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Role</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Edit Profile
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Account
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 🔥 EDIT MODE */}
              <form onSubmit={handleUpdate} className="space-y-4">

                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <input
                    className="w-full mt-1 border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <select
                    className="w-full mt-1 border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="owner">Owner</option>
                    <option value="employee">Employee</option>
                    <option value="client">Client</option>
                  </select>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 pt-3">
                  <button className="bg-black text-white px-5 py-2 rounded-lg">
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-gray-200 px-5 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
}