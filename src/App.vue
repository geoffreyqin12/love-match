<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <div class="loading">
              <el-skeleton :rows="10" animated />
            </div>
          </template>
        </Suspense>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
