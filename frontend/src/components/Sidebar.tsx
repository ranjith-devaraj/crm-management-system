import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: Props) {
  const location = useLocation();
  const { user } = useAuth();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠", roles: ["owner"] },
    { name: "Customers", path: "/customers", icon: "👤", roles: ["owner", "employee"] },
    { name: "Add Customer", path: "/add", icon: "➕", roles: ["owner", "employee"] },
    { name: "Requests", path: "/requests", icon: "📩", roles: ["owner", "employee"] },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
className={`
  w-64 h-screen
  bg-gradient-to-b from-black to-gray-900 text-white
  p-5 flex flex-col
  shadow-xl
  transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:relative md:block
`}
      >

        {/* TOP */}
        <div>

          {/* LOGO */}
          <div className="mb-10 flex items-center gap-2">
            <div className="w-9 h-9 bg-white text-black rounded-lg flex items-center justify-center font-bold">
              C
            </div>
            <h1 className="text-xl font-semibold tracking-wide">CRM Panel</h1>
          </div>

          {/* MENU */}
          <nav className="space-y-2">
            {menu
              .filter((item) => item.roles.includes(user?.role || ""))
              .map((item) => {
                const active = location.pathname === item.path;

                return (
<Link
  key={item.path}
  to={item.path}
  onClick={onClose}
  className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
  ${
    active
      ? "bg-white text-black shadow-md"
      : "text-gray-400 hover:text-white hover:bg-gray-800"
  }`}
>
  {/* 🔥 Active Indicator */}
  {active && (
    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-black rounded-r"></span>
  )}

  {/* ICON */}
  <span
    className={`text-lg transition ${
      active ? "scale-110" : "group-hover:scale-110"
    }`}
  >
    {item.icon}
  </span>

  {/* TEXT */}
  <span className="text-sm font-medium tracking-wide">
    {item.name}
  </span>
</Link>
                );
              })}
          </nav>
        </div>

        {/* BOTTOM PROFILE */}
        <div className="mt-auto border-t border-gray-800 pt-4">

          {/* USER INFO */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-900/60">

            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>

            <div className="text-sm">
              <p className="font-medium">{user?.role?.toUpperCase()}</p>
              <p className="text-gray-400 text-xs truncate max-w-[120px]">
                {user?.email}
              </p>
            </div>
          </div>

          {/* PROFILE BUTTON */}
          <Link
            to="/profile"
            className="block mt-3 px-4 py-2 rounded-lg text-sm text-center 
            bg-gray-800 hover:bg-gray-700 transition"
          >
            View Profile
          </Link>

        </div>
      </aside>
    </>
  );
}