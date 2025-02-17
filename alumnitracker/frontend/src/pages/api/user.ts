export const fetchUsers = async () => {
  const response = await fetch('/userIndex'); 
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};