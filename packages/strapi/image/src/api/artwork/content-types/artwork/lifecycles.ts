export default {
  async afterCreate(event: any) {
    const { result } = event;
    try {
      await strapi
        .service("plugin::github-actions-dispatcher.dispatch")
        .triggerDispatch("strapi-artwork-create", { data: result });
    } catch (error) {
      strapi.log.error(
        "Failed to dispatch GitHub Action for artwork creation:",
        error,
      );
    }
  },

  async afterCreateMany(event: any) {
    const { results } = event;
    try {
      await strapi
        .service("plugin::github-actions-dispatcher.dispatch")
        .triggerDispatch("strapi-artwork-create-many", { data: results });
    } catch (error) {
      strapi.log.error(
        "Failed to dispatch GitHub Action for artwork creation (many):",
        error,
      );
    }
  },

  async afterUpdate(event: any) {
    const { result } = event;
    try {
      await strapi
        .service("plugin::github-actions-dispatcher.dispatch")
        .triggerDispatch("strapi-artwork-update", { data: result });
    } catch (error) {
      strapi.log.error(
        "Failed to dispatch GitHub Action for artwork update:",
        error,
      );
    }
  },

  async afterUpdateMany(event: any) {
    const { results } = event;
    try {
      await strapi
        .service("plugin::github-actions-dispatcher.dispatch")
        .triggerDispatch("strapi-artwork-update-many", { data: results });
    } catch (error) {
      strapi.log.error(
        "Failed to dispatch GitHub Action for artwork update (many):",
        error,
      );
    }
  },

  async afterDelete(event: any) {
    const { result } = event;
    try {
      await strapi
        .service("plugin::github-actions-dispatcher.dispatch")
        .triggerDispatch("strapi-artowork-delete", { data: result });
    } catch (error) {
      strapi.log.error(
        "Failed to dispatch GitHub Action for artwork deletion:",
        error,
      );
    }
  },

  async afterDeleteMany(event: any) {
    const { results } = event;
    try {
      await strapi
        .service("plugin::github-actions-dispatcher.dispatch")
        .triggerDispatch("strapi-artwork-delete-many", { data: results });
    } catch (error) {
      strapi.log.error(
        "Failed to dispatch GitHub Action for artwork deletion (many):",
        error,
      );
    }
  },
};
