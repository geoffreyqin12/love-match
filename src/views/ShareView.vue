<template>
  <div class="share-container">
    <div v-if="loading" class="loading">
      <el-skeleton :rows="10" animated />
    </div>
    <div v-else-if="error" class="error">
      <el-empty description="分享内容不存在或已过期">
        <template #extra>
          <el-button type="primary" @click="goToHome">开始测试</el-button>
        </template>
      </el-empty>
    </div>
    <div v-else class="content">
      <el-card class="score-card">
        <template #header>
          <div class="score-header">
            <h3>匹配度评分</h3>
          </div>
        </template>
        <div class="score-content">
          <div class="score-number">{{ shareData?.score }}%</div>
          <div class="score-text">{{ shareData?.scoreText }}</div>
          <el-progress 
            type="circle" 
            :percentage="shareData?.score || 0" 
            :color="scoreColors"
            :width="150"
          />
        </div>
      </el-card>

      <!-- 添加详细分析卡片 -->
      <el-card class="analysis-card">
        <template #header>
          <div class="card-header">
            <h3>详细分析</h3>
          </div>
        </template>
        <div class="analysis-content">
          <div class="analysis-item">
            <h4>基本信息</h4>
            <p>男方：{{ shareData?.male?.age }}岁 {{ shareData?.male?.occupation }}</p>
            <p>女方：{{ shareData?.female?.age }}岁 {{ shareData?.female?.occupation }}</p>
          </div>
          
          <div class="analysis-item">
            <h4>性格特征</h4>
            <div class="tags-container">
              <el-tag 
                v-for="trait in shareData?.male?.personality" 
                :key="'m-'+trait"
                class="trait-tag"
              >
                男-{{ trait }}
              </el-tag>
              <el-tag 
                v-for="trait in shareData?.female?.personality" 
                :key="'f-'+trait"
                type="success"
                class="trait-tag"
              >
                女-{{ trait }}
              </el-tag>
            </div>
          </div>

          <div class="analysis-item">
            <h4>共同兴趣</h4>
            <div class="tags-container">
              <el-tag 
                v-for="hobby in getCommonHobbies()" 
                :key="hobby"
                type="warning"
                class="hobby-tag"
              >
                {{ hobby }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 添加开始测试按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="goToHome">开始我的测试</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(false)
const shareData = ref(null)

onMounted(async () => {
  try {
    const shareId = route.params.shareId
    console.log('Fetching share data for ID:', shareId)

    const response = await fetch(`http://localhost:3001/api/share/${shareId}`)
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Share error:', errorData)
      throw new Error(errorData.message || 'Share not found')
    }

    const data = await response.json()
    console.log('Received share data:', data)
    shareData.value = data
  } catch (error) {
    console.error('Error loading share:', error)
    error.value = true
  } finally {
    loading.value = false
  }
})

const goToHome = () => {
  router.push('/')
}

const scoreColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#409eff', percentage: 100 }
]

// 添加获取共同兴趣的方法
const getCommonHobbies = () => {
  if (!shareData.value?.male?.hobbies || !shareData.value?.female?.hobbies) {
    return []
  }
  const maleHobbies = new Set(shareData.value.male.hobbies)
  return shareData.value.female.hobbies.filter(h => maleHobbies.has(h))
}
</script>

<style scoped>
.share-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-card, .analysis-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.score-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.score-number {
  font-size: 48px;
  color: #409EFF;
  font-weight: bold;
  margin-bottom: 10px;
}

.score-text {
  font-size: 24px;
  color: #409EFF;
  margin-bottom: 20px;
}

.analysis-item {
  margin-bottom: 20px;
}

.analysis-item h4 {
  color: #409EFF;
  margin-bottom: 10px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trait-tag, .hobby-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .share-container {
    padding: 10px;
  }

  .score-number {
    font-size: 36px;
  }

  .score-text {
    font-size: 20px;
  }
}
</style> 