export const fetchUsers = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com";
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};
