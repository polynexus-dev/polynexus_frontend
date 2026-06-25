# Use the official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose Vite development port
EXPOSE 7771

# Run Vite dev server, binding to 0.0.0.0 and port 7771
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "7771"]
