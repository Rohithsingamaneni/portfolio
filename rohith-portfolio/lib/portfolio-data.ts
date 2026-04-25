export const THEME_STORAGE_KEY = "portfolio-theme";
export const RESUME_HREF = "/portfolio/resume.pdf";

export const navItems = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rohithsingamaneni/",
    detail: "linkedin.com/in/rohithsingamaneni",
  },
  {
    label: "GitHub",
    href: "https://github.com/Rohithsingamaneni",
    detail: "github.com/Rohithsingamaneni",
  },
] as const;

export const heroContent = {
  statusCycles: [
    "Active @ Apple HQ",
    "Optimizing RAG Pipelines",
    "Architecting Microservices",
    "Scaling Data Platforms",
  ],
  firstName: "Rohith",
  lastName: "Singamaneni",
  locationLabel: "Deployment Zone",
  location: "Sunnyvale, CA",
  coordinates: "37.36° N, 122.03° W",
  summary: {
    intro: "Engineering",
    emphasisOne: "Distributed Resilience",
    middle: "and",
    emphasisTwo: "AI Infrastructure",
    outro:
      "at Apple. Focusing on gRPC pipelines and non-blocking RAG architectures.",
  },
  currentFocus: ["Apple Maps Search", "RAG Validation", "gRPC Pipelines"],
} as const;

export const marqueeTech = [
  "Spring Boot",
  "Kafka",
  "Snowflake",
  "gRPC",
  "RAG",
  "PostgreSQL",
  "WebFlux",
  "LangChain",
  "Redis",
  "AWS",
] as const;

export const capabilities = [
  {
    icon: "search",
    title: "Search & AI Infrastructure",
    description:
      "Simulating production-scale traffic and validating ranking quality through domain-specific RAG layers built for Apple Maps search evaluation.",
  },
  {
    icon: "monitor",
    title: "Distributed Backend",
    description:
      "Designing resilient Spring Boot systems, high-throughput gRPC services, and streaming infrastructure that scales cleanly under load.",
  },
  {
    icon: "code",
    title: "Full Stack Systems",
    description:
      "Shipping responsive interfaces wired to real-time APIs, Redis-backed services, and cloud-native infrastructure with a strong backend-first mindset.",
  },
] as const;

export const experiences = [
  {
    company: "Apple",
    role: "Software Engineer",
    location: "Cupertino, CA",
    date: "Mar 2025 – Present",
    description:
      "Leading backend development for Apple Maps search evaluation. Designing distributed gRPC pipelines and domain-specific RAG layers to automate ranking-quality validation across global regions.",
    tech: ["Java", "Spring Boot", "gRPC", "RAG", "Snowflake"],
    featured: true,
  },
  {
    company: "Neuro Leap Corp",
    role: "Full Stack Developer",
    location: "Costa Mesa, CA",
    date: "May 2024 – Feb 2025",
    description:
      "Built resilient Spring Boot microservices and real-time WebSocket APIs for a cognitive-assessment platform, integrating edge devices with cloud infrastructure and clinician dashboards.",
    tech: ["Spring Boot", "Redis", "WebSocket", "React", "AWS S3"],
    featured: false,
  },
  {
    company: "Cognizant",
    role: "Software Engineer",
    location: "Bangalore, India",
    date: "Apr 2021 – Jul 2022",
    description:
      "Modernized legacy HR infrastructure by transitioning to Spring Boot microservices, optimizing high-concurrency operations with GraphQL, and designing real-time Kafka event flows.",
    tech: ["Spring Boot", "GraphQL", "Kafka", "PostgreSQL", "AWS RDS"],
    featured: false,
  },
] as const;

export const featuredProject = {
  eyebrow: "AI-Powered Talent Analysis",
  title: "AI Resume Intelligence",
  description:
    "A high-performance evaluator built with Spring Boot WebFlux. Implementing a non-blocking pipeline that coordinates document parsing, semantic retrieval, and local LLM inference (Ollama) to provide deep-context feedback on engineering candidates.",
  technologies: [
    "Spring Boot",
    "pgvector",
    "Ollama",
    "WebFlux",
    "LangChain",
    "LangGraph",
  ],
  diagramLabel: "System Architecture: RAG-V1",
} as const;

export const aboutContent = {
  title: "Engineering is professional play.",
  paragraphs: [
    "Whether it’s optimizing search ranking at Apple or building multi-modal RAG systems in my home lab, I’m driven by the “What if?”.",
    "I treat my personal infrastructure with the same rigor as production code—constantly tuning, optimizing, or simply context-switching with a Fender CD-60S acoustic session.",
  ],
} as const;

export const contactContent = {
  eyebrow: "Get In Touch",
  titleLead: "Let’s build something",
  titleAccent: "great.",
  description:
    "Open to senior engineering roles, technical leadership, and interesting AI or distributed systems collaborations.",
} as const;

export const education = [
  {
    degree: "Computer Science",
    university: "California State University East Bay",
    gpa: "3.8 GPA",
    date: "Graduated",
  },
] as const;

export const otherProjects = [
  {
    title: "FoodX",
    description: "A microservices-based food ordering system with API Gateway, Eureka discovery, and reactive PostgreSQL handling high-concurrency order flows.",
    tech: ["Java 23", "Spring Boot", "WebFlux", "Redis", "R2DBC"],
    link: "https://github.com/Rohithsingamaneni/foodX",
  },
  {
    title: "Shop-Ease",
    description: "Enterprise e-commerce backend built on Spring Boot microservices, featuring secure payment gateways and aggressive Redis caching strategies.",
    tech: ["Spring Boot", "Microservices", "PostgreSQL", "Docker"],
    link: "https://github.com/Rohithsingamaneni/shop-ease",
  },
  {
    title: "Spring Security Auth",
    description: "A production-ready stateless authentication server implementing JWT validation, role-based access control, and robust Spring Security filters.",
    tech: ["Spring Security", "JWT", "Java", "OAuth2"],
    link: "https://github.com/Rohithsingamaneni/springboot-jwt-auth",
  },
  {
    title: "GraphQL Spring Boot",
    description: "An enterprise GraphQL API implementation over Spring Boot, optimizing data fetching efficiency by eliminating over-fetching on relational datasets.",
    tech: ["GraphQL", "Spring Boot", "Java", "JPA"],
    link: "https://github.com/Rohithsingamaneni/graphql-spring-boot",
  },
] as const;
