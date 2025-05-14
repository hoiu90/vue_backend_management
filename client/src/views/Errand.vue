<template>
  <div class="errand-container">
    <div class="page-header">
      <h2>跑腿管理</h2>
      <el-button type="primary" @click="handleAdd">新增跑腿订单</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="订单类型">
          <el-select v-model="queryParams.orderType" placeholder="订单类型" clearable>
            <el-option label="取餐" value="food" />
            <el-option label="取物" value="package" />
            <el-option label="代购" value="shopping" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="订单状态" clearable>
            <el-option label="待接单" value="waiting" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
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
        :data="errandList"
        border
        style="width: 100%"
      >
        <el-table-column prop="orderNumber" label="订单编号" width="120" />
        <el-table-column prop="orderType" label="订单类型" width="100">
          <template #default="scope">
            <el-tag :type="getOrderTypeTag(scope.row.orderType)">
              {{ getOrderTypeText(scope.row.orderType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="100" />
        <el-table-column prop="customerPhone" label="联系电话" width="120" />
        <el-table-column prop="pickupAddress" label="取件地址" />
        <el-table-column prop="deliveryAddress" label="送达地址" />
        <el-table-column prop="description" label="订单描述" show-overflow-tooltip />
        <el-table-column prop="fee" label="跑腿费" width="80">
          <template #default="scope">
            <span>¥{{ scope.row.fee }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
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
      :title="dialogType === 'add' ? '新增跑腿订单' : '编辑跑腿订单'"
      v-model="dialogVisible"
      width="600px"
      append-to-body
    >
      <el-form :model="errandForm" :rules="rules" ref="errandFormRef" label-width="100px">
        <el-form-item label="订单类型" prop="orderType">
          <el-select v-model="errandForm.orderType" placeholder="请选择订单类型" style="width: 100%">
            <el-option label="取餐" value="food" />
            <el-option label="取物" value="package" />
            <el-option label="代购" value="shopping" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="errandForm.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="customerPhone">
          <el-input v-model="errandForm.customerPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="取件地址" prop="pickupAddress">
          <el-input v-model="errandForm.pickupAddress" placeholder="请输入取件地址" />
        </el-form-item>
        <el-form-item label="送达地址" prop="deliveryAddress">
          <el-input v-model="errandForm.deliveryAddress" placeholder="请输入送达地址" />
        </el-form-item>
        <el-form-item label="订单描述" prop="description">
          <el-input v-model="errandForm.description" type="textarea" placeholder="请输入订单描述" />
        </el-form-item>
        <el-form-item label="跑腿费" prop="fee">
          <el-input-number v-model="errandForm.fee" :min="0" :precision="2" :step="5" style="width: 100%" />
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="errandForm.status" placeholder="请选择订单状态" style="width: 100%">
            <el-option label="待接单" value="waiting" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
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

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  orderType: '',
  status: ''
});

// 表格数据
const errandList = ref([]);
const total = ref(0);
const loading = ref(false);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const errandFormRef = ref(null);
const errandForm = reactive({
  id: null,
  orderNumber: '',
  orderType: 'food',
  customerName: '',
  customerPhone: '',
  pickupAddress: '',
  deliveryAddress: '',
  description: '',
  fee: 10,
  status: 'waiting'
});

// 表单验证规则
const rules = {
  orderType: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
  customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  customerPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  pickupAddress: [{ required: true, message: '请输入取件地址', trigger: 'blur' }],
  deliveryAddress: [{ required: true, message: '请输入送达地址', trigger: 'blur' }],
  fee: [{ required: true, message: '请输入跑腿费', trigger: 'blur' }],
  status: [{ required: true, message: '请选择订单状态', trigger: 'change' }]
};

// 订单类型标签和文本
const getOrderTypeTag = (type) => {
  const map = {
    food: 'success',
    package: 'info',
    shopping: 'warning',
    other: ''
  };
  return map[type] || '';
};

const getOrderTypeText = (type) => {
  const map = {
    food: '取餐',
    package: '取物',
    shopping: '代购',
    other: '其他'
  };
  return map[type] || '其他';
};

// 状态标签和文本
const getStatusTag = (status) => {
  const map = {
    waiting: 'info',
    processing: 'warning',
    completed: 'success',
    cancelled: 'danger'
  };
  return map[status] || '';
};

const getStatusText = (status) => {
  const map = {
    waiting: '待接单',
    processing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status] || '未知';
};

// 加载数据
const getList = () => {
  loading.value = true;
  // 这里应该调用API获取数据
  // 模拟数据
  setTimeout(() => {
    errandList.value = [
      {
        id: 1,
        orderNumber: 'ER20230501001',
        orderType: 'food',
        customerName: '张三',
        customerPhone: '13800138000',
        pickupAddress: '学府路麦当劳',
        deliveryAddress: '大学城A区2栋304',
        description: '麦当劳套餐1份，不要番茄酱',
        fee: 15,
        status: 'completed'
      },
      {
        id: 2,
        orderNumber: 'ER20230501002',
        orderType: 'package',
        customerName: '李四',
        customerPhone: '13900139000',
        pickupAddress: '菜鸟驿站',
        deliveryAddress: '大学城B区5栋505',
        description: '顺丰快递一个，中型包裹',
        fee: 10,
        status: 'waiting'
      }
    ];
    total.value = 2;
    loading.value = false;
  }, 500);
};

// 查询操作
const handleQuery = () => {
  queryParams.page = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryParams.orderType = '';
  queryParams.status = '';
  handleQuery();
};

// 处理分页
const handleSizeChange = (val) => {
  queryParams.limit = val;
  getList();
};

const handleCurrentChange = (val) => {
  queryParams.page = val;
  getList();
};

// 新增操作
const handleAdd = () => {
  resetForm();
  dialogType.value = 'add';
  dialogVisible.value = true;
};

// 编辑操作
const handleEdit = (row) => {
  resetForm();
  dialogType.value = 'edit';
  dialogVisible.value = true;
  // 复制数据到表单
  Object.assign(errandForm, row);
};

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确认要删除该跑腿订单吗？', '提示', {
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
  if (errandFormRef.value) {
    errandFormRef.value.resetFields();
  }
  errandForm.id = null;
  errandForm.orderNumber = '';
  errandForm.orderType = 'food';
  errandForm.customerName = '';
  errandForm.customerPhone = '';
  errandForm.pickupAddress = '';
  errandForm.deliveryAddress = '';
  errandForm.description = '';
  errandForm.fee = 10;
  errandForm.status = 'waiting';
};

// 提交表单
const submitForm = () => {
  errandFormRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用API保存数据
      ElMessage({
        type: 'success',
        message: dialogType.value === 'add' ? '新增成功' : '修改成功'
      });
      dialogVisible.value = false;
      getList();
    }
  });
};

// 页面加载时获取数据
onMounted(() => {
  getList();
});
</script>

<style scoped>
.errand-container {
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