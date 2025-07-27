export default {
    async afterCreate(event) {
        const { result } = event;
        try {
            await strapi.service('plugin::github-actions-dispatcher.dispatch')
            .triggerDispatch('strapi-novel-create', { data: result });
        } catch (error) {
            strapi.log.error('Failed to dispatch GitHub Action for novel creation:', error);
        }
    },

    async afterCreateMany(event) {
        const { results } = event;
        try {
            await strapi.service('plugin::github-actions-dispatcher.dispatch')
            .triggerDispatch('strapi-novel-create-many', { data: results });
        } catch (error) {
            strapi.log.error('Failed to dispatch GitHub Action for novel creation (many):', error);
        }
    },

    async afterUpdate(event) {
        const { result } = event;
        try {
            await strapi.service('plugin::github-actions-dispatcher.dispatch')
            .triggerDispatch('strapi-novel-update', { data: result });
        } catch (error) {
            strapi.log.error('Failed to dispatch GitHub Action for novel update:', error);
        }
    },

    async afterUpdateMany(event) {
        const { results } = event;
        try {
            await strapi.service('plugin::github-actions-dispatcher.dispatch')
            .triggerDispatch('strapi-novel-update-many', { data: results });
        } catch (error) {
            strapi.log.error('Failed to dispatch GitHub Action for novel update (many):', error);
        }
    },

    async afterDelete(event) {
        const { result } = event;
        try {
            await strapi.service('plugin::github-actions-dispatcher.dispatch')
            .triggerDispatch('strapi-novel-delete', { data: result });
        } catch (error) {
            strapi.log.error('Failed to dispatch GitHub Action for novel deletion:', error);
        }
    },

    async afterDeleteMany(event) {
        const { results } = event;
        try {
            await strapi.service('plugin::github-actions-dispatcher.dispatch')
            .triggerDispatch('strapi-novel-delete-many', { data: results });
        } catch (error) {
            strapi.log.error('Failed to dispatch GitHub Action for novel deletion (many):', error);
        }
    }
};
