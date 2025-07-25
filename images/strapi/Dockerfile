# ----- Stage 1: Build Stage -----
FROM node:20-alpine AS build

# Install build-time dependencies required for native modules, especially for 'sharp'
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

# Set production environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/

# Copy package.json and lock file to leverage Docker cache
COPY package.json yarn.lock ./

# Install production dependencies
RUN yarn config set network-timeout 600000 -g && yarn install --production

# Add node_modules binaries to PATH
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app

# Copy the rest of the application source code
COPY src/ package.json yarn.lock ./

# Build the Strapi admin panel
RUN yarn build

# ----- Stage 2: Production Stage -----
FROM node:20-alpine

# Only install runtime dependencies for 'sharp'
RUN apk add --no-cache vips-dev

# Set production environment
ENV NODE_ENV=production

WORKDIR /opt/

# Copy built node_modules from the build stage
COPY --from=build /opt/node_modules ./node_modules

WORKDIR /opt/app

# Copy built application code from the build stage
COPY --from=build /opt/app ./

# Add node_modules binaries to PATH
ENV PATH=/opt/node_modules/.bin:$PATH

# Run as a non-root user for security
USER node

# Expose the default Strapi port
EXPOSE 1337

# Start the Strapi application
CMD ["yarn", "start"]