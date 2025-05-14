<template>
  <div class="housing-container">
    <div class="page-header">
      <h2>租房管理</h2>
      <el-button type="primary" @click="handleAdd">发布房源</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="区域">
          <el-select v-model="queryParams.area" placeholder="选择区域" clearable>
            <el-option label="大学城" value="university" />
            <el-option label="市中心" value="downtown" />
            <el-option label="高新区" value="hightech" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="房型">
          <el-select v-model="queryParams.houseType" placeholder="选择房型" clearable>
            <el-option label="一室一厅" value="1b1l" />
            <el-option label="两室一厅" value="2b1l" />
            <el-option label="三室一厅" value="3b1l" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格区间">
          <el-input-number v-model="queryParams.minPrice" :min="0" placeholder="最低价" style="width: 120px" />
          <span class="mx-2">-</span>
          <el-input-number v-model="queryParams.maxPrice" :min="0" placeholder="最高价" style="width: 120px" />
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
        :data="housingList"
        border
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="图片" width="120">
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
        <el-table-column prop="area" label="区域" width="100">
          <template #default="scope">
            <el-tag>{{ getAreaText(scope.row.area) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="houseType" label="房型" width="100">
          <template #default="scope">
            <span>{{ getHouseTypeText(scope.row.houseType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="面积" width="100">
          <template #default="scope">
            <span>{{ scope.row.size }}㎡</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="月租" width="100">
          <template #default="scope">
            <span class="price">¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="publishDate" label="发布日期" width="120" />
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
      :title="dialogType === 'add' ? '发布房源' : '编辑房源'"
      v-model="dialogVisible"
      width="600px"
      append-to-body
    >
      <el-form :model="housingForm" :rules="rules" ref="housingFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="housingForm.title" placeholder="请输入房源标题" />
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-select v-model="housingForm.area" placeholder="请选择区域" style="width: 100%">
            <el-option label="大学城" value="university" />
            <el-option label="市中心" value="downtown" />
            <el-option label="高新区" value="hightech" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="housingForm.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="房型" prop="houseType">
          <el-select v-model="housingForm.houseType" placeholder="请选择房型" style="width: 100%">
            <el-option label="一室一厅" value="1b1l" />
            <el-option label="两室一厅" value="2b1l" />
            <el-option label="三室一厅" value="3b1l" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="面积" prop="size">
          <el-input-number v-model="housingForm.size" :min="1" :precision="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="月租" prop="price">
          <el-input-number v-model="housingForm.price" :min="1" :precision="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input v-model="housingForm.floor" placeholder="如: 3/6层" />
        </el-form-item>
        <el-form-item label="朝向" prop="orientation">
          <el-select v-model="housingForm.orientation" placeholder="请选择朝向" style="width: 100%">
            <el-option label="东" value="east" />
            <el-option label="南" value="south" />
            <el-option label="西" value="west" />
            <el-option label="北" value="north" />
            <el-option label="东南" value="southeast" />
            <el-option label="东北" value="northeast" />
            <el-option label="西南" value="southwest" />
            <el-option label="西北" value="northwest" />
          </el-select>
        </el-form-item>
        <el-form-item label="配套设施" prop="facilities">
          <el-checkbox-group v-model="housingForm.facilities">
            <el-checkbox value="wifi">WiFi</el-checkbox>
            <el-checkbox value="washer">洗衣机</el-checkbox>
            <el-checkbox value="aircon">空调</el-checkbox>
            <el-checkbox value="fridge">冰箱</el-checkbox>
            <el-checkbox value="tv">电视</el-checkbox>
            <el-checkbox value="heater">热水器</el-checkbox>
            <el-checkbox value="bed">床</el-checkbox>
            <el-checkbox value="desk">书桌</el-checkbox>
            <el-checkbox value="wardrobe">衣柜</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input v-model="housingForm.description" type="textarea" :rows="4" placeholder="请输入房源详细描述" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="housingForm.contact" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="housingForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="房源图片" prop="images">
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
import { getHousingList, createHousing, updateHousing, deleteHousing } from '@/api/housing';

// 获取token
const token = localStorage.getItem('token') || '';

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  area: '',
  houseType: '',
  minPrice: null,
  maxPrice: null
});

// 表格数据
const housingList = ref([]);
const total = ref(0);
const loading = ref(false);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const housingFormRef = ref(null);
const housingForm = reactive({
  id: null,
  title: '',
  area: 'university',
  address: '',
  houseType: '1b1l',
  size: 30,
  price: 1000,
  floor: '',
  orientation: 'south',
  facilities: [],
  description: '',
  contact: '',
  phone: '',
  images: []
});

// 图片上传相关
const imageList = ref([]);
const dialogImageUrl = ref('');
const dialogImageVisible = ref(false);

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入房源标题', trigger: 'blur' }],
  area: [{ required: true, message: '请选择区域', trigger: 'change' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  houseType: [{ required: true, message: '请选择房型', trigger: 'change' }],
  size: [{ required: true, message: '请输入面积', trigger: 'blur' }],
  price: [{ required: true, message: '请输入月租', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
};

// 区域文本
const getAreaText = (area) => {
  const map = {
    university: '大学城',
    downtown: '市中心',
    hightech: '高新区',
    other: '其他'
  };
  return map[area] || '其他';
};

// 房型文本
const getHouseTypeText = (type) => {
  const map = {
    '1b1l': '一室一厅',
    '2b1l': '两室一厅',
    '3b1l': '三室一厅',
    'other': '其他'
  };
  return map[type] || '其他';
};

// 加载数据
const getList = () => {
  loading.value = true;
  getHousingList(queryParams).then(response => {
    housingList.value = response.data.list;
    total.value = response.data.total;
    loading.value = false;
  }).catch(() => {
    ElMessage({
      type: 'error',
      message: '获取房源列表失败'
    });
  });
};

// 查询操作
const handleQuery = () => {
  queryParams.page = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryParams.area = '';
  queryParams.houseType = '';
  queryParams.minPrice = null;
  queryParams.maxPrice = null;
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
  imageList.value = [];
};

// 编辑操作
const handleEdit = (row) => {
  resetForm();
  dialogType.value = 'edit';
  dialogVisible.value = true;
  // 复制数据到表单
  Object.assign(housingForm, row);
  // 设置图片列表
  imageList.value = row.images ? row.images.map(url => {
    return {
      name: url.split('/').pop(),
      url: url
    };
  }) : [];
};

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确认要删除该房源信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteHousing(row.id).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      });
      getList();
    }).catch(() => {});
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
  housingForm.images = imageList.value.map(item => item.url);
};

// 上传成功
const handleUploadSuccess = (response) => {
  // 后端返回的是文件URL
  if (response.code === 200 && response.data) {
    housingForm.images.push(response.data.url);
  }
};

// 重置表单
const resetForm = () => {
  if (housingFormRef.value) {
    housingFormRef.value.resetFields();
  }
  housingForm.id = null;
  housingForm.title = '';
  housingForm.area = 'university';
  housingForm.address = '';
  housingForm.houseType = '1b1l';
  housingForm.size = 30;
  housingForm.price = 1000;
  housingForm.floor = '';
  housingForm.orientation = 'south';
  housingForm.facilities = [];
  housingForm.description = '';
  housingForm.contact = '';
  housingForm.phone = '';
  housingForm.images = [];
};

// 提交表单
const submitForm = () => {
  housingFormRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        createHousing(housingForm).then(() => {
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
        updateHousing(housingForm.id, housingForm).then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          });
          dialogVisible.value = false;
          getList();
        }).catch(() => {
          ElMessage({
            type: 'error',
            message: '修改失败'
          });
        });
      }
    }
  });
};

// 页面加载时获取数据
onMounted(() => {
  getList();
});
</script>

<style scoped>
.housing-container {
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

.price {
  color: #ff4500;
  font-weight: bold;
}

.mx-2 {
  margin: 0 8px;
}

.image-preview {
  cursor: pointer;
  transition: all 0.3s;
}

.image-preview:hover {
  transform: scale(1.05);
}
</style> 