import { useState } from 'react';
import { Search, Users, GitMerge, BookOpen, Star } from 'lucide-react';
import apiClient from '../api/client';
import { LanguageChart, RepoStarsChart } from '../components/Charts';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.get(`/analytics/${searchQuery}`);
      setData(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('User not found. Please check the username.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please check your GitHub token in the backend.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch analytics');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const processLanguages = (repos) => {
    const langCounts = {};
    repos.forEach(repo => {
      if (repo.language !== 'Unknown') {
        if (!langCounts[repo.language]) {
          langCounts[repo.language] = { value: 0, color: repo.languageColor };
        }
        langCounts[repo.language].value += 1;
      }
    });
    return Object.keys(langCounts).map(name => ({
      name,
      value: langCounts[name].value,
      color: langCounts[name].color
    })).sort((a, b) => b.value - a.value);
  };

  return (
    <div className="animate-fade-in">
      <form className="search-section" onSubmit={handleSearch}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} size={20} />
          <input
            type="text"
            placeholder="Search GitHub Username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px' }}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <div className="spinner"></div>}
      {error && <div className="error-msg" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{error}</div>}

      {data && !loading && (
        <div className="dashboard-content animate-fade-in">
          <div className="glass-panel profile-grid">
            <div className="profile-card">
              <img src={data.profile.avatarUrl} alt="Avatar" className="profile-avatar" />
              <h2>{data.profile.name}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>@{data.profile.username}</p>
              {data.profile.bio && <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{data.profile.bio}</p>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>GitHub Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="stat-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <Users size={18} />
                    <span className="stat-label">Followers</span>
                  </div>
                  <span className="stat-value">{data.profile.followers}</span>
                </div>
                
                <div className="stat-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <Users size={18} />
                    <span className="stat-label">Following</span>
                  </div>
                  <span className="stat-value">{data.profile.following}</span>
                </div>
                
                <div className="stat-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <BookOpen size={18} />
                    <span className="stat-label">Recent Repos</span>
                  </div>
                  <span className="stat-value">{data.repositories.length}</span>
                </div>

                <div className="stat-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <GitMerge size={18} />
                    <span className="stat-label">Yearly Contributions</span>
                  </div>
                  <span className="stat-value">{data.profile.totalContributions}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="glass-panel chart-card">
              <h3>Language Distribution</h3>
              <div className="chart-container">
                <LanguageChart data={processLanguages(data.repositories)} />
              </div>
            </div>
            
            <div className="glass-panel chart-card">
              <h3>Top Repositories by Stars</h3>
              <div className="chart-container">
                <RepoStarsChart data={data.repositories} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
