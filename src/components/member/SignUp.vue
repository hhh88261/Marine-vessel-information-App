<template>
  <div class="signup-container">
    <h2>회원가입</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">이름</label>
        <input
            v-model="form.username"
            type="text"
            id="username"
            placeholder="이름을 입력하세요"
            required
        />
      </div>

      <div class="form-group">
        <label for="email">이메일</label>
        <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="이메일을 입력하세요"
            required
        />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            required
        />
      </div>

      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    handleSubmit() {
      // 실제 API 호출은 여기에 추가해야 합니다.
      console.log('회원가입 정보:', this.form);

      // 회원가입 성공 시, 페이지를 리다이렉트하거나 알림을 표시할 수 있습니다.
      // 예시: this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
