module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3,
      exec_mode: "cluster",
      max_memory_restart: "200M",
      error_file: "./logs/app/err.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      merge_logs: true,
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
