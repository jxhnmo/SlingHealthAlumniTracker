import React, { useState } from "react";
import { useRouter } from "next/router";

const CreateContact: React.FC = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<number | "">("");
    const [contactType, setContactType] = useState("");
    const [info, setInfo] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError("User ID is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://alumnitrackertest-958bb6be1026.herokuapp.com"}/contact_methods`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: Number(userId), contact_type: contactType, info })
            });

            if (!response.ok) throw new Error("Failed to create contact method");
            router.push(`/profile?id=${userId}`);
        } catch (err) {
            setError("Error creating contact method");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Add a Contact Method</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    User ID:
                    <input type="number" value={userId} onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : "")} required />
                </label>
                <label>
                    Contact Type:
                    <input type="text" value={contactType} onChange={(e) => setContactType(e.target.value)} required />
                </label>
                <label>
                    Info:
                    <input type="text" value={info} onChange={(e) => setInfo(e.target.value)} required />
                </label>
                <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Contact"}</button>
            </form>
        </div>
    );
};

export default CreateContact;
