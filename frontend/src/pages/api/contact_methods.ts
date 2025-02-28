export const fetchContactMethods = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://alumnitrackertest-958bb6be1026.herokuapp.com";
    const response = await fetch(`${API_URL}/contact_methods`);
    if (!response.ok) throw new Error('Failed to fetch contact methods');
    return response.json();
};
