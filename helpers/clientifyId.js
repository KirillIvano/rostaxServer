export const clientifyId = entity => {
    entity.id = entity._id;
    delete entity._id;
};
