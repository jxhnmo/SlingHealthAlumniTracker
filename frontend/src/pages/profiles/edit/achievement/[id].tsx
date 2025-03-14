import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Achievement {
    id: number;
    name: string;
    description: string;
    user_id: number;
}

const EditAchievements: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [newAchievement, setNewAchievement] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://alumnitrackertest-958bb6be1026.herokuapp.com";

    useEffect(() => {
        if (!id) return;
        const fetchAchievements = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch(`${API_BASE_URL}/achievements?user=${id}`);
                if (!response.ok) throw new Error("Failed to fetch achievements");
                const data = await response.json();
                setAchievements(data.filter((ach: Achievement) => ach.user_id === Number(id)));
            } catch (err) {
                setError("Error loading achievements");
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, [id]);

    const handleUpdate = async (achievementId: number, updatedAchievement: Achievement) => {
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedAchievement),
            });
            if (!response.ok) throw new Error("Failed to update achievement");
            setAchievements((prev) => prev.map((ach) => (ach.id === achievementId ? updatedAchievement : ach)));
        } catch {
            setError("Error updating achievement");
        }
    };

    const handleDelete = async (achievementId: number) => {
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete achievement");
            setAchievements((prev) => prev.filter((ach) => ach.id !== achievementId));
        } catch {
            setError("Error deleting achievement");
        }
    };

    const handleCreate = async () => {
        setError("");
        if (!newAchievement.name || !newAchievement.description) {
            setError("Name and description are required");
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/achievements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newAchievement, user_id: Number(id) }),
            });
            if (!response.ok) throw new Error("Failed to create achievement");
            const createdAchievement = await response.json();
            setAchievements([...achievements, createdAchievement]);
            setNewAchievement({ name: "", description: "" });
        } catch {
            setError("Error creating achievement");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Edit Achievements</h1>
            <Link href={`/profiles/edit/${id}`}>Go Back</Link>
            <div>
                {achievements.map((achievement) => (
                    <div key={achievement.id} >
                        <input
                            type="text"
                            value={achievement.name}
                            onChange={(e) => handleUpdate(achievement.id, { ...achievement, name: e.target.value })}
                            className="block"
                        />
                        <textarea
                            value={achievement.description}
                            onChange={(e) => handleUpdate(achievement.id, { ...achievement, description: e.target.value })}
                            className="block"
                        />
                        <button onClick={() => handleDelete(achievement.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <div>
                <h2>Add New Achievement</h2>
                <input
                    type="text"
                    placeholder="Achievement Name"
                    value={newAchievement.name}
                    onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })}
                    className="block"
                />
                <textarea
                    placeholder="Description"
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                    className="block"
                />
                <button onClick={handleCreate}>
                    Add Achievement
                </button>
            </div>
        </div>
    );
};

export default EditAchievements;