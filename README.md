# RealRate

RealRate is a web application inspired by IMDb, designed to allow users to rate and review movies. This project leverages React.js with Vite for the frontend and Node.js for the backend. It is fully containerized using Docker, enabling smooth development and pre-production (staging) environments.

## Features
- Rate and review movies
- Modern and responsive UI with React.js + Vite
- Scalable backend powered by Node.js
- Dockerized for easy deployment in different environments

## Requirements
Before running the project, ensure you have the following installed:

- **Docker** (mandatory)
- **Node.js** (optional, for backend development outside Docker containers)

## Getting Started

### Development Mode
To run the project in development mode using Docker:

1. Build the Docker image:
   ```bash
   docker build -t reactjs/devsecops:1.0.0 .
   ```
2. Verify the built image:
   ```bash
   docker image ls
   ```
3. Run the container in development mode:
   ```bash
   docker run -d -p 3000:3000 reactjs/devsecops:1.0.0
   ```
4. The app will be available at: [http://localhost:3000](http://localhost:3000)

### Pre-Production (Staging) Mode
To simulate a staging environment before production:

1. Build the staging Docker image:
   ```bash
   docker build -t reactjs-stg/devsecops:1.0.0 -f Dockerfile.stg .
   ```
2. Run the container in staging mode:
   ```bash
   docker run -d -p 3001:3001 reactjs-stg/devsecops:1.0.0
   ```
3. The app will be available at: [http://localhost:3001](http://localhost:3001)

## Technology Stack
- **Frontend:** React.js + Vite
- **Backend:** Node.js
- **Containerization:** Docker

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests to enhance the project.

## License
This project is licensed under the MIT License.

---

Developed with ❤️ by RealRate Team
