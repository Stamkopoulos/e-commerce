export default function useAdminAuth() {
  const user = JSON.parse(localStorage.getItem("user"));
  return { isAdmin: user?.role === "admin" };
}
