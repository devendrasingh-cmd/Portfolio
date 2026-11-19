import { useEffect, useState } from "react";

const skills = [
  ["Microsoft Azure", "Cloud"],
  ["Docker", "Containers"],
  ["Kubernetes", "Orchestration"],
  ["Linux", "Operating System"],
  ["GitHub Actions", "CI/CD"],
  ["Jenkins", "Automation"],
  ["Terraform", "Infrastructure as Code"],
  ["Nginx", "Web Server"],
  ["Git & GitHub", "Version Control"],
  ["PowerShell", "Scripting"],
  ["MongoDB", "Database"],
  ["Networking", "Infrastructure"]
];

const projects = [
  {
    name: "Azure VM Deployment",
    category: "Cloud",
    description: "Deployed and configured a Linux virtual machine on Microsoft Azure with networking and remote SSH access.",
    stack: "Azure · Ubuntu · SSH"
  },
  {
    name: "Kubernetes Deployment",
    category: "DevOps",
    description: "Containerized application deployment and service management using Kubernetes resources.",
    stack: "Docker · Kubernetes · YAML"
  },
  {
    name: "LeadFlow AI CI/CD",
    category: "DevOps",
    description: "Working on an automated application delivery workflow with build, deployment and environment configuration.",
    stack: "GitHub Actions · Docker · Node.js"
  },
  {
    name: "Nginx Reverse Proxy",
    category: "Cloud",
    description: "Configured Nginx as a reverse proxy for a web application hosted on a Linux Azure VM.",
    stack: "Linux · Nginx · Azure"
  }
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" }
  }
};

function App() {
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 350);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 350);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
const visibleProjects = filter === "All"
    ? projects
    : projects.filter((project) => project.category === filter);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site">
      <header className="navbar">
        <div className="container nav-inner">
          <a className="brand" href="#home" onClick={closeMenu}>
            DK<span>.</span>
          </a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? "✕" : "☰"}
          </button>
          <nav className={menuOpen ? "nav-links open" : "nav-links"}>
            {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>{item}</a>
            ))}
            <a className="nav-cta" href="#contact" onClick={closeMenu}>Let's Talk ↗</a>
            <a className="nav-cta" href="/admin" onClick={closeMenu}>Admin Login ↗</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero section" id="home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="availability"><span></span> OPEN TO OPPORTUNITIES</div>
              <p className="eyebrow">HELLO, I'M</p>
              <h1>Devendra Kumar <span>Singh.</span></h1>
              <h2>DevOps Engineer</h2>
              <p className="hero-description">
                I work with cloud infrastructure, automation and modern deployment
                technologies to build reliable and scalable applications.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#projects">Explore My Work ↗</a>
                <a className="button secondary" href="#contact">Contact Me</a>
              </div>
              <div className="hero-meta">
                <span>☁ Cloud & Infrastructure</span>
                <span>⚙ Automation & CI/CD</span>
              </div>
            </div>

            <div className="hero-visual">
  <div className="profile-glow"></div>
  <div className="profile-frame">
    <img
      src="/profile.jpg"
      alt="Devendra Kumar Singh - DevOps Engineer"
      className="profile-photo"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
    <div className="profile-placeholder">DK</div>
    <div className="photo-overlay">
      <span>DEVOPS ENGINEER</span>
      <h3>Devendra Kumar Singh</h3>
      <p>Cloud · Automation · Infrastructure</p>
    </div>
  </div>
  <div className="floating-chip chip-one">☁ Microsoft Azure</div>
  <div className="floating-chip chip-two">♧ Kubernetes & Docker</div>
  <div className="photo-status"><span></span> Building & Learning</div>
</div>
</div>
</section>

        <section className="section whatido">
  <div className="container">
    <p className="eyebrow">WHAT I DO</p>
    <h2 className="section-title">Turning infrastructure into <span>solutions.</span></h2>
    <div className="whatido-grid">
      <article className="whatido-card">
        <div className="whatido-icon">☁</div>
        <h3>Cloud Infrastructure</h3>
        <p>Cloud environments, virtual machines, networking and infrastructure management with Microsoft Azure.</p>
        <span>01 / CLOUD</span>
      </article>
      <article className="whatido-card">
        <div className="whatido-icon">⚙</div>
        <h3>CI/CD Automation</h3>
        <p>Automating build and deployment workflows using GitHub Actions, Jenkins and modern DevOps practices.</p>
        <span>02 / AUTOMATION</span>
      </article>
      <article className="whatido-card">
        <div className="whatido-icon">⌘</div>
        <h3>Containers & Deployment</h3>
        <p>Working with Docker, Kubernetes, Linux and Nginx to deploy and manage applications.</p>
        <span>03 / DEPLOYMENT</span>
      </article>
    </div>
  </div>
</section>
<section className="stats">
          <div className="container stats-grid">
            <div><strong>12+</strong><span>Technologies</span></div>
            <div><strong>04</strong><span>Projects Showcased</span></div>
            <div><strong>2026</strong><span>Graduation Year</span></div>
            <div><strong>∞</strong><span>Learning Mindset</span></div>
          </div>
        </section>

        <section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} className="section" id="about">
          <div className="container about-grid">
            <div>
              <p className="eyebrow">01 / ABOUT ME</p>
              <h2 className="section-title">Building better systems,<br /><span>one deployment at a time.</span></h2>
            </div>
            <div className="about-copy">
              <p>
                I am a Computer Science graduate interested in DevOps engineering,
                cloud computing and infrastructure automation. I enjoy learning
                practical tools and applying them to real-world projects.
              </p>
              <p>
                My hands-on experience includes Azure virtual machines, Linux,
                Docker, Kubernetes, Nginx and CI/CD workflows.
              </p>
              <div className="education">
                <span>EDUCATION</span>
                <strong>B.Tech – Computer Science & Engineering</strong>
                <small>Institute of Technology and Management, Gida, Gorakhpur · 2022–2026</small>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="skills">
          <div className="container">
            <p className="eyebrow">02 / TECH STACK</p>
            <h2 className="section-title">Tools I work <span>with.</span></h2>
            <p className="section-subtitle">Technologies and tools I use while learning and building projects.</p>
            <div className="skills-grid">
              {skills.map(([name, type], index) => (
                <div className="skill-card" key={name}>
                  <div className="skill-number">{String(index + 1).padStart(2, "0")}</div>
                  <div><h3>{name}</h3><p>{type}</p></div>
                  <span className="skill-arrow">↗</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="container">
            <p className="eyebrow">03 / SELECTED WORK</p>
            <h2 className="section-title">Projects & <span>experience.</span></h2>
            <p className="section-subtitle">A selection of practical projects and technical work.</p>
            <div className="filters">
              {["All", "Cloud", "DevOps"].map((item) => (
                <button key={item} className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
            <div className="projects-grid">
              {visibleProjects.map((project, index) => (
                <article className="project-card" key={project.name}>
                  <div className="project-top">
                    <span>PROJECT / 0{index + 1}</span>
                    <span className="project-icon">↗</span>
                  </div>
                  <div className="project-art"><span>{project.category === "Cloud" ? "☁" : "⌘"}</span></div>
                  <p className="project-category">{project.category}</p>
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-stack">{project.stack}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container workflow-grid">
            <div>
              <p className="eyebrow">04 / MY APPROACH</p>
              <h2 className="section-title">From code to <span>cloud.</span></h2>
              <p className="section-subtitle">A practical approach to delivering and maintaining applications.</p>
            </div>
            <div className="workflow-list">
              {[
                ["01", "Plan", "Understand requirements and infrastructure."],
                ["02", "Build", "Develop and containerize applications."],
                ["03", "Automate", "Create repeatable CI/CD workflows."],
                ["04", "Deploy", "Release and monitor applications."]
              ].map(([number, title, description]) => (
                <div className="workflow-item" key={number}>
                  <span>{number}</span><div><h3>{title}</h3><p>{description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-card">
            <p className="eyebrow">05 / GET IN TOUCH</p>
            <h2>Have a project in mind?<br /><span>Let's connect.</span></h2>
            <p>I'm open to DevOps, cloud and infrastructure opportunities.</p>
            <a className="button primary" href="mailto:ajjuxpro@gmail.com">Send Me an Email ↗</a>
            <small>Usually available for professional opportunities and collaborations.</small>
          </div>
        </section>
      </main>

      {showTop && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          ↑
        </button>
      )}
      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="#home">DK<span>.</span></a>
          <p>Designed & built by Devendra Kumar Singh</p>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default App;










