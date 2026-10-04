FROM python:3.12-slim

# Create a non-root user
RUN useradd --create-home --shell /bin/bash catalogops

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Give the application user ownership of the app directory
RUN chown -R catalogops:catalogops /app

# Run the application as the non-root user
USER catalogops

EXPOSE 8000

CMD ["sh", "-c", "echo 'Intentional rollback test failure' && exit 1"]