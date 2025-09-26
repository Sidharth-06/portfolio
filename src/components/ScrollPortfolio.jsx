import React, { useEffect, useState, useRef } from 'react';
import './ScrollPortfolio.css';
import GitHubService from '../services/GitHubService';
import animVideo from '../assets/anim.mp4';
import emailjs from '@emailjs/browser';

// EmailJS configuration via Vite env variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS with public key from env (optional when passing key to sendForm)
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const ScrollPortfolio = () => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [skillProgress, setSkillProgress] = useState({});
  const [githubData, setGithubData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  
  // Contact form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const form = useRef();

  // Featured projects from resume
  const featuredProjects = [
    {
      id: 'dew-featured',
      title: 'Dew',
      subtitle: 'Cross-platform Music Application',
      description: 'Developed a comprehensive music application using Flutter with features like video playback, chatrooms, music sharing, and interactive polls. Designed an intuitive and responsive UI enhancing user experience across devices.',
      github: 'https://github.com/Sidharth-06/Dew',
      live: null,
      language: 'Dart',
      languageColor: '#00B4AB',
      technologies: ['Flutter', 'Firebase', 'Dart'],
      metrics: {
        stars: 0,
        forks: 0,
        updated: 'Dec 2024'
      },
      featured: true,
      category: 'mobile',
      icon: '🎵'
    },
    {
      id: 'sorting-hat-featured',
      title: 'Sorting Hat',
      subtitle: 'Harry Potter House Classifier',
      description: 'Web application that determines user\'s Hogwarts House based on responses using a Roberta-based textual emotion recognition model. Built with React frontend and Python backend with RESTful API.',
      github: 'https://github.com/Sidharth-06/Sorting-Hat',
      live: null,
      language: 'JavaScript',
      languageColor: '#f1e05a',
      technologies: ['React', 'Python', 'Machine Learning', 'RoBERTa'],
      metrics: {
        stars: 0,
        forks: 0,
        updated: 'July 2024'
      },
      featured: true,
      category: 'ai',
      icon: '🎩'
    },
    {
      id: 'heart-attack-predictor-featured',
      title: 'Heart Attack Predictor',
      subtitle: 'ML-based Health Assessment Tool',
      description: 'Machine learning application for predicting heart attack likelihood with dual input options: manual data entry and PDF uploads of ECG readings from smartwatches. Provides real-time risk assessments.',
      github: 'https://github.com/Sidharth-06/Heart-attack-preditor',
      live: null,
      language: 'Python',
      languageColor: '#3572A5',
      technologies: ['Python', 'Machine Learning', 'Healthcare', 'Data Analysis'],
      metrics: {
        stars: 0,
        forks: 0,
        updated: 'Hackathon Project'
      },
      featured: true,
      category: 'ai',
      icon: '❤️'
    }
  ];

  // Skills data based on resume
  const skills = {
    'Python & AI/ML': { level: 90, projects: 3, experience: '2+ years' },
    'Flutter & Dart': { level: 85, projects: 2, experience: '1+ years' },
    'React & JavaScript': { level: 80, projects: 2, experience: '1+ years' },
    'C Programming': { level: 75, projects: 5, experience: '3+ years' },
    'Node.js': { level: 70, projects: 2, experience: '6 months' },
    'PyTorch & TensorFlow': { level: 75, projects: 2, experience: '1+ years' }
  };

  // Load GitHub data
  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        setLoadingRepos(true);
        const username = 'Sidharth-06'; // Replace with your GitHub username
        
        const [userStats, repos] = await Promise.all([
          GitHubService.fetchUserStats(username),
          GitHubService.fetchRepositories(username)
        ]);

        setGithubData(userStats);
        
        // Transform repository data to match component expectations
        const transformedRepos = repos.map(repo => ({
          id: repo.id,
          title: repo.name,
          subtitle: repo.language || 'Project',
          description: repo.description || 'No description available',
          github: repo.html_url,
          live: null, // Could be extracted from README or package.json in future
          language: repo.language,
          languageColor: GitHubService.getLanguageColor(repo.language),
          technologies: repo.language ? [repo.language] : [],
          metrics: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updated: GitHubService.formatDate(repo.updated_at)
          },
          featured: repo.stargazers_count > 5, // Mark repos with >5 stars as featured
          category: repo.language === 'JavaScript' || repo.language === 'TypeScript' ? 'web' :
                   repo.language === 'Python' ? 'ai' :
                   repo.language === 'Java' || repo.language === 'Kotlin' ? 'mobile' : 'other',
          icon: repo.language === 'JavaScript' ? '⚛️' :
                repo.language === 'TypeScript' ? '🔷' :
                repo.language === 'Python' ? '🐍' :
                repo.language === 'Java' ? '☕' : '💻'
        }));
        
        // Combine featured projects with GitHub repos, prioritizing featured projects
        const allProjects = [...featuredProjects, ...transformedRepos];
        setRepositories(allProjects);
      } catch (error) {
        console.error('Error loading GitHub data:', error);
      } finally {
        setLoadingRepos(false);
      }
    };

    loadGitHubData();
  }, []);

  // Contact form handlers
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, {
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setStateMessage('Message sent!');
          setIsSubmitting(false);
          form.current.reset(); // Clear form after success
          setTimeout(() => {
            setStateMessage(null);
          }, 5000); // hide message after 5 seconds
        },
        (error) => {
          console.log('FAILED...', error.text);
          setStateMessage('Something went wrong, please try again later');
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
          }, 5000); // hide message after 5 seconds
        }
      );
  };

  // Navigation function for sections
  const navigateToSection = (section) => {
    if (isTransitioning || activeSection === section) return;
    
    setIsTransitioning(true);
    
    // Smooth transition effect
    setTimeout(() => {
      setActiveSection(section);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  // Handle mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const handleKeyDown = (e) => {
      if (isTransitioning) return;
      
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const currentIndex = sections.indexOf(activeSection);
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
          navigateToSection(sections[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          navigateToSection(sections[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    
    // Simulate loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Animate skill progress when skills section becomes active
    if (activeSection === 'skills') {
      Object.keys(skills).forEach((skill, index) => {
        setTimeout(() => {
          setSkillProgress(prev => ({
            ...prev,
            [skill]: skills[skill].level
          }));
        }, index * 200);
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(loadingTimer);
    };
  }, [activeSection, isTransitioning]);

  // Render different sections
  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroSection();
      case 'about':
        return renderAboutSection();
      case 'skills':
        return renderSkillsSection();
      case 'projects':
        return renderProjectsSection();
      case 'contact':
        return renderContactSection();
      default:
        return renderHeroSection();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">
            <div className="logo-ring"></div>
            <div className="logo-inner">S</div>
          </div>
          <h2>Sidharth Krishna K T's Portfolio</h2>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderHeroSection = () => (
    <div className="section-content hero-content-wrapper">
      <div className="hero-background">
        <div className="floating-elements">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`floating-element element-${i}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 20}s`
              }}
            ></div>
          ))}
        </div>
        <div className="grid-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="title-line">Hello, I'm</span>
            <span className="name-highlight">Sidharth </span>
            <span className="title-line">Flutter Dev & AI Enthusiast</span>
          </h1>
          <p className="hero-subtitle">
            Student with experience in AI/ML research, cross-platform development, and innovative tech solutions
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">
                {githubData ? githubData.stats.totalRepos : '...'}
              </span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {githubData ? GitHubService.formatNumber(githubData.stats.totalStars) : '...'}
              </span>
              <span className="stat-label">Stars</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {githubData ? GitHubService.formatNumber(githubData.profile.followers) : '...'}
              </span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
          <div className="hero-actions">
            <button className="cta-primary" onClick={() => navigateToSection('projects')}>
              View My Work
            </button>
            <button className="cta-secondary" onClick={() => navigateToSection('contact')}>
              Get In Touch
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="avatar-container">
            <div className="avatar-glow"></div>
            <div className="avatar-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
            <div className="avatar-video-container">
              <video 
                src={animVideo} 
                alt="Sidharth Krishna K T" 
                className="avatar-image"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className="tech-orbits">
              <div className="orbit orbit-1">
                <div className="tech-icon">⚛️</div>
              </div>
              <div className="orbit orbit-2">
                <div className="tech-icon">🤖</div>
              </div>
              <div className="orbit orbit-3">
                <div className="tech-icon">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span>Navigate with arrows or dots</span>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="section-content about-content-wrapper">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Passionate about creating intelligent, impactful solutions</p>
        </div>
        <div className="about-content">
          <div className="about-text">
            <div className="about-card">
              <h3>My Journey</h3>
              <p>
                I'm an MCA student passionate about AI/ML, cross-platform development, and creating innovative solutions that make a real impact. I have completed a Research Associate position on an IIM-Granted Research Project, where I conducted sentiment analysis on Shark Tank India pitches using Large Language Models.
              </p>
              <p>
                Currently pursuing my Integrated MCA at Amrita Vishwa Vidyapeetham, Mysore (CGPA: 7.76). 
                My technical expertise spans Python, Flutter, React, and machine learning frameworks like PyTorch and TensorFlow.
              </p>
              <p>
                📍 Based in Mysore, Karnataka • MCA Student & Aspiring AI Developer
              </p>
            </div>
            <div className="about-card">
              <h3>Education</h3>
              <p>
                <strong>Amrita Vishwa Vidyapeetham, Mysore</strong><br/>
                Integrated MCA (2021 - 2026) • CGPA: 7.76
              </p>
              <p>
                <strong>Carmel CMI School, Palakkad</strong><br/>
                12th with Commerce (2020 - 2021) • 95.6%
              </p>
            </div>
            <div className="about-card">
              <h3>Recent Experience</h3>
              <p>
                <strong>Research Associate</strong> (July 2024 - Jan 2025)<br/>
                IIM-Granted Research Project - <em>Completed</em>
              </p>
              <p>
                • Conducted sentiment analysis on 50 Shark Tank India pitches using Large Language Models<br/>
                • Extracted and analyzed textual and tonal sentiments from pitch transcripts<br/>
                • Applied NLP techniques including sentiment scoring, entity recognition, speaker diarization
              </p>
            </div>
            <div className="about-card">
              <h3>Certifications</h3>
              <p>
                <strong>Introduction To Flutter</strong> - Udemy (October 2021)<br/>
                <strong>Bug Bounty Hunting</strong> - Udemy (June 2024)<br/>
                <strong>Introduction to Ethical Hacking</strong> - Offenso Hackers Academy (February 2023)
              </p>
            </div>
            <div className="achievements">
              <div className="achievement-item">
                <div className="achievement-icon">⭐</div>
                <div className="achievement-text">
                  <h4>{githubData ? GitHubService.formatNumber(githubData.stats.totalStars) : '...'} Stars</h4>
                  <p>GitHub recognition</p>
                </div>
              </div>
              <div className="achievement-item">
                <div className="achievement-icon">🚀</div>
                <div className="achievement-text">
                  <h4>{githubData ? githubData.stats.totalRepos : '...'} Projects</h4>
                  <p>Public repositories</p>
                </div>
              </div>
              <div className="achievement-item">
                <div className="achievement-icon">👥</div>
                <div className="achievement-text">
                  <h4>{githubData ? GitHubService.formatNumber(githubData.profile.followers) : '...'} Followers</h4>
                  <p>GitHub community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="section-content skills-content-wrapper">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">Mastering the tools that power innovation</p>
        </div>
        <div className="skills-grid">
          {Object.entries(skills).map(([skill, data]) => (
            <div key={skill} className="skill-card">
              <div className="skill-header">
                <h3>{skill}</h3>
                <span className="skill-percentage">{skillProgress[skill] || 0}%</span>
              </div>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{ width: `${skillProgress[skill] || 0}%` }}
                ></div>
              </div>
              <div className="skill-details">
                <span>{data.projects} projects</span>
                <span>{data.experience}</span>
              </div>
            </div>
          ))}
          
          {githubData?.stats.topLanguages && (
            <div className="github-languages">
              <h3>Top Languages from GitHub</h3>
              <div className="languages-grid">
                {githubData.stats.topLanguages.map((lang) => (
                  <div key={lang.language} className="language-item">
                    <div 
                      className="language-dot" 
                      style={{ backgroundColor: GitHubService.getLanguageColor(lang.language) }}
                    ></div>
                    <span className="language-name">{lang.language}</span>
                    <span className="language-count">{lang.count} repos</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProjectsSection = () => (
    <div className="section-content projects-content-wrapper">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Innovative solutions that make a difference</p>
        </div>
        <div className="projects-grid">
          {repositories.map((project) => (
              <div key={project.id} className={`project-card ${project.featured ? 'featured' : ''} ${project.category}`}>
                <div className="project-image" style={{
                  background: project.category === 'ai' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                             project.category === 'web' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                             project.category === 'mobile' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                             'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                }}>
                  <div className="project-icon">
                    {project.icon}
                  </div>
                  <div className="project-pattern"></div>
                  <div className="language-indicator" style={{ backgroundColor: project.languageColor }}>
                    {project.language}
                  </div>
                  <div className="project-overlay">
                    <div className="project-actions">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link" title="View Code">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </a>
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link" title="Live Demo">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="project-technologies">
                      {project.technologies.map(tech => (
                        <span 
                          key={tech} 
                          className="tech-tag"
                          style={{ 
                            borderColor: GitHubService.getLanguageColor(tech),
                            color: GitHubService.getLanguageColor(tech)
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">{project.metrics.stars}</span>
                      <span className="metric-label">Stars</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{project.metrics.forks}</span>
                      <span className="metric-label">Forks</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value" title={project.metrics.updated}>
                        {project.metrics.updated.replace('Updated ', '')}
                      </span>
                      <span className="metric-label">Updated</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="section-content contact-content-wrapper">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Let's Build Something Amazing</h2>
          <p className="section-subtitle">Ready to turn your ideas into reality</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <h3>Get In Touch</h3>
              <p>I'm always excited to work on innovative projects and collaborate with talented people.</p>
              <div className="contact-methods">
                <a href="mailto:sidharthkrishna441@gmail.com" className="contact-method">
                  <div className="method-icon">📧</div>
                  <div className="method-text">
                    <h4>Email</h4>
                    <p>sidharthkrishna441@gmail.com</p>
                  </div>
                </a>
                <a href="tel:+917902648728" className="contact-method">
                  <div className="method-icon">📱</div>
                  <div className="method-text">
                    <h4>Phone</h4>
                    <p>+91 7902648728</p>
                  </div>
                </a>
                <a href="http://linkedin.com/in/sidharth-k-t-065b2b22a" target="_blank" rel="noopener noreferrer" className="contact-method">
                  <div className="method-icon">💼</div>
                  <div className="method-text">
                    <h4>LinkedIn</h4>
                    <p>Connect professionally</p>
                  </div>
                </a>
                <a href="https://github.com/Sidharth-06" target="_blank" rel="noopener noreferrer" className="contact-method">
                  <div className="method-icon">🚀</div>
                  <div className="method-text">
                    <h4>GitHub</h4>
                    <p>Check out my code</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form ref={form} className="form" onSubmit={sendEmail}>
              {/* Hidden field for timestamp */}
              <input type="hidden" name="time" value={new Date().toLocaleString()} />
              
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="user_name"
                  placeholder="Your name" 
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="user_email"
                  placeholder="your.email@example.com" 
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  name="message"
                  placeholder="Tell me about your project..."
                  required
                ></textarea>
              </div>
              
              {stateMessage && (
                <div className={`form-status ${stateMessage.includes('sent') ? 'success' : 'error'}`}>
                  {stateMessage.includes('sent') ? '✅' : '❌'} {stateMessage}
                </div>
              )}
              
              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                <button
                  type="button"
                  className="submit-button secondary"
                  onClick={() => {
                    const subject = encodeURIComponent('Portfolio Contact');
                    const body = encodeURIComponent(`Hi Sidharth,\n\nI would like to get in touch with you regarding your portfolio.`);
                    window.location.href = `mailto:sidharthkrishna441@gmail.com?subject=${subject}&body=${body}`;
                  }}
                >
                  📧 Email Directly
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="scroll-portfolio" ref={containerRef}>
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-content">
          <div className="nav-logo">
            
          </div>
          <div className="nav-links">
            <button onClick={() => navigateToSection('hero')} className={activeSection === 'hero' ? 'active' : ''}>
              Home
            </button>
            <button onClick={() => navigateToSection('about')} className={activeSection === 'about' ? 'active' : ''}>
              About
            </button>
            <button onClick={() => navigateToSection('skills')} className={activeSection === 'skills' ? 'active' : ''}>
              Skills
            </button>
            <button onClick={() => navigateToSection('projects')} className={activeSection === 'projects' ? 'active' : ''}>
              Projects
            </button>
            <button onClick={() => navigateToSection('contact')} className={activeSection === 'contact' ? 'active' : ''}>
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Main Section Container */}
      <main className={`main-section ${activeSection} ${isTransitioning ? 'transitioning' : ''}`}>
        {renderSection()}
      </main>

      {/* Section Navigation Dots */}
      <div className="section-dots">
        {['hero', 'about', 'skills', 'projects', 'contact'].map((section) => (
          <button
            key={section}
            className={`dot ${activeSection === section ? 'active' : ''}`}
            onClick={() => navigateToSection(section)}
            title={section.charAt(0).toUpperCase() + section.slice(1)}
          >
            <span></span>
          </button>
        ))}
      </div>

      {/* Section Transition Overlay */}
      {isTransitioning && (
        <div className="transition-overlay">
          <div className="transition-content">
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollPortfolio;