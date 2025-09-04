export const EnvConfiguration = () => ({

    environment: process.env.NODE_ENV || 'env',     //* No se bien que hace esta variable :S
    mongoDb: process.env.MONGODB,                   //* dirección de mongo db.
    port: process.env.PORT || 3000,                 //* Puerto de la aplicación
    defaultLimit: process.env.DEFAULT_LIMIT || 7    //* Paginación de registros para el findAll()

});