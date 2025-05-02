# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the NestJS port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
