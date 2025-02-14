module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "logs/err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
