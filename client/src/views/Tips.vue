<template>
  <div class="tips-container">
    <div class="page-header">
      <h2>省钱技巧管理</h2>
      <el-button type="primary" @click="handleAdd">发布技巧</el-button>
    </div>

    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="分类">
          <el-select v-model="queryParams.category" placeholder="选择分类" clearable>
            <el-option label="购物优惠" value="shopping" />
            <el-option label="生活妙招" value="life" />
            <el-option label="学生优惠" value="student" />
            <el-option label="旅行省钱" value="travel" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="queryParams.title" placeholder="搜索标题" clearable />
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
        :data="tipsList"
        border
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryTag(scope.row.category)">
              {{ getCategoryText(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="100" />
        <el-table-column prop="publishDate" label="发布日期" width="120" />
        <el-table-column prop="views" label="浏览量" width="100" sortable />
        <el-table-column prop="likes" label="点赞数" width="100" sortable />
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
      :title="dialogType === 'add' ? '发布省钱技巧' : '编辑省钱技巧'"
      v-model="dialogVisible"
      width="800px"
      append-to-body
    >
      <el-form :model="tipsForm" :rules="rules" ref="tipsFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="tipsForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="tipsForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="购物优惠" value="shopping" />
            <el-option label="生活妙招" value="life" />
            <el-option label="学生优惠" value="student" />
            <el-option label="旅行省钱" value="travel" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="tipsForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="tipsForm.summary" type="textarea" rows="2" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="tipsForm.content" type="textarea" rows="10" placeholder="请输入详细内容" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-tag
            v-for="tag in tipsForm.tags"
            :key="tag"
            closable
            @close="handleTagClose(tag)"
            style="margin-right: 5px; margin-bottom: 5px;"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="tagInputVisible"
            ref="tagInputRef"
            v-model="tagInputValue"
            class="w-100"
            size="small"
            @keyup.enter="handleTagConfirm"
            @blur="handleTagConfirm"
          />
          <el-button v-else size="small" @click="showTagInput">+ 添加标签</el-button>
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage">
          <el-upload
            action="/api/upload/image"
            name="image"
            :headers="{ Authorization: `Bearer ${localStorage.getItem('token')}` }"
            list-type="picture-card"
            :limit="1"
            :file-list="coverImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleCoverRemove"
            :on-success="handleCoverSuccess"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogImageVisible" title="预览图片">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="相关图片" prop="images">
          <el-upload
            action="/api/upload/image"
            name="image"
            :headers="{ Authorization: `Bearer ${localStorage.getItem('token')}` }"
            list-type="picture-card"
            :file-list="imageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-switch v-model="tipsForm.isTop" />
        </el-form-item>
        <el-form-item label="是否推荐" prop="isRecommend">
          <el-switch v-model="tipsForm.isRecommend" />
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
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  category: '',
  title: ''
});

// 表格数据
const tipsList = ref([]);
const total = ref(0);
const loading = ref(false);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const tipsFormRef = ref(null);
const tipsForm = reactive({
  id: null,
  title: '',
  category: 'shopping',
  author: '',
  summary: '',
  content: '',
  tags: [],
  coverImage: '',
  images: [],
  isTop: false,
  isRecommend: false,
  views: 0,
  likes: 0,
  publishDate: ''
});

// 图片上传相关
const coverImageList = ref([]);
const imageList = ref([]);
const dialogImageUrl = ref('');
const dialogImageVisible = ref(false);

// 标签输入相关
const tagInputVisible = ref(false);
const tagInputValue = ref('');
const tagInputRef = ref(null);

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入详细内容', trigger: 'blur' }],
  coverImage: [{ required: true, message: '请上传封面图片', trigger: 'change' }]
};

// 分类标签和文本
const getCategoryTag = (category) => {
  const map = {
    shopping: 'success',
    life: 'info',
    student: 'warning',
    travel: 'danger',
    other: ''
  };
  return map[category] || '';
};

const getCategoryText = (category) => {
  const map = {
    shopping: '购物优惠',
    life: '生活妙招',
    student: '学生优惠',
    travel: '旅行省钱',
    other: '其他'
  };
  return map[category] || '其他';
};

// 加载数据
const getList = () => {
  loading.value = true;
  // 这里应该调用API获取数据
  // 模拟数据
  setTimeout(() => {
    tipsList.value = [
      {
        id: 1,
        title: '大学生如何省钱吃饭：10个实用技巧',
        category: 'student',
        author: '张三',
        summary: '针对大学生群体的省钱吃饭技巧，让你每月食堂开销减半！',
        content: '详细内容...',
        tags: ['大学生', '省钱', '饮食'],
        coverImage: 'https://example.com/cover1.jpg',
        images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
        isTop: true,
        isRecommend: true,
        views: 1200,
        likes: 350,
        publishDate: '2023-05-01'
      },
      {
        id: 2,
        title: '网购省钱秘籍：如何找到隐藏优惠券',
        category: 'shopping',
        author: '李四',
        summary: '教你如何在各大电商平台找到隐藏的优惠券，让你的网购更加划算。',
        content: '详细内容...',
        tags: ['网购', '优惠券', '电商'],
        coverImage: 'https://example.com/cover2.jpg',
        images: ['https://example.com/img3.jpg'],
        isTop: false,
        isRecommend: true,
        views: 980,
        likes: 230,
        publishDate: '2023-05-02'
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
  queryParams.category = '';
  queryParams.title = '';
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
  coverImageList.value = [];
  imageList.value = [];
};

// 编辑操作
const handleEdit = (row) => {
  resetForm();
  dialogType.value = 'edit';
  dialogVisible.value = true;
  // 复制数据到表单
  Object.assign(tipsForm, row);
  
  // 设置封面图片列表
  if (row.coverImage) {
    coverImageList.value = [{
      name: row.coverImage.split('/').pop(),
      url: row.coverImage
    }];
  }
  
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
  ElMessageBox.confirm('确认要删除该省钱技巧吗？', '提示', {
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

// 图片预览
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogImageVisible.value = true;
};

// 移除封面图片
const handleCoverRemove = () => {
  coverImageList.value = [];
  tipsForm.coverImage = '';
};

// 上传封面成功
const handleCoverSuccess = (response, file) => {
  // 假设后端返回的是文件URL
  if (response.code === 0 && response.data) {
    tipsForm.coverImage = response.data.url;
  }
};

// 移除图片
const handleRemove = (file) => {
  const index = imageList.value.indexOf(file);
  if (index !== -1) {
    imageList.value.splice(index, 1);
  }
  // 同步到表单
  tipsForm.images = imageList.value.map(item => item.url);
};

// 上传成功
const handleUploadSuccess = (response, file) => {
  // 假设后端返回的是文件URL
  if (response.code === 0 && response.data) {
    tipsForm.images.push(response.data.url);
  }
};

// 标签相关
const showTagInput = () => {
  tagInputVisible.value = true;
  nextTick(() => {
    tagInputRef.value.focus();
  });
};

const handleTagClose = (tag) => {
  tipsForm.tags.splice(tipsForm.tags.indexOf(tag), 1);
};

const handleTagConfirm = () => {
  if (tagInputValue.value) {
    if (!tipsForm.tags.includes(tagInputValue.value)) {
      tipsForm.tags.push(tagInputValue.value);
    }
  }
  tagInputVisible.value = false;
  tagInputValue.value = '';
};

// 重置表单
const resetForm = () => {
  if (tipsFormRef.value) {
    tipsFormRef.value.resetFields();
  }
  tipsForm.id = null;
  tipsForm.title = '';
  tipsForm.category = 'shopping';
  tipsForm.author = '';
  tipsForm.summary = '';
  tipsForm.content = '';
  tipsForm.tags = [];
  tipsForm.coverImage = '';
  tipsForm.images = [];
  tipsForm.isTop = false;
  tipsForm.isRecommend = false;
  tipsForm.views = 0;
  tipsForm.likes = 0;
  tipsForm.publishDate = '';
};

// 提交表单
const submitForm = () => {
  tipsFormRef.value.validate((valid) => {
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
.tips-container {
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

.w-100 {
  width: 100px;
  margin-right: 10px;
  vertical-align: bottom;
}
</style> 