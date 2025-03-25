<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">로그인</h2>
        <div class="mb-4">
          <label class="block text-gray-700">아이디</label>
          <input type="text" v-model="username" class="w-full p-2 border rounded mt-1"/>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">비밀번호</label>
          <input type="password" v-model="password" class="w-full p-2 border rounded mt-1"/>
        </div>
        <button type="submit" @click="handleLogin" class="w-full bg-blue-500 text-white p-2 rounded" >로그인</button>
        <button @click="joinRouter">회원가입</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const username = ref('');
const password = ref('');

const joinRouter = () => {
  router.push('/signup');
};

// 로그인 API 호출 함수
const handleLogin = async () => {
  console.log(username.value,password.value)
  try {
    const requestData = {
      username: username.value,
      password: password.value,
    };
    const response = await axios.post('http://localhost:8888/login', requestData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // 응답 헤더에서 Authorization 토큰 가져오기
    const token = response.headers['authorization'];

    if (token) {
      // 토큰을 로컬 스토리지 또는 Vuex/Pinia에 저장
      localStorage.setItem('token', token);

      console.log('로그인 성공, 토큰:', token);

      // AisMap.vue로 이동
      router.push('/main');
    } else {
      console.error('토큰이 응답에 없음');
      alert('로그인 실패!');
    }
  } catch (error) {
    console.log('API ERROR!', error);
  }
};
</script>