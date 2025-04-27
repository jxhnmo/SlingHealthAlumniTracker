export const fetchAchievements = async () => {
  console.log("fetchAchievements = async ()");
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://alumnitracker-e69ed4dc1beb.herokuapp.com";
  const response = await fetch(`${API_URL}/achievements`);
  if (!response.ok) throw new Error('Failed to fetch achievements');
  return response.json();
};
