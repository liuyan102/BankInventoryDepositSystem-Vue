<template>
  <el-container class="container">
    <el-header class="header">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :router="true"
        background-color="#304156" text-color="#ffffff" active-text-color="#ffffff">
        <!-- <el-menu-item><img class="logo" src="../../../assets/logo.png" /></el-menu-item> -->
        <el-menu-item v-if="query=='true'" index="/onlineBanking">客户中心</el-menu-item>
        <el-menu-item v-if="query=='true'" index="/onlineBanking/customer-trading-water">客户流水查询</el-menu-item>
        <el-menu-item v-if="query=='true'" index="/onlineBanking/transfer">客户转账</el-menu-item>
        <el-menu-item index="/onlineBanking/person-info-update">客户信息修改</el-menu-item>
        <el-menu-item v-if="query=='true'" index="/onlineBanking/password-update">登录密码修改</el-menu-item>
        <el-menu-item style="float: right;" @click="logout">退出登录</el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        query: localStorage.getItem("isQuery"),
        activeIndex: '/onlineBanking',
      };
    },
    mounted() {
      console.log(this.query);
    },
    methods: {
      async logout() {
        this.$confirm('是否要进行退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('hasLogin')
          this.$router.push({
            path: '/customer-login'
          })
          this.$message({
            type: 'success',
            message: '登出成功'
          });
        }, ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      },
    }
  }
</script>

<style>
  .container {
    background-color: #f1f1f1;
    height: 100%;
  }

  .header {
    padding: 0 250px;
    background-color: #304156;
  }

  .main {
    padding: 20px 250px;
  }

  .el-menu-item:hover {
    background-color: #eb532c !important;
  }

  .el-menu-item.is-active {
    background-color: #eb532c !important;
    color: #fff;
  }

  .logo{
    width: 210px;
    height: 60px;
  }
</style>
