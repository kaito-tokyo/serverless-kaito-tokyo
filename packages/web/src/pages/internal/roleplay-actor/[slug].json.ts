import type { APIRoute } from "astro";
import fetchApi from "../../../lib/strapi.js";
import type { RoleplayActor } from "../../../interfaces/RoleplayActor.js";

export async function getStaticPaths() {
  const roleplayActors = await fetchApi<RoleplayActor[]>({
    endpoint: "roleplay-actors",
    wrappedByKey: "data",
  });

  return roleplayActors.map((roleplayActor) => ({
    params: { slug: roleplayActor.slug },
    props: { roleplayActor },
  }));
}

export const GET: APIRoute<{ roleplayActor: RoleplayActor }> = async ({
  props,
}) => {
  return new Response(JSON.stringify(props.roleplayActor), {
    headers: { "Content-Type": "application/json" },
  });
};
