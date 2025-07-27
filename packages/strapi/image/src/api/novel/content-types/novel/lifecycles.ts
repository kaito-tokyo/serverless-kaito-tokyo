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

    async afterUpdate(event) {
        const { result } = event;
        try {
            await strapi.service('plugin::github-actions-dispatcher.dispatch')
            .triggerDispatch('strapi-novel-update', { data: result });
        } catch (error) {
            strapi.log.error('Failed to dispatch GitHub Action for novel update:', error);
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
    }
};
