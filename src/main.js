import { createApp } from 'vue';
import App from './App.vue';
import VueTimepikcerEsm from "vue3-timepicker";
import 'vue3-timepicker/dist/VueTimepicker.css'
import store from './store';

createApp(App)
    .use(store)
    .component('VueDatePicker', VueTimepikcerEsm)
    .mount('#app');
