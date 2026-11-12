/**
 * jobNewsService.js — Curated hiring news & job openings across all domains and company tiers.
 * Includes MNCs, Startups, Product companies, and remote teams.
 */

export const JOB_DOMAINS = [
  'All Domains',
  'Java & Backend',
  'React & Frontend',
  'Full Stack',
  'Python & AI',
  'Cloud & DevOps',
  'Mobile (Android/iOS)',
  'QA & Testing',
  'Cybersecurity & Network'
]

export const COMPANY_TYPES = [
  'All Companies',
  'Top MNCs',
  'Startups & Unicorns',
  'Product Companies',
  'Remote Teams'
]

export const EXPERIENCE_LEVELS = [
  'All Levels',
  'Freshers (2024-2026)',
  '0-2 Years',
  '2+ Years'
]

export const INITIAL_JOB_OPENINGS = [
  // --- JAVA & BACKEND ---
  {
    id: 'jn-1',
    company: 'Razorpay',
    companyType: 'Startups & Unicorns',
    role: 'Software Development Engineer - 1 (Java/Spring Boot)',
    domain: 'Java & Backend',
    location: 'Bangalore, India (Hybrid)',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '16 - 22 LPA',
    source: 'Career Portal',
    posted: '1 hour ago',
    url: 'https://razorpay.com/jobs',
    skills: ['Java 17', 'Spring Boot', 'MySQL', 'Kafka', 'Microservices'],
    description: 'Work on payment gateway microservices, distributed transaction systems using Java 17, Spring Boot, MySQL, and Kafka.'
  },
  {
    id: 'jn-2',
    company: 'TCS (Tata Consultancy Services)',
    companyType: 'Top MNCs',
    role: 'TCS Digital / Ninja - Systems Engineer (Java)',
    domain: 'Java & Backend',
    location: 'Pan India (Multiple Locations)',
    experience: 'Fresher (2024 / 2025 / 2026)',
    expLevel: 'Freshers (2024-2026)',
    salary: '7.5 - 9.2 LPA',
    source: 'National Qualifier Test',
    posted: 'Today',
    url: 'https://www.tcs.com/careers',
    skills: ['Java', 'Spring', 'SQL', 'Data Structures', 'OOP'],
    description: 'National recruitment drive for engineering graduates. Roles in cloud modernization, enterprise Java, databases, and microservices.'
  },
  {
    id: 'jn-3',
    company: 'CRED',
    companyType: 'Startups & Unicorns',
    role: 'Backend Engineer - Payments & Ledger',
    domain: 'Java & Backend',
    location: 'Bangalore, India',
    experience: '1-3 Years',
    expLevel: '0-2 Years',
    salary: '24 - 32 LPA',
    source: 'Tech Hiring Alert',
    posted: 'Yesterday',
    url: 'https://cred.club/careers',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka'],
    description: 'High throughput, low-latency financial systems in Java and Go, PostgreSQL, Redis, and event-driven architectures.'
  },
  {
    id: 'jn-4',
    company: 'Cognizant',
    companyType: 'Top MNCs',
    role: 'Programmer Analyst Trainee (Java Full Stack)',
    domain: 'Java & Backend',
    location: 'Chennai / Coimbatore / Bangalore',
    experience: 'Fresher (2025 / 2026 Batch)',
    expLevel: 'Freshers (2024-2026)',
    salary: '4.5 - 6.5 LPA',
    source: 'Off-Campus Drive',
    posted: '3 hours ago',
    url: 'https://careers.cognizant.com',
    skills: ['Core Java', 'JDBC', 'MySQL', 'Spring Basics', 'HTML/CSS'],
    description: 'Entry-level software engineering roles focusing on building enterprise business applications, REST APIs, and database integrations.'
  },

  // --- REACT & FRONTEND ---
  {
    id: 'jn-5',
    company: 'Zepto',
    companyType: 'Startups & Unicorns',
    role: 'Frontend Engineer (React.js / Next.js)',
    domain: 'React & Frontend',
    location: 'Bangalore, India',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '14 - 18 LPA',
    source: 'LinkedIn Alert',
    posted: '2 hours ago',
    url: 'https://www.zeptonow.com/careers',
    skills: ['React 18', 'TypeScript', 'Next.js', 'TailwindCSS', 'Redux Toolkit'],
    description: 'Build lightning-fast customer and delivery partner web applications using React 18, TypeScript, TailwindCSS, and state management.'
  },
  {
    id: 'jn-6',
    company: 'Swiggy',
    companyType: 'Startups & Unicorns',
    role: 'Web Frontend Developer - Consumer Experience',
    domain: 'React & Frontend',
    location: 'Bangalore, India',
    experience: 'Fresher / 0-2 Years',
    expLevel: '0-2 Years',
    salary: '15 - 20 LPA',
    source: 'Career Portal',
    posted: 'Today',
    url: 'https://careers.swiggy.com',
    skills: ['React', 'JavaScript (ES6+)', 'Webpack/Vite', 'Responsive Design', 'CSS Modules'],
    description: 'Create responsive web experiences for food & Instamart delivery platforms. Focus on bundle optimization, Core Web Vitals, and smooth UI.'
  },
  {
    id: 'jn-7',
    company: 'Freshworks',
    companyType: 'Product Companies',
    role: 'Associate UI Engineer',
    domain: 'React & Frontend',
    location: 'Chennai / Hyderabad',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '9.0 - 13.0 LPA',
    source: 'Career Portal',
    posted: '1 day ago',
    url: 'https://www.freshworks.com/company/careers',
    skills: ['React.js', 'TypeScript', 'Design Systems', 'Microfrontends', 'Jest'],
    description: 'Build enterprise SaaS dashboards and CRM components used by millions of agents globally with modern React and reusable components.'
  },

  // --- FULL STACK ---
  {
    id: 'jn-8',
    company: 'Zoho Corporation',
    companyType: 'Product Companies',
    role: 'Software Developer (Full Stack - Java + React/Vue)',
    domain: 'Full Stack',
    location: 'Chennai / Tenkasi / Salem, India',
    experience: 'Fresher (2024 / 2025 / 2026 Batch)',
    expLevel: 'Freshers (2024-2026)',
    salary: '6.5 - 9.0 LPA',
    source: 'Zoho Off-Campus Drive',
    posted: 'Today',
    url: 'https://www.zoho.com/careers',
    skills: ['Java', 'C++', 'JavaScript', 'RDBMS', 'Data Structures'],
    description: 'Freshers hiring drive across Zoho SaaS products. Strong programming fundamentals in Java/C++, problem solving, and full stack web apps.'
  },
  {
    id: 'jn-9',
    company: 'Infosys',
    companyType: 'Top MNCs',
    role: 'Specialist Programmer (Java Spring Boot + Angular/React)',
    domain: 'Full Stack',
    location: 'Bangalore / Hyderabad / Pune',
    experience: 'Fresher / 0-1 Years',
    expLevel: 'Freshers (2024-2026)',
    salary: '9.5 - 11 LPA',
    source: 'HackWithInfy Drive',
    posted: '2 days ago',
    url: 'https://www.infosys.com/careers',
    skills: ['Java', 'Spring Boot', 'React', 'REST APIs', 'Cloud Fundamentals'],
    description: 'Elite programming track for top coding performers. Full stack development using Spring Boot microservices and React/Angular.'
  },
  {
    id: 'jn-10',
    company: 'Supabase',
    companyType: 'Remote Teams',
    role: 'Junior Full Stack Developer Advocate / Engineer',
    domain: 'Full Stack',
    location: '100% Remote (Worldwide)',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '$35,000 - $55,000 / yr',
    source: 'Remote Tech Feed',
    posted: '3 days ago',
    url: 'https://supabase.com/careers',
    skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Node.js', 'Docker'],
    description: 'Global remote role working with open-source PostgreSQL, developer tools, documentation, tutorials, and full-stack sample applications.'
  },
  {
    id: 'jn-11',
    company: 'Groww',
    companyType: 'Startups & Unicorns',
    role: 'Associate Software Engineer (Full Stack)',
    domain: 'Full Stack',
    location: 'Bangalore, India',
    experience: 'Fresher / 0-2 Years',
    expLevel: '0-2 Years',
    salary: '16 - 22 LPA',
    source: 'Campus & Off-Campus',
    posted: 'Yesterday',
    url: 'https://groww.in/careers',
    skills: ['Java', 'Spring Boot', 'React.js', 'Microservices', 'MySQL'],
    description: 'Build investment & mutual funds platforms. Develop backend APIs in Java/Spring Boot and user interfaces in React.js.'
  },

  // --- PYTHON & AI ---
  {
    id: 'jn-12',
    company: 'Fractal Analytics',
    companyType: 'Product Companies',
    role: 'Associate Data Engineer / AI Engineer (Python)',
    domain: 'Python & AI',
    location: 'Mumbai / Gurgaon / Bangalore',
    experience: 'Fresher / 0-1 Years',
    expLevel: 'Freshers (2024-2026)',
    salary: '8.0 - 11.5 LPA',
    source: 'LinkedIn Alert',
    posted: '2 days ago',
    url: 'https://fractal.ai/careers',
    skills: ['Python', 'SQL', 'FastAPI', 'Pandas', 'Spark', 'LLM Basics'],
    description: 'Data ingestion, ETL pipelines, Python scripts, SQL transformation, and machine learning model deployment pipelines.'
  },
  {
    id: 'jn-13',
    company: 'Postman',
    companyType: 'Product Companies',
    role: 'Associate AI Platform Engineer',
    domain: 'Python & AI',
    location: 'Bangalore / Remote',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '18 - 25 LPA',
    source: 'Career Portal',
    posted: 'Today',
    url: 'https://www.postman.com/company/careers',
    skills: ['Python', 'LangChain', 'FastAPI', 'Vector DBs', 'OpenAI/Gemini APIs'],
    description: 'Build AI-powered API discovery, autonomous test generation, and intelligent assistant features for Postman developers.'
  },
  {
    id: 'jn-14',
    company: 'Automattic (WordPress)',
    companyType: 'Remote Teams',
    role: 'Junior Python / Data Developer',
    domain: 'Python & AI',
    location: '100% Remote (Anywhere)',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '$40,000 - $60,000 / yr',
    source: 'Remote Jobs Feed',
    posted: '4 days ago',
    url: 'https://automattic.com/work-with-us',
    skills: ['Python', 'Data Analysis', 'REST APIs', 'PostgreSQL', 'Git'],
    description: 'Develop analytics, content processing, and AI tools across WordPress.com and Tumblr in a fully distributed company.'
  },

  // --- CLOUD & DEVOPS ---
  {
    id: 'jn-15',
    company: 'Amazon Web Services (AWS)',
    companyType: 'Top MNCs',
    role: 'Cloud Support Associate (Developer & Cloud Technologies)',
    domain: 'Cloud & DevOps',
    location: 'Bangalore / Hyderabad',
    experience: 'Fresher (2024 / 2025 / 2026)',
    expLevel: 'Freshers (2024-2026)',
    salary: '14 - 18 LPA',
    source: 'Campus & Off-Campus',
    posted: 'Today',
    url: 'https://amazon.jobs',
    skills: ['Linux', 'Networking', 'AWS Basics (EC2, S3, RDS)', 'Python/Java', 'Troubleshooting'],
    description: 'Help enterprise architects debug serverless, containers, database indexing, and cloud-native Java applications on AWS.'
  },
  {
    id: 'jn-16',
    company: 'GitLab',
    companyType: 'Remote Teams',
    role: 'Junior Infrastructure Engineer',
    domain: 'Cloud & DevOps',
    location: '100% Remote (Global)',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '$50,000 - $70,000 / yr',
    source: 'Remote Tech Feed',
    posted: '3 days ago',
    url: 'https://about.gitlab.com/jobs',
    skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux', 'Terraform', 'Bash'],
    description: 'Join all-remote GitLab team maintaining massive cloud infrastructure, CI/CD runners, and automated deployment pipelines.'
  },
  {
    id: 'jn-17',
    company: 'Wipro',
    companyType: 'Top MNCs',
    role: 'Cloud Operations & DevOps Engineer (Elite NTH)',
    domain: 'Cloud & DevOps',
    location: 'Bangalore / Pune / Chennai',
    experience: 'Fresher (2024 - 2026 Batch)',
    expLevel: 'Freshers (2024-2026)',
    salary: '5.5 - 7.0 LPA',
    source: 'Wipro Elite NTH',
    posted: '1 day ago',
    url: 'https://careers.wipro.com',
    skills: ['Cloud Basics', 'Git', 'Linux Admin', 'Docker Basics', 'Python Shell'],
    description: 'Manage enterprise hybrid cloud infrastructure, automate deployment pipelines, and configure monitoring tools like Prometheus.'
  },

  // --- MOBILE (ANDROID / IOS / FLUTTER) ---
  {
    id: 'jn-18',
    company: 'Blinkit',
    companyType: 'Startups & Unicorns',
    role: 'Android Engineer (Kotlin & Jetpack Compose)',
    domain: 'Mobile (Android/iOS)',
    location: 'Gurgaon / Bangalore, India',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '16 - 22 LPA',
    source: 'Career Portal',
    posted: 'Today',
    url: 'https://blinkit.com/careers',
    skills: ['Kotlin', 'Jetpack Compose', 'Coroutines/Flow', 'MVVM', 'Room DB'],
    description: 'Develop features for 10-minute instant delivery app with real-time rider tracking, caching, and fluid animations.'
  },
  {
    id: 'jn-19',
    company: 'PhonePe',
    companyType: 'Startups & Unicorns',
    role: 'Mobile Engineer (Flutter / Android)',
    domain: 'Mobile (Android/iOS)',
    location: 'Bangalore, India',
    experience: 'Fresher / 0-2 Years',
    expLevel: '0-2 Years',
    salary: '15 - 20 LPA',
    source: 'Career Portal',
    posted: 'Yesterday',
    url: 'https://www.phonepe.com/careers',
    skills: ['Flutter/Dart', 'Android (Kotlin)', 'State Management', 'REST APIs', 'Unit Testing'],
    description: 'Engineer frictionless UPI payment, insurance, and merchant experiences with robust offline-first architecture.'
  },

  // --- QA & TESTING ---
  {
    id: 'jn-20',
    company: 'Capgemini',
    companyType: 'Top MNCs',
    role: 'Quality Assurance & Automation Engineer (Selenium / Java)',
    domain: 'QA & Testing',
    location: 'Bangalore / Hyderabad / Chennai',
    experience: 'Fresher (2024 / 2025 / 2026)',
    expLevel: 'Freshers (2024-2026)',
    salary: '4.8 - 6.5 LPA',
    source: 'National Hiring Drive',
    posted: '2 days ago',
    url: 'https://www.capgemini.com/careers',
    skills: ['Java', 'Selenium WebDriver', 'TestNG', 'Postman API Testing', 'Git'],
    description: 'Design and execute automated UI & API regression suites for global banking and automotive clients.'
  },
  {
    id: 'jn-21',
    company: 'PhonePe',
    companyType: 'Startups & Unicorns',
    role: 'Associate SDET (Software Development Engineer in Test)',
    domain: 'QA & Testing',
    location: 'Bangalore, India',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '12 - 16 LPA',
    source: 'Career Portal',
    posted: 'Today',
    url: 'https://www.phonepe.com/careers',
    skills: ['Java', 'RestAssured', 'TestNG', 'Kafka Testing', 'CI/CD Pipelines'],
    description: 'Automate high-throughput payment transaction pipelines, mock external bank gateways, and measure response latencies.'
  },

  // --- CYBERSECURITY & NETWORK ---
  {
    id: 'jn-22',
    company: 'Accenture',
    companyType: 'Top MNCs',
    role: 'Security Associate (SOC & Cloud Security)',
    domain: 'Cybersecurity & Network',
    location: 'Bangalore / Gurgaon / Pune',
    experience: 'Fresher (2024-2026)',
    expLevel: 'Freshers (2024-2026)',
    salary: '5.0 - 7.5 LPA',
    source: 'Campus & Off-Campus',
    posted: '3 days ago',
    url: 'https://www.accenture.com/careers',
    skills: ['Network Security', 'Linux', 'Vulnerability Assessment', 'SIEM Basics', 'OWASP Top 10'],
    description: 'Monitor enterprise security events, conduct vulnerability scans, and assist with cloud security incident responses.'
  },
  {
    id: 'jn-23',
    company: 'Canonical (Ubuntu)',
    companyType: 'Remote Teams',
    role: 'Junior Security & Linux Systems Engineer',
    domain: 'Cybersecurity & Network',
    location: '100% Remote (Worldwide)',
    experience: '0-2 Years',
    expLevel: '0-2 Years',
    salary: '$38,000 - $52,000 / yr',
    source: 'Remote Jobs Portal',
    posted: 'Today',
    url: 'https://canonical.com/careers',
    skills: ['Linux Kernel/OS', 'Python/Bash', 'CVE Patching', 'Git', 'Security Auditing'],
    description: 'Maintain Ubuntu OS security patches, automate package verification, and collaborate with upstream open-source communities.'
  },
  {
    id: 'jn-24',
    company: 'Atlassian',
    companyType: 'Product Companies',
    role: 'Graduate Software Engineer (Security & Systems)',
    domain: 'Cybersecurity & Network',
    location: 'Bangalore / Remote',
    experience: 'Fresher / 0-1 Years',
    expLevel: 'Freshers (2024-2026)',
    salary: '18 - 24 LPA',
    source: 'Graduate Drive 2025/2026',
    posted: 'Yesterday',
    url: 'https://www.atlassian.com/company/careers',
    skills: ['Java', 'Python', 'AppSec Basics', 'OAuth/JWT', 'Cloud Security'],
    description: 'Protect Jira, Confluence, and Bitbucket cloud ecosystems by automating identity verification, encryption, and threat prevention.'
  }
]

export const jobNewsService = {
  getOpenings: () => Promise.resolve(INITIAL_JOB_OPENINGS)
}
