const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1/webbandt",
    }
};
module.exports = config;