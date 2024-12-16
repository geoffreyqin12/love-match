<template>
  <div class="result-container">
    <el-header class="header">
      <div class="header-title">预测结果</div>
      <div class="header-buttons">
        <el-button-group>
          <el-button type="primary" plain size="small" @click="goBack">
            返回重测
          </el-button>
          <el-button type="danger" plain size="small" @click="handleLogout">
            退出登录
          </el-button>
        </el-button-group>
      </div>
    </el-header>

    <div class="content">
      <el-card class="score-card">
        <template #header>
          <div class="score-header">
            <h3>匹配度评分</h3>
          </div>
        </template>
        <div class="score-content">
          <div class="score-number">{{ score }}%</div>
          <div class="score-text">{{ scoreText }}</div>
          <el-progress 
            type="circle" 
            :percentage="score" 
            :color="scoreColors"
            :width="150"
          />
        </div>
      </el-card>

      <el-card class="analysis-card">
        <template #header>
          <div class="card-header">
            <h3>详细分析</h3>
          </div>
        </template>
        <div class="analysis-content">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template #title>
                <span class="collapse-title">综合分析</span>
              </template>
              <div class="analysis-item">
                <p>{{ personalityAnalysis }}</p>
              </div>
            </el-collapse-item>
            
            <el-collapse-item name="2">
              <template #title>
                <span class="collapse-title">性格匹配度分析</span>
              </template>
              <div class="analysis-item">
                <p>{{ personalityAnalysis }}</p>
              </div>
            </el-collapse-item>

            <el-collapse-item name="3">
              <template #title>
                <span class="collapse-title">年龄匹配度分析</span>
              </template>
              <div class="analysis-item">
                <p>{{ ageAnalysis }}</p>
              </div>
            </el-collapse-item>

            <el-collapse-item name="4">
              <template #title>
                <span class="collapse-title">职业匹配度分析</span>
              </template>
              <div class="analysis-item">
                <p>{{ careerAnalysis }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>

      <el-card class="suggestion-card">
        <template #header>
          <div class="card-header">
            <h3>建议</h3>
          </div>
        </template>
        <div class="suggestion-content">
          <p v-for="(item, index) in suggestions" :key="index" class="suggestion-item">
            {{ item }}
          </p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { request } from '../utils/request'

const router = useRouter()

// 使用ref定义所有需要动态改变的文本
const score = ref(85)
const scoreText = ref('非常适合')
const personalityAnalysis = ref('双方性格特征互补，一方外向开朗，一方稳重理性，能够在生活中相互平衡，共同成长。')
const ageAnalysis = ref('年龄差异在合理范围内，具有相似的人生阶段和价值观念，有利于共同规划未来。')
const careerAnalysis = ref('双方职业发展方向互补，能够在事业上互相支持和理解，有助于建立稳定的家庭关系。')

// 折叠面板状态
const activeNames = ref(['1'])

const scoreColors = [
  { color: '#f56c6c', percentage: 60 },
  { color: '#e6a23c', percentage: 70 },
  { color: '#409eff', percentage: 85 },
  { color: '#67c23a', percentage: 100 }
]

const suggestions = [
  '建议在感情生活中多关注对方的情绪需求，增进双方的情。',
  '可以多创造共同的兴趣爱好，增加共处时光的质量。',
  '在遇到分歧时，建议采用更开放和包容的态度，相互理解和支持。',
  '建议制定共同的未来规划，包括事业发展和家庭生活等方面。'
]

const goBack = () => {
  router.push('/home')
}

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

const formData = ref(null)

// 计算分数
const calculateScore = async (data: any) => {
  if (!data || !data.male || !data.female) {
    console.error('Invalid data:', data)
    return
  }

  let totalScore = 0
  
  // 年龄差异评分（15分）
  const ageDiff = Math.abs(data.male.age - data.female.age)
  if (ageDiff <= 5) totalScore += 15
  else if (ageDiff <= 10) totalScore += 10
  else if (ageDiff <= 15) totalScore += 5
  else totalScore += 0
  
  // 性格互补评分（20分）
  const personalities = {
    male: new Set(data.male.personality),
    female: new Set(data.female.personality)
  }
  if (personalities.male.has('outgoing') && personalities.female.has('steady')) totalScore += 5
  if (personalities.male.has('rational') && personalities.female.has('emotional')) totalScore += 5
  if (personalities.male.has('adventurous') && personalities.female.has('steady')) totalScore += 5
  // 相同性格特征加分
  const commonPersonalities = [...personalities.male].filter(x => personalities.female.has(x))
  totalScore += commonPersonalities.length * 2
  
  // 兴趣爱好匹配度（20分）
  const hobbies = {
    male: new Set(data.male.hobbies),
    female: new Set(data.female.hobbies)
  }
  const commonHobbies = [...hobbies.male].filter(x => hobbies.female.has(x))
  totalScore += commonHobbies.length * 4
  
  // 生活习惯匹配度（20分）
  const lifestyles = {
    male: new Set(data.male.lifestyle),
    female: new Set(data.female.lifestyle)
  }
  const commonLifestyles = [...lifestyles.male].filter(x => lifestyles.female.has(x))
  totalScore += commonLifestyles.length * 4
  
  // 价值观匹配度（15分）
  const valueDiff = Math.abs(data.male.values.family - data.female.values.family) +
                   Math.abs(data.male.values.career - data.female.values.career)
  if (valueDiff <= 2) totalScore += 15
  else if (valueDiff <= 4) totalScore += 10
  else if (valueDiff <= 6) totalScore += 5
  
  // 未来规划匹配度（10分）
  const plans = {
    male: new Set(data.male.plans),
    female: new Set(data.female.plans)
  }
  const commonPlans = [...plans.male].filter(x => plans.female.has(x))
  totalScore += commonPlans.length * 3
  
  // 更新分数和评价
  score.value = totalScore
  if (totalScore >= 85) {
    scoreText.value = '非常适合'
    personalityAnalysis.value = '双方在性格、兴趣和价值观等多个方面都非常契合，有很大的发展潜力。'
  } else if (totalScore >= 70) {
    scoreText.value = '比较适合'
    personalityAnalysis.value = '双方在主要方面比较匹配，通过沟通和理解可以建立良好的关系。'
  } else if (totalScore >= 60) {
    scoreText.value = '一般适合'
    personalityAnalysis.value = '双方存在一些差异，需要更多的包容和调适。'
  } else {
    scoreText.value = '需要多沟通'
    personalityAnalysis.value = '双方在多个方面存在较大差异，建议进一步了解对方。'
  }

  // 保存历史记录
  try {
    await request('/history', {
      method: 'POST',
      body: JSON.stringify({
        score: score.value,
        scoreText: scoreText.value,
        male: data.male,
        female: data.female
      })
    })
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

onMounted(async () => {
  // 从localStorage获取表单数据
  const savedData = localStorage.getItem('formData')
  if (savedData) {
    try {
      formData.value = JSON.parse(savedData)
      await calculateScore(formData.value)
    } catch (error) {
      console.error('Error:', error)
      ElMessage.error('计算分数时出错')
    }
  }
})
</script>

<style scoped>
.result-container {
  padding: clamp(10px, 3vw, 20px);
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(10px, 3vw, 20px);
  flex-wrap: wrap;
  gap: 10px;
}

.header-title {
  font-size: clamp(20px, 4vw, 24px);
  color: #409EFF;
  font-weight: bold;
}

.content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 3vw, 20px);
}

.score-card, .analysis-card, .suggestion-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.score-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(10px, 3vw, 20px);
}

.score-number {
  font-size: clamp(36px, 8vw, 48px);
  color: #409EFF;
  font-weight: bold;
  margin-bottom: 10px;
}

.score-text {
  font-size: clamp(20px, 4vw, 24px);
  color: #409EFF;
  margin-bottom: 20px;
}

.analysis-item {
  padding: clamp(10px, 2vw, 15px);
  line-height: 1.6;
}

.suggestion-content {
  padding: clamp(10px, 2vw, 15px);
}

.suggestion-item {
  margin-bottom: 10px;
  line-height: 1.6;
  position: relative;
  padding-left: 20px;
  font-size: clamp(14px, 3vw, 16px);
}

h3 {
  margin: 0;
  color: #409EFF;
  font-size: clamp(18px, 3vw, 20px);
}

@media screen and (max-width: 768px) {
  .header-buttons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  
  :deep(.el-progress-circle) {
    width: clamp(120px, 30vw, 150px) !important;
    height: clamp(120px, 30vw, 150px) !important;
  }
  
  .analysis-content {
    :deep(.el-collapse-item__header) {
      font-size: clamp(14px, 3vw, 16px);
    }
  }
}

.collapse-title {
  color: #409EFF;
  font-weight: 500;
}
</style> 