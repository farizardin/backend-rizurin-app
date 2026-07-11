const BaseController = require('./BaseController');

class ProjectController extends BaseController {
    
    async getHomelabProjects(req, res) {
        const homelabData = [
            {
                category: "Infrastructure & DevOps",
                icon: "server",
                items: [
                    { name: "Proxmox", description: "Type-1 Hypervisor for running virtual machines and containers." },
                    { name: "K3s (Light Kubernetes)", description: "Lightweight Kubernetes distribution used to orchestrate the cluster." },
                    { name: "Docker", description: "Containerization platform for packaging applications." },
                    { name: "ZOT Registry", description: "OCI-native container image registry for storing Docker images." },
                    { name: "Drone CI", description: "Continuous Delivery system built on container technology." },
                    { name: "Traefik", description: "Modern HTTP reverse proxy and load balancer that integrates with Kubernetes." }
                ]
            },
            {
                category: "Databases & Caching",
                icon: "database",
                items: [
                    { name: "PostgreSQL", description: "Advanced open source relational database." },
                    { name: "Redis", description: "In-memory data structure store, used as a database, cache, and message broker." }
                ]
            },
            {
                category: "Architecture & Patterns",
                icon: "architecture",
                items: [
                    { name: "Microservices", description: "Decoupled architecture where applications are broken down into smaller services." },
                    { name: "Microfrontend", description: "Extending microservices to the frontend for independent deployment and development." },
                    { name: "Service Repository Pattern", description: "Separation of business logic and data access logic (used in backend apps)." },
                    { name: "CQRS, Inbox, Outbox Pattern", description: "Command Query Responsibility Segregation (will be implemented soon on backend apps)." },
                    { name: "Token Relay Auth Pattern", description: "Securely passing authentication tokens between microservices." },
                    { name: "Atomic Design", description: "Methodology for creating scalable UI design systems (used in frontend apps)." }
                ]
            },
            {
                category: "Security & Authentication",
                icon: "security",
                items: [
                    { name: "Casdoor SSO", description: "UI-first Identity Access Management / Single Sign-On platform." },
                    { name: "JWT Auth", description: "JSON Web Tokens for stateless authentication across microservices." }
                ]
            },
            {
                category: "Development Stack",
                icon: "code",
                items: [
                    { name: "Node.js & Express", description: "Backend runtime and web framework." },
                    { name: "Prisma ORM", description: "Next-generation Node.js and TypeScript ORM." },
                    { name: "React & Vite", description: "Frontend library and blazing fast build tool." }
                ]
            }
        ];

        return this.output().toJson(homelabData, 'Homelab projects retrieved successfully.');
    }
}

module.exports = ProjectController;
