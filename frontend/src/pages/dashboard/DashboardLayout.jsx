import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function DashboardLayout() {
  const { isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/dashboard/login" replace />;

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <span className="eyebrow">Polyaymen / Studio</span>
        <nav>
          <NavLink to="/dashboard/projects">Projects</NavLink>
          <NavLink to="/dashboard/projects/new">New Project</NavLink>
          <NavLink to="/dashboard/inbox">Inbox</NavLink>
          <button
            onClick={logout}
            className="eyebrow"
            style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}
          >
            Log out
          </button>
        </nav>
      </aside>
      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
}
