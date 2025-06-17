import React, { useEffect, useState } from "react";

type Stats = {
  totalSkillRequests: number;
  lambdaInvocations: number;
};

interface AdminPageProps {
  isAdmin: boolean;
}

const AdminPage: React.FC<AdminPageProps> = ({ isAdmin }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return; // don't fetch if not admin

    // Example: Fetch stats from your backend API
    fetch("https://your-api.com/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching stats: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [isAdmin]);

  if (!isAdmin) {
    return <div><h2>Access Denied</h2><p>You do not have permission to view this page.</p></div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {loading && <p>Loading stats...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {stats && (
        <div>
          <p><strong>Total Skill Exchange Requests:</strong> {stats.totalSkillRequests}</p>
          <p><strong>Lambda Invocations:</strong> {stats.lambdaInvocations}</p>
          {/* Add more stats/widgets here */}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
