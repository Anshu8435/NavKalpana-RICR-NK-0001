const resolveEnv = (names, fallback = undefined) => {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }

  return fallback;
};

export const getMongoUri = () =>
  resolveEnv(['MONGO_URI', 'MONGODB_URI'], 'mongodb://127.0.0.1:27017/cardioshield');

export const getJwtSecret = () => resolveEnv(['JWT_SECRET'], 'cardioshield-dev-secret');

export const getEmailPassword = () =>
  resolveEnv(['EMAIL_PASSWORD', 'EMAIL_PASS'], '');

export const getEmailUser = () => resolveEnv(['EMAIL_USER'], '');

export const getFrontendUrl = () => resolveEnv(['FRONTEND_URL'], 'http://localhost:5173');

export const getMlServiceUrl = () =>
  resolveEnv(['ML_SERVICE_URL'], 'http://localhost:8000');

export default resolveEnv;
