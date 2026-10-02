import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const SUPABASE_URL = 'https://lgxskxovlyllyslnpsci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxneHNreG92bHlsbHlzbG5wc2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MjI3MzMsImV4cCI6MjEwNjM5ODczM30.qJp-cFUPEYW9zyU_dZnYvLBOG9FBc5GXy03O_U57V4E';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY),
  },
  server: {
    port: 3000,
    open: false,
    host: true,
  },
});

