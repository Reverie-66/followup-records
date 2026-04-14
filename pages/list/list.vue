<template>
  <view class="list-page">
    <!-- 顶部 Tab 切换 -->
    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 0 }"
        @click="switchTab(0)"
      >
        项目详情
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 1 }"
        @click="switchTab(1)"
      >
        跟进记录
        <text v-if="totalCount > 0" class="count-badge">{{ totalCount }}</text>
      </view>
    </view>

    <!-- 项目详情占位（纯文字） -->
    <view v-if="activeTab === 0" class="project-detail-placeholder">
      <text class="empty-text">📋 项目详情内容待补充</text>
    </view>

    <!-- 跟进记录列表区域 -->
    <scroll-view
      v-else
      class="record-scroll"
      scroll-y
      @scrolltolower="onLoadMore"
      :lower-threshold="50"
    >
      <view v-if="records.length === 0 && !loading" class="empty-state">
        <text class="empty-text">📝 暂无跟进记录</text><br>
        <text class="empty-tip">点击右下角“+”添加</text>
      </view>

      <view
        v-for="item in records"
        :key="item.id"
        class="record-card"
        @click="goToEdit(item.id)"
      >
        <view class="card-header">
          <text class="subject">{{ item.subject }}</text>
          <text class="date">{{ formatDate(item.createdAt) }}</text>
        </view>
        <text class="detail">{{ item.detail }}</text>
        <view v-if="item.nextTime" class="next-block">
          <text class="next-label">下次沟通：</text>
          <text class="next-time">{{ formatDateTime(item.nextTime) }}</text>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-tip">
        <text>加载中...</text>
      </view>
      <view v-else-if="!hasMore && records.length > 0" class="loading-tip">
        <text>—— 没有更多了 ——</text>
      </view>
    </scroll-view>

    <!-- 右下角悬浮加号按钮（伪元素画加号） -->
    <view class="add-btn" @click="goToAdd"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { getRecordPage } from '@/services/recordStorage.js';

const activeTab = ref(1);
const records = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const hasMore = ref(true);
const loading = ref(false);
const totalCount = ref(0);

const loadData = async (isRefresh = false) => {
  if (isRefresh) {
    currentPage.value = 1;
    hasMore.value = true;
  }
  if (!hasMore.value && !isRefresh) return;
  
  loading.value = true;
  try {
    const res = getRecordPage(pageSize, currentPage.value);
    if (isRefresh) {
      records.value = res.data;
    } else {
      records.value = [...records.value, ...res.data];
    }
    hasMore.value = res.hasMore;
    if (res.hasMore) currentPage.value++;
    totalCount.value = res.total;
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    loading.value = false;
    if (isRefresh) {
      uni.stopPullDownRefresh();
    }
  }
};

const onRefresh = () => {
  loadData(true);
};

const onLoadMore = () => {
  if (!loading.value && hasMore.value) {
    loadData(false);
  }
};

const switchTab = (index) => {
  activeTab.value = index;
};

onShow(() => {
  if (activeTab.value === 1) {
    loadData(true);
  }
});

onPullDownRefresh(() => {
  if (activeTab.value === 1) {
    onRefresh();
  } else {
    uni.stopPullDownRefresh();
  }
});

const goToAdd = () => {
  uni.navigateTo({ url: '/pages/form/form' });
};

const goToEdit = (id) => {
  uni.navigateTo({ url: `/pages/form/form?id=${id}` });
};

const formatDate = (timestamp) => {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}-${d.getDate()}`;
};

const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
</script>

<style lang="scss" scoped>
/* 莫兰迪风格列表页 */
.list-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;              
  background-color: $bg-color;
  margin: 0;               
  padding: 0;                
}

.tabs {
  display: flex;
  width: 100%;             
  background-color: $bg-white;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: $spacing-md 0;
  font-size: 32rpx;
  color: $text-secondary;
  position: relative;
  transition: all 0.2s;
  font-weight: 400;

  &.active {
    color: $primary-color;
    font-weight: 500;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 48rpx;
      height: 4rpx;
      background-color: $primary-color;
      border-radius: 2rpx;
      opacity: 0.8;
    }
  }
}

.count-badge {
  display: inline-block;
  margin-left: 8rpx;
  padding: 4rpx 12rpx;
  background-color: #E8E4EE;
  color: $primary-dark;
  font-size: 24rpx;
  font-weight: 500;
  border-radius: 20rpx;
  line-height: 1.2;
  transform: translateY(-2rpx);
  vertical-align: middle;
}

.tab-item.active .count-badge {
  background-color: $primary-light;
  color: #fff;
}

.project-detail-placeholder {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-lg;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 100rpx;
}

.empty-text {
  font-size: 32rpx;
  color: $text-light;
  margin-bottom: $spacing-sm;
}

.empty-tip {
  font-size: 26rpx;
  color: $text-light;
  opacity: 0.8;
}

.record-scroll {
  flex: 1;
  width: 100%;            
  padding: $spacing-sm $spacing-sm 0;
  box-sizing: border-box;     
}

.record-card {
  background-color: $bg-white;
  border-radius: $border-radius-md;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  box-shadow: $box-shadow-card;
  transition: all 0.15s;
  border: 1px solid rgba(230, 226, 236, 0.5);

  &:active {
    transform: scale(0.985);
    background-color: #FCFBFD;
    box-shadow: 0 4rpx 12rpx rgba(122, 111, 155, 0.04);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: $spacing-sm;
}

.subject {
  font-size: 34rpx;
  font-weight: 600;
  color: $text-main;
  flex: 1;
  margin-right: $spacing-sm;
  line-height: 1.4;
}

.date {
  font-size: 24rpx;
  color: $text-light;
  flex-shrink: 0;
  letter-spacing: 0.5rpx;
}

.detail {
  font-size: 28rpx;
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: $spacing-sm;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.next-block {
  background-color: #F4F2F7;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  display: inline-block;
}

.next-label {
  font-size: 24rpx;
  color: $primary-dark;
  font-weight: 500;
}

.next-time {
  font-size: 24rpx;
  color: $primary-dark;
}

.loading-tip {
  text-align: center;
  padding: $spacing-md;
  color: $text-light;
  font-size: 26rpx;
}

.add-btn {
  position: fixed;
  bottom: 60rpx;
  right: 40rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 56rpx;
  background-color: $primary-color;
  box-shadow: $box-shadow-btn;
  z-index: 99;
  transition: all 0.2s;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #fff;
    border-radius: 4rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &::before {
    width: 36rpx;
    height: 6rpx;
  }

  &::after {
    width: 6rpx;
    height: 36rpx;
  }

  &:active {
    transform: scale(0.92);
    background-color: $primary-dark;
  }
}
</style>