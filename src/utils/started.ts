export const started = (port: number, server_url: string): void => {
  console.log(``);
  console.log(`🔰  environment:\x1b[32m ${process.env.NODE_ENV} \x1b[0m`);
  console.log(`📢  node version:\x1b[32m ${process.versions.node} \x1b[0m`);
  if (process.env.NODE_ENV === 'development') console.log(`🌐  started on\x1b[34m ${server_url}:${port} \x1b[0m`);
  if (process.env.SHOW_DOCS === 'true') console.log(`🌐  swagger\x1b[34m ${server_url}:${port}/api-docs \x1b[0m`);
  if (process.env.DB_HOST && process.env.NODE_ENV === 'development') {
    console.log(`💾  database:\x1b[31m ${process.env.DB_NAME} \x1b[0m
           ╠═ host:\x1b[31m ${process.env.DB_COMPOSE_HOST || process.env.DB_HOST} \x1b[0m
           ╚═ port:\x1b[31m ${process.env.DB_PORT} \x1b[0m`);
  }
  console.log(``);
};
