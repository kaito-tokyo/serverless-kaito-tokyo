# ----- Stage 1: Build Stage -----
# This stage installs dependencies and builds the application.
FROM node:20-alpine AS build

# Install build-time dependencies required for native modules, especially for 'sharp'
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

# Enable Corepack to use the version of Yarn defined in the project
RUN corepack enable

WORKDIR /opt/app

# Copy package.json, yarn.lock, and .yarnrc.yml first to leverage Docker's cache
# Use a wildcard to prevent errors if .yarnrc.yml doesn't exist
COPY package.json yarn.lock .yarnrc.yml ./

# Copy Yarn Berry binaries and plugins
COPY .yarn ./.yarn

# Install dependencies. The --immutable flag prevents the lock file from being changed.
RUN yarn install --immutable

# Copy the entire application source code
COPY database/ database/
COPY src/ src/
COPY config/ config/
COPY types/ types/
COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./

# Build the Strapi admin panel
# It's more reliable to set NODE_ENV directly in the RUN command than passing it as an ARG
ENV NODE_ENV=production
RUN yarn build


# ----- Stage 2: Production Stage -----
# This stage creates a lightweight final image with only the built artifacts and production dependencies.
FROM node:20-alpine

# Install only runtime dependencies required for 'sharp'
RUN apk add --no-cache vips-dev

# Set production environment
ENV NODE_ENV=production

# Enable Corepack
RUN corepack enable

WORKDIR /opt/app

# Copy files required for the production environment from the build stage
COPY --from=build /opt/app/package.json /opt/app/yarn.lock /opt/app/.yarnrc.yml ./
COPY --from=build /opt/app/.yarn ./.yarn

# Since .yarn/cache is copied, this installation will be very fast.
# This builds the production dependencies, excluding devDependencies.
RUN yarn install --production --immutable

# Copy built assets and necessary source code from the build stage
COPY --from=build /opt/app/build ./build
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/database ./database
COPY --from=build /opt/app/src ./src
COPY --from=build /opt/app/public ./public

# Run as a non-root user for security
USER node

# Expose the default Strapi port
EXPOSE 1337

# Start the application
# With Yarn Berry, it's common to run via PnP using 'yarn start'
CMD ["yarn", "start"]
