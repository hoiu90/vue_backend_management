<template>
  <div class="express-container">
    <div class="page-header">
      <h2>快递管理</h2>
      <el-button type="primary" @click="handleAdd">新增快递订单</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="寄件人">
          <el-input v-model="queryParams.sender" placeholder="寄件人姓名" clearable />
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="queryParams.receiver" placeholder="收件人姓名" clearable />
        </el-form-item>
        <el-form-item label="寄件方式">
          <el-select v-model="queryParams.sendMethod" placeholder="寄件方式" clearable>
            <el-option label="上门取件" value="pickup" />
            <el-option label="自行送达" value="self" />
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
        :data="expressList"
        border
        style="width: 100%"
      >
        <el-table-column prop="senderName" label="寄件人" width="100" />
        <el-table-column prop="senderPhone" label="寄件人电话" width="120" />
        <el-table-column prop="receiverName" label="收件人" width="100" />
        <el-table-column prop="receiverPhone" label="收件人电话" width="120" />
        <el-table-column label="物品图片" width="120">
          <template #default="scope">
            <div class="image-preview" v-if="scope.row.images && scope.row.images.length > 0">
              <el-image 
                style="width: 80px; height: 80px" 
                :src="scope.row.images[0]" 
                fit="cover"
                :preview-src-list="scope.row.images"
                :initial-index="0"
              />
            </div>
            <span v-else>无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="pickupTime" label="上门时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.pickupTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="itemInfo" label="物品信息" min-width="150" />
        <el-table-column prop="sendMethod" label="寄件方式" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.sendMethod === 'pickup' ? 'success' : 'info'">
              {{ scope.row.sendMethod === 'pickup' ? '上门取件' : '自行送达' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="estimatedPrice" label="预估价格" width="100">
          <template #default="scope">
            <span class="price">¥{{ scope.row.estimatedPrice }}</span>
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
      :title="dialogType === 'add' ? '新增快递订单' : '编辑快递订单'"
      v-model="dialogVisible"
      width="600px"
      append-to-body
    >
      <el-form :model="expressForm" :rules="rules" ref="expressFormRef" label-width="100px">
        <el-form-item label="寄件人" prop="senderName">
          <el-input v-model="expressForm.senderName" placeholder="请输入寄件人姓名" />
        </el-form-item>
        <el-form-item label="寄件人电话" prop="senderPhone">
          <el-input v-model="expressForm.senderPhone" placeholder="请输入寄件人电话" />
        </el-form-item>
        <el-form-item label="收件人" prop="receiverName">
          <el-input v-model="expressForm.receiverName" placeholder="请输入收件人姓名" />
        </el-form-item>
        <el-form-item label="收件人电话" prop="receiverPhone">
          <el-input v-model="expressForm.receiverPhone" placeholder="请输入收件人电话" />
        </el-form-item>
        <el-form-item label="上门时间" prop="pickupTime">
          <el-date-picker
            v-model="expressForm.pickupTime"
            type="datetime"
            placeholder="选择上门时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="物品信息" prop="itemInfo">
          <el-input v-model="expressForm.itemInfo" type="textarea" :rows="4" placeholder="请输入物品信息" />
        </el-form-item>
        <el-form-item label="快递备注" prop="remark">
          <el-input v-model="expressForm.remark" type="textarea" :rows="4" placeholder="请输入快递备注" />
        </el-form-item>
        <el-form-item label="物品图片" prop="images">
          <el-upload
            action="/api/upload/image"
            name="image"
            :headers="{ Authorization: `Bearer ${token}` }"
            list-type="picture-card"
            :file-list="imageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogImageVisible" title="预览图片">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="寄件方式" prop="sendMethod">
          <el-radio-group v-model="expressForm.sendMethod">
            <el-radio label="pickup">上门取件</el-radio>
            <el-radio label="self">自行送达</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预估价格" prop="estimatedPrice">
          <el-input-number v-model="expressForm.estimatedPrice" :min="0" :precision="2" :step="10" />
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
import { getExpressList, createExpress, updateExpress, deleteExpress } from '@/api/express';

// 获取token
const token = localStorage.getItem('token') || '';

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  sender: '',
  receiver: '',
  sendMethod: ''
});

// 表格数据
const expressList = ref([]);
const total = ref(0);
const loading = ref(false);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const expressFormRef = ref(null);
const expressForm = reactive({
  id: null,
  senderName: '',
  senderPhone: '',
  receiverName: '',
  receiverPhone: '',
  pickupTime: '',
  itemInfo: '',
  remark: '',
  sendMethod: 'pickup',
  estimatedPrice: 0,
  images: []
});

// 图片上传相关
const imageList = ref([]);
const dialogImageUrl = ref('');
const dialogImageVisible = ref(false);

// 表单验证规则
const rules = {
  senderName: [{ required: true, message: '请输入寄件人姓名', trigger: 'blur' }],
  senderPhone: [{ required: true, message: '请输入寄件人电话', trigger: 'blur' }],
  receiverName: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
  receiverPhone: [{ required: true, message: '请输入收件人电话', trigger: 'blur' }],
  itemInfo: [{ required: true, message: '请输入物品信息', trigger: 'blur' }],
  sendMethod: [{ required: true, message: '请选择寄件方式', trigger: 'change' }],
  estimatedPrice: [{ required: true, message: '请输入预估价格', trigger: 'blur' }]
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 加载数据
const getList = () => {
  loading.value = true;
  getExpressList(queryParams).then(response => {
    expressList.value = response.data.list;
    total.value = response.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
    ElMessage({
      type: 'error',
      message: '获取快递列表失败'
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
  queryParams.sender = '';
  queryParams.receiver = '';
  queryParams.sendMethod = '';
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
  dialogVisible.value = true;
  imageList.value = [];
};

// 编辑
const handleEdit = (row) => {
  dialogType.value = 'edit';
  resetForm();
  // 复制数据到表单
  Object.assign(expressForm, row);
  // 设置图片列表
  imageList.value = row.images ? row.images.map(url => {
    return {
      name: url.split('/').pop(),
      url: url
    };
  }) : [];
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除快递订单吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteExpress(row._id).then(() => {
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
const handleRemove = (file) => {
  const index = imageList.value.indexOf(file);
  if (index !== -1) {
    imageList.value.splice(index, 1);
  }
  // 同步到表单
  expressForm.images = imageList.value.map(item => item.url);
};

// 上传成功
const handleUploadSuccess = (response) => {
  // 后端返回的是文件URL
  if (response.code === 200 && response.data) {
    expressForm.images.push(response.data.url);
  }
};

// 重置表单
const resetForm = () => {
  if (expressFormRef.value) {
    expressFormRef.value.resetFields();
  }
  expressForm.id = null;
  expressForm.senderName = '';
  expressForm.senderPhone = '';
  expressForm.receiverName = '';
  expressForm.receiverPhone = '';
  expressForm.pickupTime = '';
  expressForm.itemInfo = '';
  expressForm.remark = '';
  expressForm.sendMethod = 'pickup';
  expressForm.estimatedPrice = 0;
  expressForm.images = [];
};

// 提交表单
const submitForm = () => {
  expressFormRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 新增
        createExpress(expressForm).then(() => {
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
        updateExpress(expressForm._id, expressForm).then(() => {
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
.express-container {
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