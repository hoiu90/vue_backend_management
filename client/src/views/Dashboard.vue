<template>
  <div class="dashboard-container">
    <el-container>
      <el-aside width="220px">
        <div class="logo">
          <span>微信小程序管理系统</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/express">
            <el-icon><Van /></el-icon>
            <span>快递管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/insurance">
            <el-icon><Umbrella /></el-icon>
            <span>保险管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/secondhand">
            <el-icon><Goods /></el-icon>
            <span>二手交易管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/errand">
            <el-icon><Service /></el-icon>
            <span>跑腿服务管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/housing">
            <el-icon><House /></el-icon>
            <span>租房管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/tips">
            <el-icon><Document /></el-icon>
            <span>省钱技巧管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                管理员
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { House, Van, Umbrella, Goods, Service, Document, ArrowDown } from '@element-plus/icons-vue';
import { logout } from '@/api/auth';

const router = useRouter();
const route = useRoute();

const activeMenu = computed(() => {
  return route.path;
});

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确认退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      
      await logout();
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  color: #bfcbd9;
  height: 100vh;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #2b3649;
}

.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: flex-end;
}

.header-right {
  margin-right: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style> 