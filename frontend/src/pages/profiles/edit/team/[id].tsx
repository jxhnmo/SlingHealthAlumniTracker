import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Team {
  id: number;
  team_name: string;
  team_area: string;
}

const EditTeam: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [team, setTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState({
    team_name: "",
    team_area: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com";

  useEffect(() => {
    if (!id) return;
    const fetchTeam = async () => {
      setLoading(true);
      setError("");
      try {
        const [teamResponse, teamsUsersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/teams`),
          fetch(`${API_BASE_URL}/teams_users`),
        ]);
        if (!teamResponse.ok) throw new Error("Failed to fetch team");
        if (!teamsUsersResponse.ok)
          throw new Error("Failed to fetch teams_users");
        const teamData: Team[] = await teamResponse.json();
        const teamsUsersData: { user_id: number; team_id: number }[] =
          await teamsUsersResponse.json();

        setTeam(
          teamData.filter((team) =>
            teamsUsersData.some(
              (tu) =>
                tu.user_id === Number(id) && tu.team_id === Number(team.id)
            )
          )[0]
        );
      } catch (err) {
        setError("Error loading team");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [id]);

  const handleUpdate = async (teamId: number, updatedTeam: Team) => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_name: updatedTeam.team_name,
          team_area: updatedTeam.team_area,
        }),
      });
      if (!response.ok) throw new Error("Failed to update team");
      setTeam(updatedTeam);
      router.push(`/profiles/${id}`);
    } catch (err) {
      setError("Error updating team");
    }
  };

  const handleCreate = async () => {
    setError("");
    if (
      newTeam &&
      ((newTeam.team_name && !newTeam.team_area) ||
        (!newTeam.team_name && newTeam.team_area))
    ) {
      setError("Please fill in both fields for team.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team: {
            team_name: newTeam.team_name,
            team_area: newTeam.team_area,
          },
          user_id: id,
        }),
      });
      if (!response.ok) throw new Error("Failed to create team");
      const createdTeam = await response.json();
      setTeam(createdTeam);
      setNewTeam({ team_name: "", team_area: "" });
    } catch (err) {
      setError("Error creating team");
    }
  };

  const handleDelete = async (teamId: number) => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete team");
      setTeam(null);
      router.push(`/profiles/${id}`);
    } catch (err) {
      setError("Error deleting team");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Edit Team</h1>
      <Link href={`/profiles/${id}`}>Go Back</Link>
      {team ? (
        <div>
          <input
            type="text"
            value={team.team_name}
            onChange={(e) => setTeam({ ...team, team_name: e.target.value })}
          />
          <input
            type="text"
            value={team.team_area}
            onChange={(e) => setTeam({ ...team, team_area: e.target.value })}
          />
          <button onClick={() => handleUpdate(team.id, team)}>
            Update Team
          </button>
          <button onClick={() => handleDelete(team.id)}>Delete Team</button>
        </div>
      ) : (
        <div>No team found.</div>
      )}
      {!team ? (
        <div>
          <h2>Create New Team</h2>
          <input
            type="text"
            placeholder="Team Name"
            value={newTeam.team_name}
            onChange={(e) =>
              setNewTeam({ ...newTeam, team_name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Team Area"
            value={newTeam.team_area}
            onChange={(e) =>
              setNewTeam({ ...newTeam, team_area: e.target.value })
            }
          />
          <button onClick={handleCreate}>Create Team</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EditTeam;
