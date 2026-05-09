const axios = require('axios');

const fetchGitHubData = async (username) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token || token === 'your_github_personal_access_token_here') {
    throw new Error('GitHub token not configured in server/.env');
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        name
        login
        avatarUrl
        bio
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            name
            stargazerCount
            primaryLanguage {
              name
              color
            }
            url
            createdAt
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      {
        query,
        variables: { username }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const userData = response.data.data.user;
    if (!userData) {
      throw new Error('User not found');
    }

    // Transform and simplify data for frontend
    const profile = {
      name: userData.name || userData.login,
      username: userData.login,
      avatarUrl: userData.avatarUrl,
      bio: userData.bio,
      followers: userData.followers.totalCount,
      following: userData.following.totalCount,
      totalContributions: userData.contributionsCollection.contributionCalendar.totalContributions
    };

    const repositories = userData.repositories.nodes.map(repo => ({
      name: repo.name,
      stars: repo.stargazerCount,
      language: repo.primaryLanguage ? repo.primaryLanguage.name : 'Unknown',
      languageColor: repo.primaryLanguage ? repo.primaryLanguage.color : '#ccc',
      url: repo.url,
      createdAt: repo.createdAt
    }));

    return { profile, repositories };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid GitHub token. Rate limit or unauthorized.');
    }
    throw error;
  }
};

module.exports = { fetchGitHubData };
