import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = "px-3 py-2 rounded hover:bg-gray-100 transition";

  const activeClass = "bg-gray-200 font-semibold";

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <h1 className="text-xl font-bold mb-8">Admin Panel</h1>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Users
        </NavLink>
      </nav>
    </aside>
  );
}
