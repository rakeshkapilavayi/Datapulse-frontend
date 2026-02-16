import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../services/api';  // FIXED: Import from centralized API
import './LandingPage.css';
import logo from '../assets/logo.jpeg';

function LandingPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      updateActiveSection();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateActiveSection = () => {
    const sections = ['home', 'features', 'upcoming', 'demo', 'pricing', 'contact'];
    const scrollPosition = window.scrollY + 200;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar?.offsetHeight || 0;
      const targetPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      setMobileMenuOpen(false);
    }
  };

  // FIXED: Use centralized API service instead of direct fetch
  const handleFileUpload = async (file) => {
    const allowedExtensions = ['csv', 'xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert('Please upload a CSV, XLS, or XLSX file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Uploading file:', file.name);

      // Use the centralized API service
      const response = await uploadFile(formData);
      const data = response.data;
      
      console.log('✅ Upload successful, session ID:', data.session_id);

      // Redirect to dashboard app
      navigate('/app', { 
        state: { 
          sessionId: data.session_id,
          filename: data.filename,
          summary: data.summary
        } 
      });
    } catch (error) {
      console.error('❌ Upload error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <img src={logo} alt="DataPulse Logo" className="logo-image" />
            <span className="logo-text">DataPulse</span>
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a 
              href="#home" 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            >
              🏠 Home
            </a>
            <a 
              href="#features" 
              className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
            >
              ✨ Features
            </a>
            <a 
              href="#upcoming" 
              className={`nav-link ${activeSection === 'upcoming' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('upcoming'); }}
            >
              🚀 Upcoming
            </a>
            <a 
              href="#demo" 
              className={`nav-link ${activeSection === 'demo' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('demo'); }}
            >
              🎯 Demo
            </a>
            <a 
              href="#pricing" 
              className={`nav-link ${activeSection === 'pricing' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}
            >
              💎 Pricing
            </a>
            <a 
              href="#contact" 
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            >
              📧 Contact
            </a>
            <a 
              href="https://github.com/rakeshkapilavayi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link github-link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>✨ From complexity to clarity</span>
            </div>
            <h1 className="hero-title">Automate Data Insights</h1>
            <p className="hero-subtitle">
              Upload CSV/Excel files for automated machine learning, exploratory data analysis,
              and powerful visualizations. Transform your data into actionable business insights.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => scrollToSection('demo')}
              >
                Get Started →
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => scrollToSection('features')}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card card-1">
              <div className="card-icon">📊</div>
              <div className="card-text">Data Cleaning</div>
            </div>
            <div className="visual-card card-2">
              <div className="card-icon">🤖</div>
              <div className="card-text">ML Models</div>
            </div>
            <div className="visual-card card-3">
              <div className="card-icon">📈</div>
              <div className="card-text">Visualizations</div>
            </div>
            <div className="visual-card card-4">
              <div className="card-icon">💡</div>
              <div className="card-text">AI Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">Everything you need for comprehensive data analysis</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">📤</div>
              <h3>Easy Upload</h3>
              <p>Drag & drop CSV, XLS, or XLSX files. Instant validation and processing.</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">🧹</div>
              <h3>Auto Cleaning</h3>
              <p>Automatic missing value handling, duplicate removal, and outlier detection.</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">📊</div>
              <h3>EDA & Visualization</h3>
              <p>Interactive charts, correlation heatmaps, distribution plots, and more.</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">🤖</div>
              <h3>Machine Learning</h3>
              <p>Train classification and regression models with automated hyperparameter tuning.</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">💡</div>
              <h3>Smart Insights</h3>
              <p>Statistical analysis with key findings and actionable recommendations.</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">💻</div>
              <h3>Developer Console</h3>
              <p>Write and execute Python code directly on your dataset with live results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING FEATURES SECTION */}
      <section className="upcoming-section" id="upcoming">
        <div className="section-container">
          <div className="section-header">
            <div className="upcoming-badge">
              <span className="badge-pulse"></span>
              <span>Coming Soon</span>
            </div>
            <h2 className="section-title gradient-text">Upcoming Features</h2>
            <p className="section-subtitle">
              Exciting new capabilities on the roadmap to make DataPulse even more powerful
            </p>
          </div>
          
          <div className="upcoming-grid">
            {/* Pulse AI */}
            <div className="upcoming-card featured-upcoming">
              <div className="upcoming-header">
                <div className="upcoming-icon pulse-ai-icon">
                  <span className="icon-glow">🤖</span>
                </div>
                <div className="upcoming-badge-new">New AI</div>
              </div>
              <h3 className="upcoming-title">Pulse AI Assistant</h3>
              <p className="upcoming-description">
                Your intelligent data companion powered by advanced AI. Pulse AI will guide you through 
                every step of your analysis, answer questions about your data, suggest optimal cleaning 
                strategies, recommend the best visualizations, and help you interpret complex patterns 
                with natural language conversations.
              </p>
              <div className="upcoming-features-list">
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Natural language data queries</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Intelligent cleaning recommendations</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Interactive guidance & tutorials</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Context-aware suggestions</span>
                </div>
              </div>
              <div className="upcoming-eta">
                <span className="eta-icon">🗓️</span>
                <span>Expected: Q2 2026</span>
              </div>
            </div>

            {/* AI-Enhanced Insights */}
            <div className="upcoming-card">
              <div className="upcoming-header">
                <div className="upcoming-icon insights-icon">
                  <span className="icon-glow">✨</span>
                </div>
                <div className="upcoming-badge-ai">AI Powered</div>
              </div>
              <h3 className="upcoming-title">AI-Enhanced Insights</h3>
              <p className="upcoming-description">
                Transform raw statistical insights into comprehensive, easy-to-understand analysis. 
                Our AI will process your data's statistical patterns and generate detailed explanations, 
                business context, and actionable recommendations in plain language.
              </p>
              <div className="upcoming-features-list">
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Deep pattern analysis</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Business-focused interpretations</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Automated report generation</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Strategic recommendations</span>
                </div>
              </div>
              <div className="upcoming-eta">
                <span className="eta-icon">🗓️</span>
                <span>Expected: Q3 2026</span>
              </div>
            </div>

            {/* Database Support */}
            <div className="upcoming-card">
              <div className="upcoming-header">
                <div className="upcoming-icon database-icon">
                  <span className="icon-glow">🗄️</span>
                </div>
                <div className="upcoming-badge-pro">Pro Feature</div>
              </div>
              <h3 className="upcoming-title">Database Integration</h3>
              <p className="upcoming-description">
                Connect directly to your databases without manual exports. Support for SQL databases, 
                PostgreSQL, MySQL, MongoDB, and more. Query, analyze, and visualize data directly 
                from your database with automatic schema detection and optimized queries.
              </p>
              <div className="upcoming-features-list">
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Direct SQL database connections</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>PostgreSQL, MySQL, SQLite support</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>NoSQL support (MongoDB, etc.)</span>
                </div>
                <div className="upcoming-feature-item">
                  <span className="feature-check">✓</span>
                  <span>Custom query builder interface</span>
                </div>
              </div>
              <div className="upcoming-eta">
                <span className="eta-icon">🗓️</span>
                <span>Expected: Q4 2026</span>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="upcoming-newsletter">
            <div className="newsletter-content">
              <h3>Stay Updated!</h3>
              <p>Get notified when these features launch</p>
            </div>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button className="newsletter-button">
                Notify Me →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="demo-section" id="demo">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Try It Now</h2>
            <p className="section-subtitle">Upload your dataset and start analyzing in seconds</p>
          </div>
          <FileUploadBox onFileUpload={handleFileUpload} />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Simple Pricing</h2>
            <p className="section-subtitle">Choose the plan that fits your needs</p>
          </div>

          <div className="pricing-grid">
            <PricingCard 
              title="Free"
              price="0"
              description="Perfect for individuals and small projects."
              features={[
                "Up to 10k rows",
                "Basic Data Cleaning",
                "Core Visualizations",
                "Basic ML Models (Logistic, Decision Tree)",
                "Quick Summary Insights"
              ]}
            />

            <PricingCard 
              title="Pro"
              price="799"
              description="For teams and serious data analysts."
              featured={true}
              features={[
                "Up to 200k rows",
                "Priority Processing",
                "Full Cleaning Suite + Reports",
                "Advanced EDA (Heatmaps, Outliers)",
                "All ML Models (XGBoost, Random Forest)",
                "Export Cleaned Data"
              ]}
            />

            <PricingCard 
              title="Enterprise"
              price="1499"
              description="Unlimited power for organizations."
              features={[
                "Unlimited Users",
                "Very Large Datasets (Optimized)",
                "Custom Cleaning Rules",
                "Full ML Suite + Tuning Dashboard",
                "Custom LLM Insight Templates",
                "Priority Support & SLA"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={logo} alt="DataPulse Logo" className="footer-logo-image" />
                <span className="logo-text">DataPulse</span>
              </div>
              <p className="footer-tagline">
                Created by Rakesh Kapilavayi - Aspiring Data Scientist specializing in Python,
                SQL, Data Cleaning, EDA, Visualization, and Machine Learning.
              </p>
              <div className="footer-social">
                <a href="mailto:rakeshkapilavayi978@gmail.com" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="2" fill="none"></polyline>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/rakesh-kapilavayi-48b9a0342/" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="https://github.com/rakeshkapilavayi" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-links-group">
              <div className="footer-column">
                <h4>Features</h4>
                <ul>
                  <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Data Upload</a></li>
                  <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Auto Cleaning</a></li>
                  <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>EDA & Visualization</a></li>
                  <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Machine Learning</a></li>
                  <li><a href="#upcoming" onClick={(e) => { e.preventDefault(); scrollToSection('upcoming'); }}>Upcoming Features</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Contact</h4>
                <ul>
                  <li><a href="mailto:rakeshkapilavayi978@gmail.com">rakeshkapilavayi978@gmail.com</a></li>
                  <li><a href="https://github.com/rakeshkapilavayi" target="_blank" rel="noopener noreferrer">GitHub: rakeshkapilavayi</a></li>
                  <li><a href="https://www.linkedin.com/in/rakesh-kapilavayi-48b9a0342/" target="_blank" rel="noopener noreferrer">LinkedIn: Rakesh Kapilavayi</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 DataPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// File Upload Component
function FileUploadBox({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload Your Dataset</h3>
      <div 
        className={`upload-box ${dragActive ? 'drag-active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h4>Drag & Drop your file here</h4>
        <p>or click to browse</p>
        <span className="file-types">CSV, XLS, XLSX supported</span>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv,.xls,.xlsx" 
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

// Pricing Card Component
function PricingCard({ title, price, description, features, featured = false }) {
  return (
    <div className={`pricing-card ${featured ? 'featured' : ''}`}>
      {featured && <div className="popular-badge">Most Popular</div>}
      <div className="pricing-header">
        <h3 className="pricing-title">{title}</h3>
        <div className="pricing-price">
          <span className="currency">₹</span>
          <span className="amount">{price}</span>
          <span className="period">/month</span>
        </div>
        <p className="pricing-description">{description}</p>
      </div>
      <ul className="pricing-features">
        {features.map((feature, idx) => (
          <li key={idx}>✓ {feature}</li>
        ))}
      </ul>
      <button className={`pricing-button ${featured ? 'primary' : ''}`}>
        Get Started
      </button>
    </div>
  );
}

export default LandingPage;
