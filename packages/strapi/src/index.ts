import { Container } from "@cloudflare/containers";

/**
 * Defines the environment variables and bindings available to the Worker.
 * This interface ensures type safety for accessing secrets and bindings.
 */
export interface Env {
  // Durable Object binding for the container, defined in wrangler.toml
  STRAPI_CONTAINER: DurableObjectNamespace;

  // Secrets set with `wrangler secret put`
  DATABASE_URL: string;
  ADMIN_JWT_SECRET: string;
  API_TOKEN_SALT: string;
  APP_KEYS: string;
  JWT_SECRET: string;
  TRANSFER_TOKEN_SALT: string;
  CF_ACCESS_KEY_ID: string;
  CF_SECRET_ACCESS_KEY: string;

  // Variables from the [vars] section in wrangler.toml
  CF_ENDPOINT: string;
  CF_BUCKET: string;
  CF_PUBLIC_ACCESS_URL: string;
}

// Define the Container class to specify its runtime configuration.
export class StrapiContainer extends Container<Env> {
  // The port Strapi listens on inside the container.
  defaultPort = 1337;

  // Pass environment variables and secrets from the Worker's env to the container.
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.envVars = {
      NODE_ENV: "production",
      // Database configuration
      DATABASE_URL: this.env.DATABASE_URL,
      // R2 configuration from wrangler.toml [vars] and secrets
      CF_ACCESS_KEY_ID: this.env.CF_ACCESS_KEY_ID,
      CF_SECRET_ACCESS_KEY: this.env.CF_SECRET_ACCESS_KEY,
      CF_ENDPOINT: this.env.CF_ENDPOINT,
      CF_BUCKET: this.env.CF_BUCKET,
      CF_PUBLIC_ACCESS_URL: this.env.CF_PUBLIC_ACCESS_URL,
      // Strapi's required secrets
      ADMIN_JWT_SECRET: this.env.ADMIN_JWT_SECRET,
      API_TOKEN_SALT: this.env.API_TOKEN_SALT,
      APP_KEYS: this.env.APP_KEYS,
      TRANSFER_TOKEN_SALT: this.env.TRANSFER_TOKEN_SALT,
      JWT_SECRET: this.env.JWT_SECRET,

      // Additional secrets for plugins
      GITHUB_APP_ID: this.env.GITHUB_APP_ID,
      GITHUB_INSTALLATION_ID: this.env.GITHUB_INSTALLATION_ID,
      GITHUB_PRIVATE_KEY: this.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n"),
      GITHUB_OWNER: this.env.GITHUB_OWNER,
      GITHUB_REPO: this.env.GITHUB_REPO,
    };
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Get a stub for the Durable Object that manages our container.
    const id = env.STRAPI_CONTAINER.idFromName("strapi-singleton");
    const stub = env.STRAPI_CONTAINER.get(id);

    // Forward the request to the container via the Durable Object.
    return stub.fetch(request);
  },
};
