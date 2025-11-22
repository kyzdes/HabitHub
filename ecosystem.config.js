// PM2 Configuration for HabitHub
module.exports = {
  apps: [
    {
      name: "habithub",
      script: "./dist/index.js",
      instances: "max", // Use all CPU cores
      exec_mode: "cluster", // Cluster mode for better performance
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      // Graceful start/shutdown
      listen_timeout: 10000,
      kill_timeout: 5000,
      wait_ready: false,
      // Restart strategies
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      // Advanced features
      exp_backoff_restart_delay: 100,
    },
  ],
};
