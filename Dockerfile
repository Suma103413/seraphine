FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Run uvicorn on the port specified by Cloud Run
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
