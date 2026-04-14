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

      <!-- 下次沟通时间：使用 uni-datetime-picker 保证跨平台置灰 -->
      <view class="form-group">
        <view class="form-label">下次沟通时间</view>
        <uni-datetime-picker
          type="date"
          :value="form.nextTime"
          :start="minDate"
          @change="onDateChange"
          placeholder="请选择日期"
          class="datetime-picker"
        />
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
import UniDatetimePicker from '@dcloudio/uni-ui/lib/uni-datetime-picker/uni-datetime-picker.vue';
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'; 
// 计算今天日期作为最小可选日期 (YYYY-MM-DD)
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const minDate = ref(`${year}-${month}-${day}`);

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

// uni-datetime-picker 的 change 事件参数不同：返回 { value: 'YYYY-MM-DD' }
const onDateChange = (e) => {
  form.value.nextTime = e.value;
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
/* 莫兰迪风格表单页 */
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

// 为 uni-datetime-picker 定制样式，使其与整体风格统一
.datetime-picker {
  width: 100%;

  // 内部输入框样式覆盖（组件内部类名固定）
  :deep(.uni-date) {
    height: 76rpx !important;
    border: 1px solid $border-color !important;
    border-radius: $border-radius-md !important;
    background-color: #FCFBFE !important;
    padding: 0 $spacing-md !important;
    font-size: 28rpx !important;
    color: $text-main !important;
    box-sizing: border-box !important;
    box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.02) !important;

    .uni-date-input {
      height: 76rpx !important;
      line-height: 76rpx !important;
      color: $text-main !important;
    }

    .uni-date-placeholder {
      color: $text-light !important;
    }

    .uni-icons {
      color: $text-light !important;
    }
  }

  // 聚焦/点击态
  :deep(.uni-date:active) {
    border-color: $primary-color !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 0 4rpx rgba(122, 111, 155, 0.08), inset 0 2rpx 4rpx rgba(0, 0, 0, 0.02) !important;
  }
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