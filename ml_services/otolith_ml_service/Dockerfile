# # /backend/Dockerfile
# FROM golang:1.23-alpine AS build

# WORKDIR /app

# # 1. Copy initial dependencies for caching
# COPY go.mod go.sum ./
# RUN go mod download

# # 2. Copy ALL source code (ensures main.go and upload.go are present)
# COPY . .

# # 3. Resolve and clean up dependencies based on ALL source code
# # RUN go mod tidy

# # The go get is now likely redundant, but harmless if tidy succeeds
# # RUN go get github.com/jackc/pgx/v5/pgxpool

# # 4. Final build (should succeed now that upload.go is copied and dependencies are resolved)
# # RUN CGO_ENABLED=0 go build -o main main.go

# FROM alpine:latest AS final
# # ... (rest of the file)

# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (Crucial for ML image processing like OpenCV)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Copy the rest of your application code (the whole folder) into the container
COPY . .

# Make port 8000 available to the outside world
EXPOSE 8000

# Command to run the FastAPI application using uvicorn
# Assuming your FastAPI instance is named 'app' inside 'app/main.py'
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]