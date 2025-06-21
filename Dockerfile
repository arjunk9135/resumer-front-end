# Step 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install

# Copy everything else needed for build
COPY . .

# Build the app (assumes vite.config.ts is configured to look in client/)
RUN npm run build

# Step 2: Serve using Nginx
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom Nginx config to support client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
