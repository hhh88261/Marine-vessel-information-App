<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">로그인</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700">아이디</label>
          <input type="loginId" v-model="email" class="w-full p-2 border rounded mt-1"/>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">비밀번호</label>
          <input type="password" v-model="password" class="w-full p-2 border rounded mt-1"/>
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">로그인</button>
        <button @click="joinRouter">회원가입</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();

const joinRouter = () => {
  router.push('/signup');
}
</script>