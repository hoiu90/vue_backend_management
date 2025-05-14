<template>
  <div class="insurance-container">
    <div class="page-header">
      <h2>保险管理</h2>
      <el-button type="primary" @click="handleAdd">新增保险产品</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="产品名称">
          <el-input v-model="queryParams.name" placeholder="产品名称" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.type" placeholder="保险类型" clearable>
            <el-option label="人寿保险" value="life" />
            <el-option label="健康保险" value="health" />
            <el-option label="财产保险" value="property" />
            <el-option label="意外保险" value="accident" />
            <el-option label="其他" value="other" />
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
        :data="insuranceList"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="产品名称" width="180" />
        <el-table-column label="产品图片" width="120">
          <template #default="scope">
            <div class="image-preview" v-if="scope.row.image">
              <el-image 
                style="width: 80px; height: 80px" 
                :src="scope.row.image" 
                fit="cover"
                :preview-src-list="[scope.row.image]"
              />
            </div>
            <span v-else>无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="保险类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">
              {{ getTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="company" label="保险公司" width="150" />
        <el-table-column prop="description" label="描述" min-width="150" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            <span class="price">¥{{ scope.row.price }}</span>
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
      :title="dialogType === 'add' ? '新增保险产品' : '编辑保险产品'"
      v-model="dialogVisible"
      width="600px"
      append-to-body
    >
      <el-form :model="insuranceForm" :rules="rules" ref="insuranceFormRef" label-width="100px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="insuranceForm.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="保险类型" prop="type">
          <el-select v-model="insuranceForm.type" placeholder="请选择保险类型" style="width: 100%">
            <el-option label="人寿保险" value="life" />
            <el-option label="健康保险" value="health" />
            <el-option label="财产保险" value="property" />
            <el-option label="意外保险" value="accident" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="保险公司" prop="company">
          <el-input v-model="insuranceForm.company" placeholder="请输入保险公司" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="insuranceForm.description" type="textarea" :rows="4" placeholder="请输入产品描述" />
        </el-form-item>
        <el-form-item label="保障内容" prop="coverage">
          <el-input v-model="insuranceForm.coverage" type="textarea" :rows="4" placeholder="请输入保障内容" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="insuranceForm.price" :min="0" :precision="2" :step="10" style="width: 100%" />
        </el-form-item>
        <el-form-item label="产品图片">
          <el-upload
            action="/api/upload/image"
            name="image"
            :headers="{ Authorization: `Bearer ${token}` }"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :limit="1"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogImageVisible" title="预览图片">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getInsuranceList, createInsurance, updateInsurance, deleteInsurance } from '@/api/insurance';

// 获取token
const token = localStorage.getItem('token') || '';

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  name: '',
  type: ''
});

// 表格数据
const insuranceList = ref([]);
const total = ref(0);
const loading = ref(false);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const insuranceFormRef = ref(null);
const insuranceForm = reactive({
  id: null,
  name: '',
  type: '',
  description: '',
  coverage: '',
  price: 0,
  company: '',
  image: ''
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择保险类型', trigger: 'change' }],
  company: [{ required: true, message: '请输入保险公司', trigger: 'blur' }],
  description: [{ required: true, message: '请输入产品描述', trigger: 'blur' }],
  coverage: [{ required: true, message: '请输入保障内容', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
};

// 文件上传相关
const fileList = ref([]);
const dialogImageUrl = ref('');
const dialogImageVisible = ref(false);

// 类型标签
const getTypeTag = (type) => {
  const typeMap = {
    life: 'success',
    health: 'primary',
    property: 'warning',
    accident: 'danger',
    other: 'info'
  };
  return typeMap[type] || 'info';
};

// 类型标签文本
const getTypeLabel = (type) => {
  const typeMap = {
    life: '人寿保险',
    health: '健康保险',
    property: '财产保险',
    accident: '意外保险',
    other: '其他'
  };
  return typeMap[type] || '其他';
};

// 加载数据
const getList = () => {
  loading.value = true;
  getInsuranceList(queryParams).then(response => {
    insuranceList.value = response.data.list;
    total.value = response.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
    ElMessage({
      type: 'error',
      message: '获取保险列表失败'
    });
  });
};

// 查询
const handleQuery = () => {
  queryParams.page = 1;
  getList();
};

// 重置
const resetQuery = () => {
  queryParams.name = '';
  queryParams.type = '';
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
  Object.assign(insuranceForm, row);
  
  // 设置文件列表
  if (row.image) {
    fileList.value = [{
      name: row.image.split('/').pop(),
      url: row.image
    }];
  } else {
    fileList.value = [];
  }
  
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除保险产品 ${row.name} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteInsurance(row._id).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      });
      getList();
    }).catch(() => {
      ElMessage({
        type: 'error',
        message: '删除失败'
      });
    });
  }).catch(() => {});
};

// 图片预览
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogImageVisible.value = true;
};

// 移除图片
const handleRemove = () => {
  fileList.value = [];
  insuranceForm.image = '';
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
  if (response.code === 200 && response.data) {
    insuranceForm.image = response.data.url;
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(response.message || '上传失败');
  }
};

// 重置表单
const resetForm = () => {
  if (insuranceFormRef.value) {
    insuranceFormRef.value.resetFields();
  }
  insuranceForm.id = null;
  insuranceForm.name = '';
  insuranceForm.type = '';
  insuranceForm.description = '';
  insuranceForm.coverage = '';
  insuranceForm.price = 0;
  insuranceForm.company = '';
  insuranceForm.image = '';
};

// 提交表单
const submitForm = () => {
  insuranceFormRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 新增
        createInsurance(insuranceForm).then(() => {
          ElMessage({
            type: 'success',
            message: '新增成功'
          });
          dialogVisible.value = false;
          getList();
        }).catch(() => {
          ElMessage({
            type: 'error',
            message: '新增失败'
          });
        });
      } else {
        // 编辑
        updateInsurance(insuranceForm._id, insuranceForm).then(() => {
          ElMessage({
            type: 'success',
            message: '更新成功'
          });
          dialogVisible.value = false;
          getList();
        }).catch(() => {
          ElMessage({
            type: 'error',
            message: '更新失败'
          });
        });
      }
    }
  });
};

onMounted(() => {
  getList();
});
</script>

<style scoped>
.insurance-container {
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

.image-preview {
  cursor: pointer;
  transition: all 0.3s;
}

.image-preview:hover {
  transform: scale(1.05);
}

.price {
  color: #ff4500;
  font-weight: bold;
}
</style> 