<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(card, index) in cards" :key="index">
        <el-card class="box-card" shadow="hover">
          <div class="card-header">
            <span>{{ card.title }}</span>
            <el-button type="primary" size="small" @click="goToModule(card.path)">进入管理</el-button>
          </div>
          <div class="card-content">
            <el-icon :size="50" :color="card.color"><component :is="card.icon" /></el-icon>
            <div class="card-count">{{ card.count || 0 }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { House, Van, Umbrella, Goods, Service, Document } from '@element-plus/icons-vue';

const router = useRouter();

const cards = ref([
  { title: '快递管理', icon: 'Van', color: '#409EFF', path: '/dashboard/express', count: 0 },
  { title: '保险管理', icon: 'Umbrella', color: '#67C23A', path: '/dashboard/insurance', count: 0 },
  { title: '二手交易管理', icon: 'Goods', color: '#E6A23C', path: '/dashboard/secondhand', count: 0 },
  { title: '跑腿服务管理', icon: 'Service', color: '#F56C6C', path: '/dashboard/errand', count: 0 },
  { title: '租房管理', icon: 'House', color: '#909399', path: '/dashboard/housing', count: 0 },
  { title: '省钱技巧管理', icon: 'Document', color: '#9B59B6', path: '/dashboard/tips', count: 0 }
]);

const goToModule = (path) => {
  router.push(path);
};

// 在实际应用中，这里可以调用API获取各模块的数据统计
onMounted(() => {
  // 模拟数据
  cards.value[0].count = 28;
  cards.value[1].count = 15;
  cards.value[2].count = 42;
  cards.value[3].count = 31;
  cards.value[4].count = 24;
  cards.value[5].count = 19;
});
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
  height: 180px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.card-count {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}
</style> 