
# Pizza Fusion Chef Service

The **Chef Service** is responsible for managing pizza preparation times, estimating order completion, and processing pizzas every 5 minutes. It also calculates the total estimated time for pending or in-progress orders.

This service is built with **Node.js**, **Express**, **TypeScript**, and **Prisma** ORM, and is containerized using Docker.

---

## Table of Contents
1. [Features](#features)
2. [API Documentation](#api-documentation)
3. [Setup Instructions](#setup-instructions)
4. [Environment Variables](#environment-variables)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Health Check](#health-check)
7. [Contributing](#contributing)

---

## Features
- **Estimate Order Time**: Calculate the estimated time to prepare pizzas for orders.
- **Complete Pizza Preparation**: Automatically complete pizza preparation and update the estimated time.
- **Health Check**: Check the health of the chef service.

---

## API Documentation

### Base URL
- Local: `http://localhost:3003`
- Kubernetes ClusterIP: `http://pizza-fusion-chef-service:3003`

### Endpoints

#### 1. **Estimate Order Time**
- **Endpoint**: `/estimate-time`
- **Method**: `GET`
- **Description**: Estimates the total time for all pending or in-progress orders.
- **Response**:
  - `200 OK`: Returns the estimated time in minutes.
  - `500 Internal Server Error`: If something goes wrong.

#### 2. **Health Check**
- **Endpoint**: `/health`
- **Method**: `GET`
- **Description**: Check the health status of the chef service.
- **Response**:
  - `200 OK`: Health check success.

---

## Setup Instructions

### Prerequisites
- **Node.js** v20.16.0 or higher
- **npm** or **yarn**
- **Docker** (for containerization)
- **Kubernetes** (for orchestration)

### Local Development Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pizza-fusion-chef-msc.git
   cd pizza-fusion-chef-msc
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` or `.env.local` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_database_url
   ```
   **DOCKER IMAGE (ALREADY HAVE ENV INCLUDED)**

4. **Run Prisma migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Access the service**:
   Open `http://localhost:3003` in your browser or API tool (Postman, Insomnia).

---

## Environment Variables

The service requires the following environment variables to function:

- **DATABASE_URL**: The connection string for the PostgreSQL database (provided by Supabase).

```bash
DATABASE_URL=your_supabase_database_url
```
**DOCKER IMAGE (ALREADY HAVE ENV INCLUDED)**

Make sure to define this in the `.env` or `.env.local` file.

---

## Kubernetes Deployment

### 1. **Deploy to Kubernetes**

First, ensure that the **Docker image** for the service is built and pushed to **Docker Hub**:

```bash
docker build -t docker.io/docker380431/pizza-fusion-chef-msc .
docker push docker.io/your-username/pizza-fusion-chef-msc
```

Apply the **Kubernetes** deployment and service files:

```bash
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
```

### 2. **Deployment File**

#### `k8s/deployment.yml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pizza-fusion-chef
spec:
  replicas: 2
  selector:
    matchLabels:
      app: pizza-fusion-chef
  template:
    metadata:
      labels:
        app: pizza-fusion-chef
    spec:
      containers:
      - name: pizza-fusion-chef
        image: docker.io/docker380431/pizza-fusion-chef-msc:latest
        ports:
        - containerPort: 3003
```

### 3. **Service File**

#### `k8s/service.yml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pizza-fusion-chef-service
spec:
  selector:
    app: pizza-fusion-chef
  ports:
    - protocol: TCP
      port: 3003
      targetPort: 3003
  type: ClusterIP
```

---

## Health Check

You can use the health check endpoint to ensure that the chef service is running correctly:

```bash
curl http://localhost:3003/health
```

Expected output:
```json
{
  "message": "chef service working fine"
}
```

---

## Contributing

Contributions are welcome! If you'd like to make improvements to this service, feel free to submit a PR or open an issue.

### Steps to Contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m "Add some feature"`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

---
