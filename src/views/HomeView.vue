<template>
  <div class="home-container">
    <el-header class="header">
      <div class="header-title">AI恋爱契合度预测</div>
      <el-button type="danger" plain size="small" @click="handleLogout">
        退出登录
      </el-button>
    </el-header>

    <el-card class="form-card">
      <el-form 
        :model="formData" 
        :rules="rules" 
        ref="formRef" 
        :label-width="labelWidth"
      >
        <h3>男方信息</h3>
        <el-row :gutter="gutterWidth">
          <el-col :xs="24" :sm="12">
            <el-form-item label="年龄" prop="male.age">
              <el-input-number 
                v-model="formData.male.age" 
                :min="18" 
                :max="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="职业" prop="male.occupation">
              <el-input v-model="formData.male.occupation" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="性格特征" prop="male.personality">
          <el-select
            v-model="formData.male.personality"
            multiple
            placeholder="请选择性格特征"
          >
            <el-option label="开朗" value="outgoing" />
            <el-option label="内向" value="introverted" />
            <el-option label="理性" value="rational" />
            <el-option label="感性" value="emotional" />
            <el-option label="冒险" value="adventurous" />
            <el-option label="稳重" value="steady" />
          </el-select>
        </el-form-item>

        <el-form-item label="兴趣爱好" prop="male.hobbies">
          <el-select
            v-model="formData.male.hobbies"
            multiple
            placeholder="请选择兴趣爱好"
          >
            <el-option label="运动健身" value="sports" />
            <el-option label="阅读" value="reading" />
            <el-option label="旅行" value="travel" />
            <el-option label="音乐" value="music" />
            <el-option label="电影" value="movie" />
            <el-option label="美食" value="food" />
            <el-option label="摄影" value="photography" />
            <el-option label="游戏" value="gaming" />
          </el-select>
        </el-form-item>

        <el-form-item label="生活习惯" prop="male.lifestyle">
          <el-select
            v-model="formData.male.lifestyle"
            multiple
            placeholder="请选择生活习惯"
          >
            <el-option label="早起" value="early_bird" />
            <el-option label="夜猫子" value="night_owl" />
            <el-option label="规律作息" value="regular" />
            <el-option label="喜欢整洁" value="neat" />
            <el-option label="随性生活" value="casual" />
          </el-select>
        </el-form-item>

        <el-form-item label="价值观" prop="male.values">
          <el-rate
            v-model="formData.male.values.family"
            :max="5"
            show-text
            :texts="['不重要', '较不重要', '一般', '重要', '非常重要']"
          >
            <template #text>家庭观念</template>
          </el-rate>
          <el-rate
            v-model="formData.male.values.career"
            :max="5"
            show-text
            :texts="['不重要', '较不重要', '一般', '重要', '非常重要']"
          >
            <template #text>事业追求</template>
          </el-rate>
        </el-form-item>

        <el-form-item label="未来规划" prop="male.plans">
          <el-checkbox-group v-model="formData.male.plans">
            <el-checkbox value="marriage">婚姻计划</el-checkbox>
            <el-checkbox value="children">生育计划</el-checkbox>
            <el-checkbox value="house">购房计划</el-checkbox>
            <el-checkbox value="career">职业发展</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <h3>女方信息</h3>
        <el-row :gutter="gutterWidth">
          <el-col :xs="24" :sm="12">
            <el-form-item label="年龄" prop="female.age">
              <el-input-number 
                v-model="formData.female.age" 
                :min="18" 
                :max="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="职业" prop="female.occupation">
              <el-input v-model="formData.female.occupation" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="性格特征" prop="female.personality">
          <el-select
            v-model="formData.female.personality"
            multiple
            placeholder="请选择性格特征"
          >
            <el-option label="开朗" value="outgoing" />
            <el-option label="内向" value="introverted" />
            <el-option label="理性" value="rational" />
            <el-option label="感性" value="emotional" />
            <el-option label="冒险" value="adventurous" />
            <el-option label="稳重" value="steady" />
          </el-select>
        </el-form-item>

        <el-form-item label="兴趣爱好" prop="female.hobbies">
          <el-select
            v-model="formData.female.hobbies"
            multiple
            placeholder="请选择兴趣爱好"
          >
            <el-option label="运动健身" value="sports" />
            <el-option label="阅读" value="reading" />
            <el-option label="旅行" value="travel" />
            <el-option label="音乐" value="music" />
            <el-option label="电影" value="movie" />
            <el-option label="美食" value="food" />
            <el-option label="摄影" value="photography" />
            <el-option label="游戏" value="gaming" />
          </el-select>
        </el-form-item>

        <el-form-item label="生活习惯" prop="female.lifestyle">
          <el-select
            v-model="formData.female.lifestyle"
            multiple
            placeholder="请选择生活习惯"
          >
            <el-option label="早起" value="early_bird" />
            <el-option label="夜猫子" value="night_owl" />
            <el-option label="规律作息" value="regular" />
            <el-option label="喜欢整洁" value="neat" />
            <el-option label="随性生活" value="casual" />
          </el-select>
        </el-form-item>

        <el-form-item label="价值观" prop="female.values">
          <el-rate
            v-model="formData.female.values.family"
            :max="5"
            show-text
            :texts="['不重要', '较不重要', '一般', '重要', '非常重要']"
          >
            <template #text>家庭观念</template>
          </el-rate>
          <el-rate
            v-model="formData.female.values.career"
            :max="5"
            show-text
            :texts="['不重要', '较不重要', '一般', '重要', '非常重要']"
          >
            <template #text>事业追求</template>
          </el-rate>
        </el-form-item>

        <el-form-item label="未来规划" prop="female.plans">
          <el-checkbox-group v-model="formData.female.plans">
            <el-checkbox value="marriage">婚姻计划</el-checkbox>
            <el-checkbox value="children">生育计划</el-checkbox>
            <el-checkbox value="house">购房计划</el-checkbox>
            <el-checkbox value="career">职业发展</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSubmit" 
            :loading="loading"
          >
            开始预测
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-button type="primary" @click="router.push('/analysis')">
      查看数据分析
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useWindowSize } from '@vueuse/core'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  male: {
    age: 25,
    occupation: '',
    personality: [],
    hobbies: [],
    lifestyle: [],
    values: {
      family: 3,
      career: 3
    },
    plans: []
  },
  female: {
    age: 25,
    occupation: '',
    personality: [],
    hobbies: [],
    lifestyle: [],
    values: {
      family: 3,
      career: 3
    },
    plans: []
  }
})

const rules = {
  'male.age': [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  'male.occupation': [
    { required: true, message: '请输入职业', trigger: 'blur' }
  ],
  'male.personality': [
    { required: true, message: '请选择性格特征', trigger: 'change' },
    { type: 'array', min: 1, message: '至少选择一个性格特征', trigger: 'change' }
  ],
  'male.hobbies': [
    { type: 'array', min: 1, message: '请至少选择一个兴趣爱���', trigger: 'change' }
  ],
  'male.lifestyle': [
    { type: 'array', min: 1, message: '请至少选择一个生活习惯', trigger: 'change' }
  ],
  'male.plans': [
    { type: 'array', min: 1, message: '请至少选择一个未来规划', trigger: 'change' }
  ],
  'female.age': [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  'female.occupation': [
    { required: true, message: '请输入职业', trigger: 'blur' }
  ],
  'female.personality': [
    { required: true, message: '请选择性格特征', trigger: 'change' },
    { type: 'array', min: 1, message: '至少选择一个性格特征', trigger: 'change' }
  ],
  'female.hobbies': [
    { type: 'array', min: 1, message: '请至少选择一个兴趣爱好', trigger: 'change' }
  ],
  'female.lifestyle': [
    { type: 'array', min: 1, message: '请至少选择一个生活习惯', trigger: 'change' }
  ],
  'female.plans': [
    { type: 'array', min: 1, message: '请至少选择一个未来规划', trigger: 'change' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 保存表单数据到localStorage
      localStorage.setItem('formData', JSON.stringify(formData))
      
      // 模拟预测请求
      setTimeout(() => {
        loading.value = false
        router.push('/result')
      }, 1500)
    }
  })
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
    // 清除本地存储的认证信息
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    
    router.push('/login')
    ElMessage.success('已退出登录')
  })
}

const { width } = useWindowSize()

const labelWidth = computed(() => {
  return width.value < 768 ? '70px' : '100px'
})

const gutterWidth = computed(() => {
  return width.value < 768 ? 10 : 20
})
</script>

<style scoped>
.home-container {
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

.form-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #409EFF;
  font-size: clamp(18px, 3vw, 20px);
}

@media screen and (max-width: 768px) {
  .el-form-item {
    margin-bottom: 15px;
  }
  
  :deep(.el-select) {
    width: 100%;
  }
  
  :deep(.el-input-number) {
    width: 100%;
  }
}

:deep(.el-rate) {
  margin-bottom: 15px;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

@media screen and (max-width: 768px) {
  :deep(.el-rate) {
    flex-direction: column;
    align-items: flex-start;
  }
  
  :deep(.el-checkbox-group) {
    flex-direction: column;
  }
}
</style> 