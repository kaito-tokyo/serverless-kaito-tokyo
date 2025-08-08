interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  const strapiUrl = import.meta.env.STRAPI_URL;
  if (!strapiUrl) {
    throw new Error("STRAPI_URL is not defined in environment variables.");
  }

  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${strapiUrl}/api/${endpoint}`);
  if (query) {
    url.search = new URLSearchParams(query).toString();
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: "No error body." }));
    console.error(
      "Failed to fetch API:",
      res.status,
      res.statusText,
      errorBody,
    );
    throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
  }

  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}
