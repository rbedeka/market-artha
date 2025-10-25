FROM node:24-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app/apps/backend
