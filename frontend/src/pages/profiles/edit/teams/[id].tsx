import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  major: string;
  graduation_year: number;
  user_profile_url: string;
  biography?: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  members: User[];
}

const EditTeams: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    members: [],
  });
  const [newMembers, setNewMembers] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Edit Teams</h1>
      <Link href={`/profiles/edit/${id}`}>Go Back</Link>
      <div>
        {teams.map((team) => (
          <div key={team.id}>
            <input type="text" value={team.name} className="block" />
            <textarea value={team.description} className="block" />
            <div className="block">
              <h2>Members</h2>
              <div>
                {/*TODO: Implement search feature*/}
                <input type="text" placeholder="user@email.com" />
                <button>Add Members</button>
              </div>

              {team.members.map((member) => (
                <div key={member.id}>
                  <img src={member.user_profile_url} alt={member.name} />
                  <p>{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2>Create a Team</h2>
        <input
          type="text"
          placeholder="Team Name"
          value={newTeam.name}
          className="block"
        />
        <textarea
          placeholder="Description"
          value={newTeam.description}
          className="block"
        />
        <div>
          {/*TODO: Implement search feature*/}
          <input type="text" placeholder="user@email.com" />
          <button>Add Members</button>
        </div>
        <button>Create Team</button>
      </div>
    </div>
  );
};

export default EditTeams;
