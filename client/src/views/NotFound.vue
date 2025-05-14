<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h3>页面不存在</h3>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.content {
  text-align: center;
}

h1 {
  font-size: 72px;
  color: #409EFF;
  margin-bottom: 10px;
}

h3 {
  font-size: 24px;
  color: #606266;
  margin-bottom: 30px;
}
</style> 