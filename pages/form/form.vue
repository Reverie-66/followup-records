<template>
  <view class="form-page">
    <view class="form-card">
      <!-- 沟通主题 -->
      <view class="form-group">
        <view class="form-label">
          <text>沟通主题</text>
          <text class="required">*</text>
        </view>
        <input
          class="form-input"
          v-model="form.subject"
          placeholder="请输入沟通主题"
          placeholder-class="placeholder"
          maxlength="50"
        />
      </view>

      <!-- 沟通详情 -->
      <view class="form-group">
        <view class="form-label">
          <text>沟通详情</text>
          <text class="required">*</text>
        </view>
        <textarea
          class="form-textarea"
          v-model="form.detail"
          placeholder="请输入沟通详情"
          placeholder-class="placeholder"
          maxlength="500"
          :auto-height="true"
        />
      </view>

      <!-- 下次沟通时间：原生滚动选择器，无日期限制 -->
      <view class="form-group">
        <view class="form-label">下次沟通时间</view>
        <picker
          mode="date"
          :value="form.nextTime"
          @change="onDateChange"
        >
          <view class="picker-input" :class="{ placeholder: !form.nextTime }">
            {{ form.nextTime || '请选择日期' }}
          </view>
        </picker>
      </view>

      <!-- 下次沟通内容 -->
      <view class="form-group">
        <view class="form-label">下次沟通内容</view>
        <textarea
          class="form-textarea"
          v-model="form.nextContent"
          placeholder="请输入下次沟通内容"
          placeholder-class="placeholder"
          maxlength="200"
          :auto-height="true"
        />
      </view>

      <!-- 按钮组 -->
      <view class="button-group">
        <button class="btn-primary" @click="onSave">保存</button>
        <button class="btn-secondary" @click="onCancel">取消</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { saveRecord, getRecordById } from '@/services/recordStorage.js';

// 不再需要 minDate 限制
const form = ref({
  id: '',
  subject: '',
  detail: '',
  nextTime: '',
  nextContent: ''
});

onLoad((options) => {
  if (options && options.id) {
    const record = getRecordById(options.id);
    if (record) {
      form.value = { ...record };
    }
  }
});

const onDateChange = (e) => {
  form.value.nextTime = e.detail.value;
};

const onSave = () => {
  const subject = form.value.subject.trim();
  const detail = form.value.detail.trim();
  
  if (!subject) {
    uni.showToast({ title: '请填写沟通主题', icon: 'none' });
    return;
  }
  if (!detail) {
    uni.showToast({ title: '请填写沟通详情', icon: 'none' });
    return;
  }

  form.value.subject = subject;
  form.value.detail = detail;

  try {
    saveRecord(form.value);
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  } catch (e) {
    uni.showToast({ title: '保存失败，请重试', icon: 'none' });
  }
};

const onCancel = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
/* 莫兰迪风格表单页 - 样式完全不变 */
.form-page {
  min-height: 100vh;
  background-color: $bg-color;
  padding: $spacing-md;
}

.form-card {
  background-color: $bg-white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg $spacing-md;
  box-shadow: $box-shadow-card;
  border: 1px solid rgba(230, 226, 236, 0.6);
}

.form-group {
  margin-bottom: $spacing-lg;
}

.form-label {
  font-size: 30rpx;
  color: $text-main;
  margin-bottom: $spacing-sm;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.required {
  color: $danger-color;
  margin-left: 6rpx;
  font-size: 32rpx;
}

.form-input {
  width: 100%;
  height: 76rpx;
  line-height: 76rpx;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  padding: 0 $spacing-md;
  font-size: 28rpx;
  background-color: #FCFBFE;
  transition: all 0.2s;
  color: $text-main;

  &:focus {
    border-color: $primary-color;
    background-color: #FFFFFF;
    box-shadow: 0 0 0 4rpx rgba(122, 111, 155, 0.08);
  }
}

.form-textarea {
  width: 100%;
  min-height: 180rpx;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  padding: $spacing-sm $spacing-md;
  font-size: 28rpx;
  background-color: #FCFBFE;
  transition: all 0.2s;
  color: $text-main;
  line-height: 1.5;

  &:focus {
    border-color: $primary-color;
    background-color: #FFFFFF;
    box-shadow: 0 0 0 4rpx rgba(122, 111, 155, 0.08);
  }
}

.picker-input {
  position: relative;
  width: 100%;
  height: 76rpx;
  line-height: 76rpx;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  padding: 0 $spacing-lg 0 $spacing-md;
  font-size: 28rpx;
  background-color: #FCFBFE;
  display: flex;
  align-items: center;
  color: $text-main;
  box-sizing: border-box;
  transition: all 0.2s;
  box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.02);

  &.placeholder {
    color: $text-light;
  }

  &:active {
    border-color: $primary-color;
    background-color: #FFFFFF;
    box-shadow: 0 0 0 4rpx rgba(122, 111, 155, 0.08), inset 0 2rpx 4rpx rgba(0, 0, 0, 0.02);
  }

  &::after {
    content: '▼';
    position: absolute;
    right: $spacing-md;
    top: 50%;
    transform: translateY(-50%);
    color: $text-light;
    font-size: 24rpx;
    opacity: 0.5;
    pointer-events: none;
  }
}

.placeholder {
  color: $text-light;
}

.button-group {
  margin-top: 60rpx;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.btn-primary {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background-color: $primary-color;
  color: #fff;
  border-radius: 48rpx;
  font-size: 34rpx;
  font-weight: 500;
  border: none;
  box-shadow: $box-shadow-btn;
  transition: all 0.2s;

  &::after {
    border: none;
  }

  &:active {
    background-color: $primary-dark;
    transform: scale(0.98);
    box-shadow: 0 4rpx 8rpx rgba(122, 111, 155, 0.2);
  }
}

.btn-secondary {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background-color: #F4F2F7;
  color: $text-secondary;
  border-radius: 48rpx;
  font-size: 34rpx;
  font-weight: 500;
  border: none;

  &::after {
    border: none;
  }

  &:active {
    background-color: #EBE7F0;
    transform: scale(0.98);
  }
}
</style>