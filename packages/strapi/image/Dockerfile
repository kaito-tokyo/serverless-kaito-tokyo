# ----- Stage 1: Build Stage -----
# This stage installs all dependencies (including devDependencies) and builds the application.
FROM node:20-alpine AS build

# Install build-time dependencies required for native modules, especially for 'sharp'
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /opt/app

# Copy package.json and the lock file to leverage Docker's cache
COPY package.json package-lock.json ./

# Install all dependencies using 'npm ci' for a clean, reproducible install from the lock file
RUN npm ci

# Copy the entire application source code
COPY config config
COPY database database
COPY public public
COPY src src
COPY types types
COPY tsconfig.json ./

# Build the Strapi admin panel
ENV NODE_ENV=production
RUN npm run build


# ----- Stage 2: Production Stage -----
# This stage creates a lightweight final image with only production dependencies and built artifacts.
FROM node:20-alpine

# Install only runtime dependencies required for 'sharp'
RUN apk add --no-cache vips-dev

# Set production environment
ENV NODE_ENV=production

WORKDIR /opt/app

# Copy manifests from the build stage
COPY --from=build /opt/app/package.json /opt/app/package-lock.json ./

# Install only production dependencies.
# The --omit=dev flag ensures devDependencies are not installed.
RUN npm ci --omit=dev

# Copy the built application code and node_modules from the build stage
COPY --from=build /opt/app ./

# Run as a non-root user for security
USER node

# Expose the default Strapi port
EXPOSE 1337

# Start the application
CMD ["npm", "run", "start"]
