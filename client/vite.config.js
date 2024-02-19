import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server : {
    proxy : {   //to solve cors issue
      '/api' : {  //any req to /api is redirected to the target
        target:'http://localhost:1624/',  //target server is set to port no. 1624
        secure:false,
      },
    },
  },
  plugins: [react()],
})
