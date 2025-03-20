import { createApp } from 'vue';
import App from './App.vue';
import VueTimepikcerEsm from "vue3-timepicker";
import 'vue3-timepicker/dist/VueTimepicker.css';
import router from "./router/MemberRouter"; // ✅ router로 변경

const app = createApp(App);

app.use(router); // ✅ 반드시 추가!
app.component('VueDatePicker', VueTimepikcerEsm);
app.mount('#app');