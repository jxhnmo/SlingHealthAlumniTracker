const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const fetchDocuments = async () => {
  const response = await fetch(`${API_URL}/documents`);
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }
  return response.json();
};
