<template>
  <div class="secondhand-container">
    <div class="page-header">
      <h2>二手交易管理</h2>
      <el-button type="primary" @click="handleAdd">新增二手商品</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="商品标题">
          <el-input v-model="queryParams.title" placeholder="商品标题" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryParams.category" placeholder="商品分类" clearable>
            <el-option label="电子产品" value="electronics" />
            <el-option label="家具家电" value="furniture" />
            <el-option label="服装鞋包" value="clothing" />
            <el-option label="图书音像" value="books" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="商品状态" clearable>
            <el-option label="在售" value="active" />
            <el-option label="已售" value="sold" />
            <el-option label="下架" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="secondHandList"
        border
        style="width: 100%"
      >
        <el-table-column prop="title" label="商品标题" width="180" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryTag(scope.row.category)">
              {{ getCategoryLabel(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            <span>¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增二手商品' : '编辑二手商品'"
      v-model="dialogVisible"
      width="600px"
      append-to-body
    >
      <el-form :model="secondHandForm" :rules="rules" ref="secondHandFormRef" label-width="100px">
        <el-form-item label="商品标题" prop="title">
          <el-input v-model="secondHandForm.title" placeholder="请输入商品标题" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="secondHandForm.category" placeholder="请选择商品分类" style="width: 100%">
            <el-option label="电子产品" value="electronics" />
            <el-option label="家具家电" value="furniture" />
            <el-option label="服装鞋包" value="clothing" />
            <el-option label="图书音像" value="books" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="secondHandForm.price" :min="0" :precision="2" :step="10" style="width: 100%" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="secondHandForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="secondHandForm.description" type="textarea" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-select v-model="secondHandForm.status" placeholder="请选择商品状态" style="width: 100%">
            <el-option label="在售" value="active" />
            <el-option label="已售" value="sold" />
            <el-option label="下架" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            action="/api/upload/images"
            :headers="{ Authorization: `Bearer ${token}` }"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :limit="5"
            :file-list="fileList"
            multiple
            list-type="picture-card"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  title: '',
  category: '',
  status: ''
});

// 表格数据
const secondHandList = ref([]);
const total = ref(0);
const loading = ref(false);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const secondHandFormRef = ref(null);
const secondHandForm = reactive({
  id: null,
  title: '',
  category: '',
  price: 0,
  phone: '',
  description: '',
  status: 'active',
  images: []
});

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入商品标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  status: [{ required: true, message: '请选择商品状态', trigger: 'change' }]
};

// 文件上传相关
const token = computed(() => localStorage.getItem('token') || '');
const fileList = ref([]);

// 分类标签
const getCategoryTag = (category) => {
  const categoryMap = {
    electronics: 'primary',
    furniture: 'success',
    clothing: 'warning',
    books: 'info',
    other: 'danger'
  };
  return categoryMap[category] || 'info';
};

// 分类标签文本
const getCategoryLabel = (category) => {
  const categoryMap = {
    electronics: '电子产品',
    furniture: '家具家电',
    clothing: '服装鞋包',
    books: '图书音像',
    other: '其他'
  };
  return categoryMap[category] || '其他';
};

// 状态标签
const getStatusTag = (status) => {
  const statusMap = {
    active: 'success',
    sold: 'info',
    inactive: 'danger'
  };
  return statusMap[status] || 'info';
};

// 状态标签文本
const getStatusLabel = (status) => {
  const statusMap = {
    active: '在售',
    sold: '已售',
    inactive: '下架'
  };
  return statusMap[status] || '未知';
};

// 加载数据
const getList = () => {
  loading.value = true;
  // 这里应该调用API获取数据
  // 模拟数据
  setTimeout(() => {
    secondHandList.value = [
      {
        id: 1,
        title: 'iPhone 13 Pro 256GB',
        category: 'electronics',
        price: 5999,
        phone: '13800138000',
        description: '九成新，无划痕，有发票',
        status: 'active',
        images: ['/uploads/sample1.jpg', '/uploads/sample2.jpg']
      },
      {
        id: 2,
        title: '实木书桌',
        category: 'furniture',
        price: 800,
        phone: '13900139000',
        description: '纯实木书桌，使用一年，无明显磨损',
        status: 'sold',
        images: ['/uploads/sample3.jpg']
      }
    ];
    total.value = 2;
    loading.value = false;
  }, 500);
};

// 查询
const handleQuery = () => {
  queryParams.page = 1;
  getList();
};

// 重置
const resetQuery = () => {
  queryParams.title = '';
  queryParams.category = '';
  queryParams.status = '';
  handleQuery();
};

// 分页
const handleSizeChange = (val) => {
  queryParams.limit = val;
  getList();
};

const handleCurrentChange = (val) => {
  queryParams.page = val;
  getList();
};

// 新增
const handleAdd = () => {
  dialogType.value = 'add';
  resetForm();
  fileList.value = [];
  dialogVisible.value = true;
};

// 编辑
const handleEdit = (row) => {
  dialogType.value = 'edit';
  resetForm();
  // 复制数据到表单
  Object.assign(secondHandForm, row);
  
  // 设置文件列表
  if (row.images && row.images.length > 0) {
    fileList.value = row.images.map(image => ({
      name: image.split('/').pop(),
      url: image
    }));
  } else {
    fileList.value = [];
  }
  
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除商品 ${row.title} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用API删除数据
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
    getList();
  }).catch(() => {});
};

// 重置表单
const resetForm = () => {
  if (secondHandFormRef.value) {
    secondHandFormRef.value.resetFields();
  }
  secondHandForm.id = null;
  secondHandForm.title = '';
  secondHandForm.category = '';
  secondHandForm.price = 0;
  secondHandForm.phone = '';
  secondHandForm.description = '';
  secondHandForm.status = 'active';
  secondHandForm.images = [];
};

// 文件上传前的验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB!');
    return false;
  }
  return true;
};

// 文件上传成功
const handleUploadSuccess = (response) => {
  if (response.code === 200) {
    if (Array.isArray(response.data)) {
      // 多图上传
      response.data.forEach(item => {
        if (!secondHandForm.images.includes(item.url)) {
          secondHandForm.images.push(item.url);
        }
      });
    } else {
      // 单图上传
      if (!secondHandForm.images.includes(response.data.url)) {
        secondHandForm.images.push(response.data.url);
      }
    }
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(response.message || '上传失败');
  }
};

// 文件上传失败
const handleUploadError = () => {
  ElMessage.error('上传失败');
};

// 提交表单
const submitForm = () => {
  secondHandFormRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用API提交数据
      if (dialogType.value === 'add') {
        // 新增
        ElMessage({
          type: 'success',
          message: '新增成功'
        });
      } else {
        // 编辑
        ElMessage({
          type: 'success',
          message: '更新成功'
        });
      }
      dialogVisible.value = false;
      getList();
    }
  });
};

onMounted(() => {
  getList();
});
</script>

<style scoped>
.secondhand-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 