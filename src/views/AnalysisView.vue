<template>
  <div class="analysis-container">
    <el-header class="header">
      <div class="header-title">数据分析</div>
      <div class="header-buttons">
        <el-button-group>
          <el-button type="primary" plain size="small" @click="goBack">
            返回
          </el-button>
          <el-button type="danger" plain size="small" @click="handleLogout">
            退出登录
          </el-button>
        </el-button-group>
      </div>
    </el-header>

    <div class="content">
      <!-- 统计卡片 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>总测试次数</span>
              </div>
            </template>
            <div class="stat-value">{{ stats.totalTests }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>平均分数</span>
              </div>
            </template>
            <div class="stat-value">{{ stats.avgScore.toFixed(1) }}%</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>最高分数</span>
              </div>
            </template>
            <div class="stat-value">{{ stats.maxScore }}%</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>最低分数</span>
              </div>
            </template>
            <div class="stat-value">{{ stats.minScore }}%</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 历史记录表格 -->
      <el-card class="history-card">
        <template #header>
          <div class="card-header">
            <span>历史记录</span>
          </div>
        </template>
        <el-table :data="histories" style="width: 100%" v-loading="loading">
          <el-table-column prop="createdAt" label="测试时间" width="180">
            <template #default="scope">
              {{ new Date(scope.row.createdAt).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="score" label="匹配度" width="100">
            <template #default="scope">
              <el-tag :type="getScoreTagType(scope.row.score)">
                {{ scope.row.score }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="scoreText" label="评价" width="120">
            <template #default="scope">
              <el-tag :type="getScoreTagType(scope.row.score)">
                {{ scope.row.scoreText }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="基本信息" min-width="200">
            <template #default="scope">
              <div>男: {{ scope.row.male.age }}岁 {{ scope.row.male.occupation }}</div>
              <div>女: {{ scope.row.female.age }}岁 {{ scope.row.female.occupation }}</div>
            </template>
          </el-table-column>
          <el-table-column label="性格特征" min-width="200">
            <template #default="scope">
              <div>男: {{ scope.row.male.personalityText }}</div>
              <div>女: {{ scope.row.female.personalityText }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button link type="primary" @click="showDetail(scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="dialogVisible" title="测试详情" width="80%">
      <div v-if="currentRecord" class="detail-content">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="测试时间">
            {{ new Date(currentRecord.createdAt).toLocaleString() }}
          </el-descriptions-item>
          <el-descriptions-item label="匹配度">
            <el-tag :type="getScoreTagType(currentRecord.score)">
              {{ currentRecord.score }}% ({{ currentRecord.scoreText }})
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 匹配度分析 -->
        <el-divider content-position="left">匹配度分析</el-divider>
        <el-row :gutter="20" class="analysis-row">
          <el-col :span="24">
            <el-card class="analysis-section">
              <template #header>
                <div class="card-header">
                  <h4>综合分析</h4>
                </div>
              </template>
              <p>{{ currentRecord.personalityAnalysis }}</p>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card class="analysis-section">
              <template #header>
                <div class="card-header">
                  <h4>性格匹配</h4>
                </div>
              </template>
              <p>{{ currentRecord.personalityAnalysis }}</p>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card class="analysis-section">
              <template #header>
                <div class="card-header">
                  <h4>年龄匹配</h4>
                </div>
              </template>
              <p>{{ currentRecord.ageAnalysis }}</p>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card class="analysis-section">
              <template #header>
                <div class="card-header">
                  <h4>职业匹配</h4>
                </div>
              </template>
              <p>{{ currentRecord.careerAnalysis }}</p>
            </el-card>
          </el-col>
        </el-row>

        <!-- 建议部分 -->
        <el-divider content-position="left">相处建议</el-divider>
        <el-card class="suggestion-section">
          <template #header>
            <div class="card-header">
              <h4>建议</h4>
            </div>
          </template>
          <ul class="suggestion-list">
            <li v-for="(suggestion, index) in currentRecord.suggestions" 
                :key="index" class="suggestion-item">
              {{ suggestion }}
            </li>
          </ul>
        </el-card>

        <!-- 双方信息 -->
        <el-divider content-position="left">双方信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="info-section">
              <template #header>
                <div class="card-header">
                  <h4>男方信息</h4>
                </div>
              </template>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="年龄">{{ currentRecord.male.age }}岁</el-descriptions-item>
                <el-descriptions-item label="职业">{{ currentRecord.male.occupation }}</el-descriptions-item>
                <el-descriptions-item label="性格特征">
                  <el-tag v-for="trait in currentRecord.male.personality" 
                         :key="trait" class="trait-tag">
                    {{ trait }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="兴趣爱好">
                  <el-tag v-for="hobby in currentRecord.male.hobbies" 
                         :key="hobby" type="success" class="trait-tag">
                    {{ hobby }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="info-section">
              <template #header>
                <div class="card-header">
                  <h4>女方信息</h4>
                </div>
              </template>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="年龄">{{ currentRecord.female.age }}岁</el-descriptions-item>
                <el-descriptions-item label="职业">{{ currentRecord.female.occupation }}</el-descriptions-item>
                <el-descriptions-item label="性格特征">
                  <el-tag v-for="trait in currentRecord.female.personality" 
                         :key="trait" class="trait-tag">
                    {{ trait }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="兴趣爱好">
                  <el-tag v-for="hobby in currentRecord.female.hobbies" 
                         :key="hobby" type="success" class="trait-tag">
                    {{ hobby }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { request } from '../utils/request'

const router = useRouter()
const loading = ref(false)
const dialogVisible = ref(false)
const currentRecord = ref(null)
const histories = ref([])
const stats = ref({
  totalTests: 0,
  avgScore: 0,
  maxScore: 0,
  minScore: 0
})

// 获取历史记录
const fetchHistories = async () => {
  try {
    loading.value = true
    const data = await request('/history')
    histories.value = data
  } catch (error) {
    ElMessage.error('获取历史记录失败')
  } finally {
    loading.value = false
  }
}

// 获取统计数据
const fetchStats = async () => {
  try {
    const data = await request('/history/stats')
    stats.value = data
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

// 显示详情
const showDetail = (record: any) => {
  currentRecord.value = record
  dialogVisible.value = true
}

// 返回
const goBack = () => {
  router.push('/home')
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
    ElMessage.success('已退出登录')
  })
}

const getScoreTagType = (score: number) => {
  if (score >= 85) return 'success'
  if (score >= 70) return 'warning'
  if (score >= 60) return ''
  return 'danger'
}

onMounted(() => {
  fetchHistories()
  fetchStats()
})
</script>

<style scoped>
.analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  font-size: 24px;
  color: #409EFF;
  font-weight: bold;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-value {
  font-size: 24px;
  color: #409EFF;
  text-align: center;
  font-weight: bold;
}

.history-card {
  margin-top: 20px;
}

.trait-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.detail-content {
  padding: 20px;
}

.analysis-section {
  margin-bottom: 20px;
}

.analysis-row {
  margin: 20px 0;
}

.card-header h4 {
  margin: 0;
  color: #409EFF;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.trait-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.detail-content {
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .stat-card {
    margin-bottom: 10px;
  }
  
  .stat-value {
    font-size: 20px;
  }

  .analysis-row {
    :deep(.el-col) {
      margin-bottom: 15px;
    }
  }
}
</style> 