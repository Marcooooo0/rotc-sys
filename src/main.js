import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // your router setup
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

loadFonts();

createApp(App)
  .use(router)   // ✅ This line is missing
  .use(vuetify)
  .mount('#app');

