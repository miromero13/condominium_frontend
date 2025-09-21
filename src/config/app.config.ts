import packgeJson from '../../package.json' assert { type: 'json' }

export const AppConfig = {
  APP_NAME: packgeJson.name,
  APP_VERSION: packgeJson.version,
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE ?? 'Condominium Management System',
  APP_ENV: import.meta.env.MODE ?? 'development',
  API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
}
