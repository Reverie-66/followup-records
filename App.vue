<script>
export default {
  onLaunch: function() {
    console.log('App Launch，应用启动');
    // 可以在这里做一些全局初始化，比如检查更新、获取系统信息等
  },
  onShow: function() {
    console.log('App Show，应用显示');
  },
  onHide: function() {
    console.log('App Hide，应用隐藏');
  }
};
</script>

<style lang="scss">
/* 全局样式 */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

view, text, input, textarea, button {
  box-sizing: border-box;
}

/* 清除默认按钮样式 */
button {
  background-color: transparent;
  padding: 0;
  margin: 0;
  line-height: inherit;
  font-size: inherit;
}

button::after {
  border: none;
}

</style>