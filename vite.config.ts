/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv } from 'vite';
import dotenv from 'dotenv'; 

dotenv.config(); 

export default defineConfig(({  mode }) => {
  
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: { 
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      __API_URL__: JSON.stringify(env.API_URL),
    },
  }
})