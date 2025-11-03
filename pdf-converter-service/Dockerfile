FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PDF processing
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .

# Use Python to run gunicorn with PORT from environment
CMD python -c "import os; os.system(f'gunicorn --bind 0.0.0.0:{os.environ.get(\"PORT\", \"8080\")} --workers 2 --timeout 120 --log-level info --access-logfile - --error-logfile - main:app')"
