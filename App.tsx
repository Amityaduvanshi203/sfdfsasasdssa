import { useState, useEffect } from 'react';
import './App.css';

declare global {
  interface Window {
    particlesJS: any;
  }
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [weather, setWeather] = useState({
    city: 'New York',
    temperature: 22,
    description: 'Clear sky',
    humidity: 60,
    windSpeed: 5,
    icon: '☀️'
  });
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load particles.js after component mounts
    const loadParticles = () => {
      if (window.particlesJS) {
        window.particlesJS("particles-js", {
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#6366f1" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#6366f1",
              opacity: 0.2,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" }
            }
          },
          retina_detect: true
        });
      }
    };

    // Load particles.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = loadParticles;
    document.head.appendChild(script);

    // Header scroll effect and scroll to top button
    const handleScroll = () => {
      const header = document.getElementById('header');
      const scrollTop = document.getElementById('scrollTop');
      
      if (window.scrollY > 100) {
        if (header) header.classList.add('scrolled');
      } else {
        if (header) header.classList.remove('scrolled');
      }
      
      if (window.scrollY > 500) {
        if (scrollTop) scrollTop.classList.add('active');
      } else {
        if (scrollTop) scrollTop.classList.remove('active');
      }

      // Animate counters when about section is in view
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom >= 0) {
          animateCounters();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        
        const targetElement = document.querySelector(targetId) as HTMLElement;
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
          setIsMenuOpen(false);
        }
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
      const htmlCounter = counter as HTMLElement;
      const target = +(htmlCounter.getAttribute('data-count') || '0');
      const count = +(htmlCounter.innerText || '0');
      
      // Only animate if counter hasn't been animated yet
      if (count < target) {
        const increment = target / speed;
        
        const updateCounter = () => {
          const current = +(htmlCounter.innerText || '0');
          if (current < target) {
            htmlCounter.innerText = Math.ceil(current + increment).toString();
            setTimeout(updateCounter, 10);
          } else {
            htmlCounter.innerText = target.toString();
          }
        };
        
        updateCounter();
      }
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.message) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'No Subject',
        message: formData.message
      }),
    });

    const text = await res.text();
    alert(text); // shows response from backend

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again later.");
  }
};


  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  const fetchWeather = () => {
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockWeather: Record<string, typeof weather> = {
        'new york': { city: 'New York', temperature: 22, description: 'Clear sky', humidity: 60, windSpeed: 5, icon: '☀️' },
        'london': { city: 'London', temperature: 15, description: 'Cloudy', humidity: 75, windSpeed: 8, icon: '☁️' },
        'tokyo': { city: 'Tokyo', temperature: 28, description: 'Sunny', humidity: 50, windSpeed: 3, icon: '☀️' },
        'paris': { city: 'Paris', temperature: 18, description: 'Partly cloudy', humidity: 65, windSpeed: 6, icon: '⛅' },
        'delhi': { city: 'Delhi', temperature: 32, description: 'Haze', humidity: 45, windSpeed: 4, icon: '🌫️' },
        'mumbai': { city: 'Mumbai', temperature: 30, description: 'Humid', humidity: 85, windSpeed: 7, icon: '🌧️' },
        'azamgarh': { city: 'Azamgarh', temperature: 28, description: 'Sunny', humidity: 55, windSpeed: 5, icon: '☀️' }
      };
      
      const data = mockWeather[city.toLowerCase()] || { 
        city: city.charAt(0).toUpperCase() + city.slice(1), 
        temperature: Math.floor(Math.random() * 35) + 5, 
        description: 'Partly cloudy', 
        humidity: Math.floor(Math.random() * 50) + 30, 
        windSpeed: Math.floor(Math.random() * 10) + 2,
        icon: '🌤️'
      };
      
      setWeather(data);
      setIsLoading(false);
    }, 800);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const projects = [
  {
    title: "E-Commerce Platform",
    description: "Developed a full-featured online shopping platform with user authentication, product management, shopping cart, and payment integration using Stripe. Implemented responsive UI and secure backend APIs for smooth user experience.",
    gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "Flask", "Matplotlib", "SQL"],
    github: "https://github.com/Amityaduvanshi203/e-commerce-platform",
    demo: "https://amityaduvanshi203.github.io/e-commerce-platform"
  },
  {
    title: "IoT-Based Environmental Monitoring System – Sathe Engineering",
    description: "Developed an IoT system to monitor temperature, humidity, and air quality using sensors, with real-time data visualization on a web dashboard. Gained hands-on experience in sensor interfacing, microcontroller programming, and basic data analysis.",
    gradient: "linear-gradient(135deg, #facc15, #f97316)",
    tech: ["ESP32/Arduino", "DHT11 Sensor", "MQ Gas Sensors", "Node.js", "React", "Chart.js", "REST API"],
    github: "https://github.com/Amityaduvanshi203/iot-environment-monitoring",
    demo: "https://amityaduvanshi203.github.io/iot-environment-monitoring"
  },
  {
    title: "Intelligent Hotel Management System (Full-Stack + ML)",
    description: "Developed a hotel management platform with full-stack features: room booking, customer management, and feedback system. Integrated a simple ML model for sentiment analysis of customer reviews. Built responsive UI and secure backend with database integration.",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Python (ML)", "CSS3", "HTML5", "REST API"],
    github: "https://github.com/Amityaduvanshi203/intelligent-hotel-management",
    demo: "https://amityaduvanshi203.github.io/intelligent-hotel-management"
  }
];


  const experiences = [
  {
    title: "Web/Hardware Intern",
    company: "Sathe Engineering – Electronics Tools & Components",
    period: "Jan 2026 – Jan 2026",
    description: "Developed IoT-based environmental monitoring system and product catalog website. Gained hands-on experience in hardware components, circuit testing, and Python/ML-based data analysis."
  },
  {
    title: "AI-Powered E-Commerce Recommendation System",
    company: "Personal Project",
    period: "2025 – 2026",
    description: "Built a machine learning model for personalized product recommendations using Python, Pandas, and Scikit-learn. Analyzed user data to improve product suggestion accuracy."
  },
  {
    title: "Intelligent Hotel Management System (Full-Stack + ML)",
    company: "Personal Project",
    period: "2025 – 2026",
    description: "Developed hotel management platform with booking, customer management, and ML-based sentiment analysis of customer reviews using Python and Flask. Implemented database integration and responsive UI."
  }
];

  return (
    <div className="App">
      {/* Particles Background */}
      <div id="particles-js"></div>
      
      {/* Header */}
      <header id="header">
        <div className="container nav-container">
          <a href="#home" className="logo">Amit Yadav</a>
          
          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          
          <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
            <a href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </nav>
        </div>
      </header>
      
      {/* Scroll to Top Button */}
      <div className="scroll-top" id="scrollTop" onClick={scrollToTop}>
        <i className="fas fa-arrow-up"></i>
      </div>
      
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <p className="subtitle">Hello, I'm</p>
            <h1>Amit Yadav</h1>
            <p className="subtitle">Full Stack Developer & Problem Solver</p>
            <p>I create immersive digital experiences using cutting-edge technologies. With a passion for clean code and innovative solutions, I turn complex problems into simple, beautiful designs.</p>
            <div className="hero-buttons">
              <a href="#projects" className="btn">View My Work</a>
              <a href="#contact" className="btn btn-outline">Contact Me</a>
            </div>
          </div>
        </div>
      </section>
      
 {/* About Section */}
      <section id="about">
        <div className="container">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>I am a motivated B.Tech student in Electronics and Telecommunication Engineering (ELTC) with a strong interest in Web Development and Full Stack technologies. I have hands-on experience in building responsive websites and real-world projects using HTML, CSS, JavaScript, React, Node.js, and databases.</p>
              <p>I enjoy working on practical projects, participating in hackathons, and learning new technologies. Through my project work, I have developed good problem-solving skills, teamwork, and leadership qualities.</p>
              <p>My goal is to secure a web development internship or entry-level developer role, where I can apply my skills, gain industry experience, and grow as a professional software developer.</p>
              
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number" data-count="20">0</div>
                  <p>Projects Completed</p>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-count="3">0</div>
                  <p> Hackathons Participated</p>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-count="2">0</div>
                  <p>Internship Experience – Hands-on Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills">
        <div className="container">
          <h2>Technical Skills</h2>
          <div className="skills-container">
            <div className="skill-category">
              <h3><i className="fas fa-code"></i> Programming Languages</h3>
              <div className="skill-list">
                <span className="skill-tag">Python</span>
                <span className="skill-tag">SQL</span>
                <span className="skill-tag">Java</span>
                <span className="skill-tag">JavaScript</span>
              </div>
            </div>
            
            <div className="skill-category">
              <h3><i className="fas fa-layer-group"></i> Frameworks & Libraries</h3>
              <div className="skill-list">
                <span className="skill-tag">React.js</span>
               <span className="skill-tag">Node.js</span>
                <span className="skill-tag">Express.js</span>
              </div>
            </div>
            
            <div className="skill-category">
              <h3><i className="fas fa-database"></i> Databases & Tools</h3>
              <div className="skill-list">
                <span className="skill-tag">MongoDB (Basic)</span>
                <span className="skill-tag">Firebase</span>
                <span className="skill-tag">MySQL / SQLite</span>
                <span className="skill-tag">AWS</span>
              </div>
            </div>
            
            <div className="skill-category">
              <h3><i className="fas fa-tools"></i> Other Technologies</h3>
              <div className="skill-list">
                <span className="skill-tag">Git & GitHub</span>
                <span className="skill-tag">REST APIs</span>
                <span className="skill-tag">JSON</span>
                <span className="skill-tag">API Integration</span>
                  </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects">
        <div className="container">
          <h2>Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div className="project-card" key={index}>
                <div className="project-image" style={{ background: project.gradient }}>
                  <div className="project-overlay"></div>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <span className="tech-tag" key={techIndex}>{tech}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.github} className="project-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-github"></i> Code
                    </a>
                    <a href={project.demo} className="project-link">
                      <i className="fas fa-external-link-alt"></i> Live Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience">
        <div className="container">
          <h2>Practical Experience</h2>
          <div className="timeline">
            {experiences.map((exp, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>{exp.title}</h3>
                  <p className="date">{exp.company} | {exp.period}</p>
                  <p>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact">
        <div className="container">
          <h2>Get In Touch</h2>
          <div className="contact-container">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>amityaduvanshi203@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>+91 9616144009</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>Uttar Pradesh Azamgarh, India</p>
                </div>
              </div>
              
              
            </div>
            
            <div className="contact-form">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={handleFormChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your Email" 
                    value={formData.email}
                    onChange={handleFormChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="subject"
                    placeholder="Subject" 
                    value={formData.subject}
                    onChange={handleFormChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="message"
                    rows={5} 
                    placeholder="Your Message" 
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <a href="#home" className="logo">Amit Yadav</a>
            <div className="social-links">
              <a href="https://github.com/Amityaduvanshi203" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/amit-yadav-ab16392a9" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/amit_yadav3501?igsh=MWJ2b2MxNTM5cTA3Zg==" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <p className="copyright">© {new Date().getFullYear()} Amit Yadav. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;