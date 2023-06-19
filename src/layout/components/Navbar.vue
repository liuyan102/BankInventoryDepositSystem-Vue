<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-submenu index="1">
          <template slot="title">
            <el-avatar :size="40" :src="require('../../assets/head.png')">
            </el-avatar>
          </template>
          <el-menu-item index="1-2" @click="logout">退出登录</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <span style="font-size:18px;margin-right:20px;float: right;line-height: 50px;">系统日期：{{ systemDate }}</span>
    <!-- <el-drawer
      title="操作历史"
      :visible.sync="drawer"
      :direction="direction"
      >
      <span style="font-size: 18px; margin-left: 20px;">操作1</span>
    </el-drawer> -->
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import $ from "jquery";
  export default {
    data() {
      return {
        drawer: false,
        systemDate: '',
      };
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    mounted() {
      this.getSystemDate();
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        let that = this;
        this.$confirm('是否要进行退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('hasLogin')
          that.$router.push({
            path: '/login'
          })
          that.$message({
            type: 'success',
            message: '登出成功'
          });
        }, ).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      },
      getSystemDate() {
        let that = this;
        $.ajax({
          type: "post",
          url: "http://localhost:8088/getSystemInfo",
          contentType: "application/json",
          data: JSON.stringify({
            SystemNumber: '1000',
          }),
          dataType: "json",
          success: function(data) {
            that.systemDate = data.currentSystemDate
            localStorage.setItem("systemDate", that.systemDate)
          },
          fail: function(data) {
            alert("数据读取失败");
          },
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;
      margin-right: 20px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
