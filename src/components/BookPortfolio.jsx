import React, { useState, useEffect, useRef } from 'react';
import './BookPortfolio.css';

const chapters = [
  { id: 'index', title: 'Table of Contents', icon: '📖' },
  { id: 'about', title: 'About Me', icon: '👨‍💻', page: 1, subtitle: 'Discover my journey' },
  { id: 'projects', title: 'My Projects', icon: '🚀', page: 2, subtitle: 'Innovation in action' },
  { id: 'skills', title: 'Technical Skills', icon: '⚡', page: 3, subtitle: 'Mastering the craft' },
  { id: 'fun', title: 'Fun Projects', icon: '🎨', page: 4, subtitle: 'Where creativity meets code' },
  { id: 'contact', title: 'Get In Touch', icon: '💬', page: 5, subtitle: 'Let\'s build together' }
];

const projects = [
  {
    id: 'dew',
    title: 'Dew',
    subtitle: 'Cross-Platform Music Experience',
    description: 'A revolutionary music application that transforms how users interact with audio content through immersive video playback, real-time chatrooms, and social sharing features.',
    features: [
      'Real-time synchronized video playback',
      'Community chatrooms with live reactions',
      'Advanced music sharing algorithms',
      'Cross-platform polling system',
      'Seamless offline/online experience'
    ],
    tech: ['Flutter', 'Firebase', 'Dart', 'WebRTC', 'Cloud Functions'],
    metrics: {
      users: '10K+',
      rating: '4.8/5',
      downloads: '50K+'
    },
    github: 'https://github.com/Sidharth-06/Dew',
    demo: null,
    image: '🎵',
    status: 'Live',
    year: '2024'
  },
  {
    id: 'heart-predictor',
    title: 'CardioGuard AI',
    subtitle: 'Intelligent Heart Health Monitor',
    description: 'Advanced machine learning system that predicts heart attack likelihood through multi-modal data analysis, including manual health metrics and ECG PDF interpretation from smartwatch devices.',
    features: [
      'ML-powered risk assessment algorithms',
      'ECG PDF parsing and analysis',
      'Smartwatch integration compatibility',
      'Real-time health monitoring dashboard',
      'Personalized prevention recommendations'
    ],
    tech: ['Python', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'FastAPI'],
    metrics: {
      accuracy: '94%',
      models: '5+',
      data: '100K+ records'
    },
    github: 'https://github.com/Sidharth-06/Heart-attack-preditor',
    demo: null,
    image: '❤️',
    status: 'Research',
    year: '2024'
  },
  {
    id: 'movie-db',
    title: 'CineVault',
    subtitle: 'Intelligent Movie Discovery',
    description: 'Sophisticated movie search and discovery platform featuring dynamic filtering, AI-powered recommendations, and seamless API integration with comprehensive error handling and loading states.',
    features: [
      'Intelligent search with autocomplete',
      'Advanced filtering and sorting',
      'Personalized recommendation engine',
      'Responsive grid layouts',
      'Optimistic UI with error boundaries'
    ],
    tech: ['React', 'TypeScript', 'TMDB API', 'Framer Motion', 'Tailwind CSS'],
    metrics: {
      movies: '1M+',
      response: '<100ms',
      uptime: '99.9%'
    },
    github: 'https://github.com/Sidharth-06/Movie-Database-Search-App',
    demo: 'https://cinevault-demo.vercel.app',
    image: '🎬',
    status: 'Live',
    year: '2023'
  }
];

export default function BookPortfolio() {
  const [currentPage, setCurrentPage] = useState('index');
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const bookRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (bookRef.current) {
        const rect = bookRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        setMousePosition({ x, y });
      }
    };

    const bookElement = bookRef.current;
    if (bookElement) {
      bookElement.addEventListener('mousemove', handleMouseMove);
      return () => bookElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handlePageTurn = (pageId) => {
    if (isFlipping) return;
    
    // Add haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setIsFlipping(true);
    
    setTimeout(() => {
      setCurrentPage(pageId);
    }, 400);
    
    setTimeout(() => {
      setIsFlipping(false);
    }, 1000);
  };

  const renderIndexPage = () => (
    <div className="book-page index-page">
      <div className="page-content">
        <div className="hero-section">
          <h1 className="book-title">
            Sidharth's Portfolio
            <span className="title-accent">.</span>
          </h1>
          <p className="book-subtitle">AI Developer & Creative Technologist</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Projects Built</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Lines of Code</span>
            </div>
          </div>
        </div>
        
        <div className="table-of-contents">
          <h2>Table of Contents</h2>
          <div className="contents-list">
            {chapters.slice(1).map((chapter, index) => (
              <div key={chapter.id} className="content-item" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="chapter-info">
                  <div className="chapter-icon-wrapper">
                    <span className="chapter-icon">{chapter.icon}</span>
                  </div>
                  <div className="chapter-text">
                    <span className="chapter-title">{chapter.title}</span>
                    <span className="chapter-subtitle">{chapter.subtitle}</span>
                  </div>
                  <span className="chapter-dots">.................................</span>
                  <span className="page-number">{chapter.page}</span>
                </div>
                <button 
                  className="go-button"
                  onClick={() => handlePageTurn(chapter.id)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <span>Go</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="book-footer">
          <p>Crafted with precision • Turn the pages to explore my journey</p>
          <div className="footer-decoration"></div>
        </div>
      </div>
    </div>
  );

  const renderAboutPage = () => (
    <div className="book-page content-page">
      <div className="page-content">
        <h2 className="page-title">About Me</h2>
        <div className="page-body">
          <div className="avatar-section">
            <div className="book-avatar">
              <video
                src="/assets/anim.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
          <div className="about-text">
            <p>Hello! I'm Sidharth, an AI Developer passionate about creating innovative solutions that blend technology with creativity.</p>
            <p>I specialize in building intelligent applications, machine learning models, and interactive experiences that push the boundaries of what's possible.</p>
            <div className="highlights">
              <div className="highlight-item">
                <strong>🎯 Focus:</strong> AI/ML, Web Development, Creative Tech
              </div>
              <div className="highlight-item">
                <strong>🌟 Mission:</strong> Building the future with code
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="back-button" onClick={() => handlePageTurn('index')}>
        ← Back to Contents
      </button>
    </div>
  );

  const renderProjectsPage = () => (
    <div className="book-page content-page projects-page">
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Featured Projects</h2>
          <p className="page-description">
            Innovative solutions built with cutting-edge technology and thoughtful design
          </p>
        </div>
        
        <div className="projects-showcase">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`project-card premium ${selectedProject === project.id ? 'expanded' : ''}`}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            >
              <div className="project-header">
                <div className="project-icon">
                  <span className="project-emoji">{project.image}</span>
                  <div className="project-status">
                    <span className={`status-badge ${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="project-meta">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <span className="project-year">{project.year}</span>
                </div>
                <div className="expand-indicator">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="none"
                    className={selectedProject === project.id ? 'rotated' : ''}
                  >
                    <path 
                      d="M6 8L10 12L14 8" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              
              <p className="project-description">{project.description}</p>
              
              {selectedProject === project.id && (
                <div className="project-details">
                  <div className="project-features">
                    <h4>Key Features</h4>
                    <ul>
                      {project.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="project-metrics">
                    <h4>Impact</h4>
                    <div className="metrics-grid">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="metric-item">
                          <span className="metric-value">{value}</span>
                          <span className="metric-label">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="project-actions">
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-button primary"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      View Code
                    </a>
                    {project.demo && (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="action-button secondary"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              <div className="tech-stack premium">
                {project.tech.map((tech, idx) => (
                  <span key={idx} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="back-button premium" onClick={() => handlePageTurn('index')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Contents
      </button>
    </div>
  );

  const renderSkillsPage = () => (
    <div className="book-page content-page">
      <div className="page-content">
        <h2 className="page-title">Technical Skills</h2>
        <div className="skills-section">
          <div className="skill-category">
            <h3>🤖 AI & Machine Learning</h3>
            <div className="skill-list">
              <span>Python</span>
              <span>TensorFlow</span>
              <span>PyTorch</span>
              <span>Scikit-learn</span>
              <span>OpenCV</span>
            </div>
          </div>
          
          <div className="skill-category">
            <h3>💻 Web Development</h3>
            <div className="skill-list">
              <span>React</span>
              <span>JavaScript</span>
              <span>Node.js</span>
              <span>HTML/CSS</span>
              <span>Three.js</span>
            </div>
          </div>
          
          <div className="skill-category">
            <h3>📱 Mobile & Other</h3>
            <div className="skill-list">
              <span>Flutter</span>
              <span>Firebase</span>
              <span>Git</span>
              <span>Docker</span>
              <span>AWS</span>
            </div>
          </div>
        </div>
      </div>
      <button className="back-button" onClick={() => handlePageTurn('index')}>
        ← Back to Contents
      </button>
    </div>
  );

  const renderFunPage = () => (
    <div className="book-page content-page">
      <div className="page-content">
        <h2 className="page-title">Fun Projects</h2>
        <div className="fun-content">
          <p>This is where I experiment with creative coding, generative art, and playful interactions!</p>
          
          <div className="fun-grid">
            <div className="fun-item">
              <h3>🎨 Generative Art</h3>
              <p>Creating beautiful patterns with code using p5.js and Processing</p>
            </div>
            
            <div className="fun-item">
              <h3>🎮 Interactive Demos</h3>
              <p>Physics simulations and interactive visualizations</p>
            </div>
            
            <div className="fun-item">
              <h3>🌟 Experimental UI</h3>
              <p>Pushing the boundaries of web interfaces with CSS and JavaScript</p>
            </div>
          </div>
        </div>
      </div>
      <button className="back-button" onClick={() => handlePageTurn('index')}>
        ← Back to Contents
      </button>
    </div>
  );

  const renderContactPage = () => (
    <div className="book-page content-page">
      <div className="page-content">
        <h2 className="page-title">Get In Touch</h2>
        <div className="contact-content">
          <p>Let's connect and create something amazing together!</p>
          
          <div className="contact-methods">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>sidharthkrishna441@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">💼</span>
              <div>
                <strong>LinkedIn</strong>
                <p>https://www.linkedin.com/in/sidharth-k-t-065b2b22a/</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">🐙</span>
              <div>
                <strong>GitHub</strong>
                <p>github.com/Sidharth-06</p>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
      <button className="back-button" onClick={() => handlePageTurn('index')}>
        ← Back to Contents
      </button>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'index': return renderIndexPage();
      case 'about': return renderAboutPage();
      case 'projects': return renderProjectsPage();
      case 'skills': return renderSkillsPage();
      case 'fun': return renderFunPage();
      case 'contact': return renderContactPage();
      default: return renderIndexPage();
    }
  };

  return (
    <div className="book-container">
      <div 
        ref={bookRef}
        className={`book ${isFlipping ? 'flipping' : ''}`}
        style={{
          transform: `rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`
        }}
      >
        <div className="book-spine">
          <div className="spine-text">SIDHARTH</div>
          <div className="spine-year">2024</div>
        </div>
        <div className="book-cover">
          <div className="cover-shine"></div>
          <div className="page-wrapper">
            <div className="page-number-indicator">
              {currentPage !== 'index' && (
                <span>{chapters.find(ch => ch.id === currentPage)?.page || '1'} / 5</span>
              )}
            </div>
            {renderCurrentPage()}
          </div>
        </div>
        <div className="book-shadow"></div>
      </div>
      
      {/* Ambient particles */}
      <div className="ambient-particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Loading state for page transitions */}
      {isFlipping && (
        <div className="flip-overlay">
          <div className="flip-indicator">
            <div className="flip-spinner"></div>
          </div>
        </div>
      )}
    </div>
  );
}