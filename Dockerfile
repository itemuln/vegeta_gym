# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=25.2.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for building)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files
COPY . .

# Build the application
RUN npm run build

# Run the application as a non-root user.
USER node

# Use production node environment by default.
ENV NODE_ENV production

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
