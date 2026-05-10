import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
<div className="flex min-h-screen bg-gray-100">

  {/* Sidebar */}
  <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

  {/* Content */}
  <div className="flex-1 flex flex-col">

    <Navbar onMenuClick={() => setIsOpen(true)} />

    <main className="p-6 flex-1">
      {children}
    </main>

  </div>
</div>
  );
}