export const fetchUsers = async () => {
  console.log("fetchUsers = async ()");
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://alumnitracker-e69ed4dc1beb.herokuapp.com";
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};
