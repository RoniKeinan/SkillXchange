import React, { useEffect, useState } from "react";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2.5rem 1rem',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2.7rem',
    fontWeight: 900,
    letterSpacing: '-1px',
    marginBottom: '0.3rem',
    textShadow: '0 2px 12px #dbeafe',
  },
  gradientText: {
    background: 'linear-gradient(90deg, #6366f1, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.13rem',
    color: '#475569',
    marginBottom: '0.8rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '1100px',
    padding: '0 1rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 4px 14px rgba(49, 130, 206, 0.11)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  skillName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '1.7rem',
    fontWeight: 600,
    color: '#0f172a',
  },
};

type Stats = {
  invocationsLast24h: number;
  errorsLast24h: number;
  avgDurationMs: number;
  dynamoReads: number;
  dynamoWrites: number;
};

interface AdminPageProps {
  isAdmin: boolean;
}

const AdminPage: React.FC<AdminPageProps> = ({ isAdmin }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    fetch("https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/admin")
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
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🔒 Access Denied</h2>
        <p style={styles.heroSubtitle}>
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={{ ...styles.title, ...styles.gradientText }}>
           Admin Dashboard
        </h1>
        <p style={styles.heroSubtitle}>
          Overview of system activity in the past 24 hours.
        </p>
      </div>

      {loading && <p style={styles.heroSubtitle}>Loading stats...</p>}
      {error && <p style={{ ...styles.heroSubtitle, color: "red" }}>Error: {error}</p>}

      {stats && (
        <div style={styles.skillsGrid}>
          <div style={styles.card}>
            <h3 style={styles.skillName}>Exchange Invocations</h3>
            <p style={styles.description}>{stats.invocationsLast24h}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.skillName}>Lambda Errors</h3>
            <p
              style={{
                ...styles.description,
                color: stats.errorsLast24h > 0 ? "#dc2626" : "#16a34a",
              }}
            >
              {stats.errorsLast24h}
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.skillName}>Avg Duration (ms)</h3>
            <p style={styles.description}>{stats.avgDurationMs}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.skillName}>DynamoDB Reads</h3>
            <p style={styles.description}>{stats.dynamoReads}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.skillName}>DynamoDB Writes</h3>
            <p style={styles.description}>{stats.dynamoWrites}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
