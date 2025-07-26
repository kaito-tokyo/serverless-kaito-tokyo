export default {
    async afterCreate(event) {
        const { result } = event;
        strapi.plugin('my-github-actions-dispatcher')
        .service('dispatch')
        .triggerDispatch('strapi-novel-create', { data: result });
    },

    async afterUpdate(event) {
        const { result } = event;
        strapi.plugin('my-github-actions-dispatcher')
        .service('dispatch')
        .triggerDispatch('strapi-novel-update', { data: result });
    },

    async afterDelete(event) {
        const { result } = event;
        strapi.plugin('my-github-actions-dispatcher')
        .service('dispatch')
        .triggerDispatch('strapi-novel-delete', { data: result });
    }
};
