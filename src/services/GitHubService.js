// GitHub API Service - Fetches repository data and README content
const GITHUB_USERNAME = 'Sidharth-06';
const GITHUB_API_BASE = 'https://api.github.com';

class GitHubService {
  static async fetchUserProfile() {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      return null;
    }
  }

  static async fetchRepositories(page = 1, perPage = 30) {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?page=${page}&per_page=${perPage}&sort=updated&type=owner`
      );
      if (!response.ok) throw new Error('Failed to fetch repositories');
      const repos = await response.json();
      
      // Filter out forks and sort by stars/recent activity
      return repos
        .filter(repo => !repo.fork)
        .sort((a, b) => {
          // Sort by stars first, then by recent updates
          if (b.stargazers_count !== a.stargazers_count) {
            return b.stargazers_count - a.stargazers_count;
          }
          return new Date(b.updated_at) - new Date(a.updated_at);
        });
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  }

  static async fetchRepositoryReadme(repoName) {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/readme`
      );
      if (!response.ok) return null;
      
      const readmeData = await response.json();
      // Decode base64 content
      const content = atob(readmeData.content);
      return {
        content,
        downloadUrl: readmeData.download_url,
        htmlUrl: readmeData.html_url
      };
    } catch (error) {
      console.error(`Error fetching README for ${repoName}:`, error);
      return null;
    }
  }

  static async fetchRepositoryLanguages(repoName) {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/languages`
      );
      if (!response.ok) return {};
      return await response.json();
    } catch (error) {
      console.error(`Error fetching languages for ${repoName}:`, error);
      return {};
    }
  }

  static async fetchRepositoryContents(repoName, path = '') {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/contents/${path}`
      );
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error(`Error fetching contents for ${repoName}:`, error);
      return [];
    }
  }

  static async fetchUserStats() {
    try {
      const [profile, repos] = await Promise.all([
        this.fetchUserProfile(),
        this.fetchRepositories(1, 100) // Fetch more repos for stats
      ]);

      if (!profile || !repos) return null;

      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
      const languages = {};
      
      // Count language usage across repositories
      repos.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      const topLanguages = Object.entries(languages)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([lang, count]) => ({ language: lang, count }));

      return {
        profile: {
          name: profile.name || profile.login,
          bio: profile.bio,
          location: profile.location,
          company: profile.company,
          blog: profile.blog,
          followers: profile.followers,
          following: profile.following,
          publicRepos: profile.public_repos,
          createdAt: profile.created_at,
          avatarUrl: profile.avatar_url,
          htmlUrl: profile.html_url
        },
        stats: {
          totalStars,
          totalForks,
          totalRepos: repos.length,
          topLanguages
        },
        repositories: repos.slice(0, 12) // Top 12 repositories
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  static parseReadmeContent(content) {
    if (!content) return { title: '', description: '', sections: [] };

    const lines = content.split('\n');
    let title = '';
    let description = '';
    const sections = [];
    let currentSection = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extract title (first # heading)
      if (line.startsWith('# ') && !title) {
        title = line.substring(2).trim();
        continue;
      }

      // Extract description (first paragraph after title)
      if (!description && line && !line.startsWith('#') && !line.startsWith('!') && line.length > 20) {
        description = line;
        continue;
      }

      // Extract sections
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.substring(3).trim(),
          content: []
        };
      } else if (currentSection && line) {
        currentSection.content.push(line);
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return {
      title: title || 'Repository',
      description: description || 'No description available',
      sections: sections.slice(0, 3) // Limit to 3 sections for display
    };
  }

  static getLanguageColor(language) {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
      HTML: '#e34c26',
      CSS: '#1572B6',
      SCSS: '#c6538c',
      Vue: '#4FC08D',
      React: '#61DAFB',
      Angular: '#DD0031',
      Node: '#339933'
    };
    return colors[language] || '#858585';
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Updated ${Math.ceil(diffDays / 30)} months ago`;
    return `Updated ${Math.ceil(diffDays / 365)} years ago`;
  }

  static formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}

export default GitHubService;