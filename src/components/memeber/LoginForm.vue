<script setup>
import { ref } from 'vue'

// 이메일과 비밀번호를 저장할 ref 변수들
const email = ref('')
const password = ref('')
const errorMessage = ref('')

// 로그인 함수 (예시로 간단히 콘솔에 출력)
function login() {
  // 유효성 검사
  if (!email.value || !password.value) {
    errorMessage.value = '아이디와 비밀번호를 입력해주세요.'
    return
  }

  // 실제 로그인 로직은 여기서 API 요청 등으로 구현
  console.log('로그인 시도:', email.value, password.value)

  // 로그인 성공 예시
  // 만약 성공했다면 errorMessage를 비워두기
  errorMessage.value = ''
  alert('로그인 성공!')
}
</script>

<template>
  <div class="login-container">
    <h2>로그인</h2>

    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">이메일</label>
        <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일"
        />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호"
        />
      </div>

      <!-- 에러 메시지 표시 -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button type="submit">로그인</button>
      <button type="button">회원가입</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #36976b;
}

.error-message {
  color: red;
  font-size: 14px;
  text-align: center;
}
</style>
