<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// 初始element-ui版本-
// "element-ui": "2.7.2",
export default {
  name: 'App'
}
</script>
<style lang="scss">
body{
    // background-image: url("../src/assets/bg.png");
    background-size: 100% 100%;;
    height: 100%;
	background-color: #f5f5f5;
}
.root{
  margin: 50px 25px 0px 25px
}
.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 2px 12px 0 #bababa;
}


.my-flex{
  display: flex;
}
</style>
