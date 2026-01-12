// sampleresume.js
export const sampleResume = {
  personalInformation: {
    fullName: "JONATHAN DOE",
    firstName: "JONATHAN",
    lastName: "DOE",
    email: "j.doe@example.com",
    phoneNumber: "+1 123-456-7890"
  },
  onlineProfiles: {
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.me"
  },
  careerSummary: {
    summary: "Results-driven Senior Full-Stack Developer with over 8 years of experience in architecting scalable web applications and data-driven solutions. Expert in modern JavaScript frameworks, cloud infrastructure, and implementing machine learning models to solve complex business challenges and optimize user engagement."
  },
  workExperience: [
    {
      companyName: "Innovation Hub",
      jobTitle: "SENIOR FULL-STACK DEVELOPER",
      location: "New York, NY",
      startDate: "01-2022",
      endDate: "Present",
      responsibilities: "Led the end-to-end development of a cloud-native analytics platform serving 50k+ monthly active users. Orchestrated the migration from monolithic architecture to microservices, improving system uptime to 99.9%. Mentored a team of 8 junior engineers and established rigorous CI/CD pipelines to accelerate deployment cycles by 40%."
    },
    {
      companyName: "Nexus Digital Systems",
      jobTitle: "SOFTWARE ENGINEER II",
      location: "San Francisco, CA",
      startDate: "06-2018",
      endDate: "12-2021",
      responsibilities: "Developed and maintained high-traffic e-commerce features using React and Node.js. Optimized database queries in PostgreSQL, reducing page load times by 1.5 seconds. Integrated third-party payment gateways and secured user data using OAuth 2.0 and JWT protocols."
    }
  ],
  projects: [
    {
      projectName: "AI-Powered RAG Chatbot",
      projectDescription: "Built an intelligent support system using Retrieval-Augmented Generation to provide context-aware responses based on internal documentation. Reduced support ticket volume by 25%.",
      technologiesUsed: "Next.js, Python, OpenAI API, Pinecone, LangChain",
      startDate: "2024",
      endDate: "2024"
    },
    {
      projectName: "Distributed Task Scheduler",
      projectDescription: "Created a fault-tolerant system for managing background jobs across multiple server nodes using a custom consensus algorithm and Redis-backed queues.",
      technologiesUsed: "Go, Redis, Docker, Kubernetes",
      startDate: "2023",
      endDate: "2023"
    }
  ],
  educationHistory: [
    {
      university: "State University of Technology",
      degree: "Master of Science",
      major: "Computer Science",
      location: "California",
      startDate: "09-2019",
      endDate: "05-2021",
      gpa: "3.9"
    },
    {
      university: "City College of Engineering",
      degree: "Bachelor of Science",
      major: "Software Engineering",
      location: "New York",
      startDate: "08-2015",
      endDate: "05-2019",
      gpa: "3.8"
    }
  ],
  certifications: [
    { certificationName: "AWS Certified Solutions Architect – Professional", issuer: "Amazon" },
    { certificationName: "Google Professional Cloud Developer", issuer: "Google" },
    { certificationName: "Deep Learning Specialization", issuer: "Coursera" }
  ],
  skillsSummary: {
    technicalSkills: "React, Node.js, Python, Go, SQL, MongoDB, AWS, Docker, Kubernetes, Git, TypeScript, GraphQL, Terraform",
    tools: "VS Code, Jira, Postman, Figma, Datadog, Jenkins",
    softSkills: "Problem Solving, Technical Leadership, Strategic Planning, Agile Methodologies, Stakeholder Management"
  }
};