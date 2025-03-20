import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from "@/components/member/LoginForm.vue";
import SignUp from "@/components/member/SignUp.vue";

const routes = [
    { path: '/', component: LoginForm },
    { path: '/signup', component: SignUp }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;