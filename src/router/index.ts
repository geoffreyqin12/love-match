import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ResultView from '../views/ResultView.vue'
import ShareView from '../views/ShareView.vue'
import RegisterView from '../views/RegisterView.vue'
import AnalysisView from '../views/AnalysisView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/home',
      component: HomeView
    },
    {
      path: '/result',
      component: ResultView
    },
    {
      path: '/share/:shareId',
      component: ShareView
    },
    {
      path: '/register',
      component: RegisterView
    },
    {
      path: '/analysis',
      component: AnalysisView
    }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const token = localStorage.getItem('token')

  if (authRequired && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router 