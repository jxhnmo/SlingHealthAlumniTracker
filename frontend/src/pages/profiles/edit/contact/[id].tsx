import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface ContactMethod {
    id: number;
    contact_type: string;
    info: string;
    user_id: number;
}

const EditContactMethods: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
    const [newContactMethod, setNewContactMethod] = useState({ contact_type: "", info: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com";

    useEffect(() => {
        if (!id) return;
        const fetchContactMethods = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch(`${API_BASE_URL}/contact_methods`);
                if (!response.ok) throw new Error("Failed to fetch contact methods");
                const data = await response.json();
                setContactMethods(data.filter((contact: ContactMethod) => contact.user_id === Number(id)));
            } catch (err) {
                setError("Error loading contact methods");
            } finally {
                setLoading(false);
            }
        };
        fetchContactMethods();
    }, [id]);

    const handleUpdate = async (contactId: number, updatedContact: ContactMethod) => {
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/contact_methods/${contactId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedContact),
            });
            if (!response.ok) throw new Error("Failed to update contact method");
            setContactMethods((prev) => prev.map((contact) => (contact.id === contactId ? updatedContact : contact)));
        } catch {
            setError("Error updating contact method");
        }
    };

    const handleDelete = async (contactId: number) => {
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/contact_methods/${contactId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete contact method");
            setContactMethods((prev) => prev.filter((contact) => contact.id !== contactId));
        } catch {
            setError("Error deleting contact method");
        }
    };

    const handleCreate = async () => {
        setError("");
        if (!newContactMethod.contact_type || !newContactMethod.info) {
            setError("Contact type and info are required");
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/contact_methods`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newContactMethod, user_id: Number(id) }),
            });
            if (!response.ok) throw new Error("Failed to create contact method");
            const createdContact = await response.json();
            setContactMethods([...contactMethods, createdContact]);
            setNewContactMethod({ contact_type: "", info: "" });
        } catch {
            setError("Error creating contact method");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Edit Contact Methods</h1>
            <Link href={`/profiles/edit/${id}`}>Go Back</Link>
            <div>
                {contactMethods.map((contact) => (
                    <div key={contact.id}>
                        <input
                            type="text"
                            value={contact.contact_type}
                            onChange={(e) => handleUpdate(contact.id, { ...contact, contact_type: e.target.value })}
                            className="block"
                        />
                        <textarea
                            value={contact.info}
                            onChange={(e) => handleUpdate(contact.id, { ...contact, info: e.target.value })}
                            className="block"
                        />
                        <button onClick={() => handleDelete(contact.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <div>
                <h2>Add New Contact Method</h2>
                <input
                    type="text"
                    placeholder="Contact Type"
                    value={newContactMethod.contact_type}
                    onChange={(e) => setNewContactMethod({ ...newContactMethod, contact_type: e.target.value })}
                    className="block"
                />
                <textarea
                    placeholder="Info"
                    value={newContactMethod.info}
                    onChange={(e) => setNewContactMethod({ ...newContactMethod, info: e.target.value })}
                    className="block"
                />
                <button onClick={handleCreate}>
                    Add Contact Method
                </button>
            </div>
        </div>
    );
};

export default EditContactMethods;
