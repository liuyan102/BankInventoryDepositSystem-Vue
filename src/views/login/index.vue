<template>
  <div class="login-container">
    <div class="bg">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">柜面管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          id="account"
          ref="username"
          v-model="loginForm.username"
          placeholder="账户"
          name="username"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="密码"
          name="password"
          show-password
        />
      </el-form-item>

      <el-button
        id="login_btn"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="handleLogin"
        >登录</el-button
      >
    </el-form>
    </div>
    <div class="info" style="font-size: 20px;color:white">verison: 1.0</div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("请输入正确的账户"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
    };
  },

  methods: {
    handleLogin() {
      let that = this;
      //数据格式验证
      this.$refs.loginForm.validate((valid) => {
            if(valid) {
                let that = this;
                $.ajax({
                  type: "post",
                  url: "http://localhost:8088/tellerlogin",
                  contentType: "application/json",
                  data: JSON.stringify(
                    {
                      username:that.loginForm.username,
                      password:that.loginForm.password
                    }
                  ),
                  dataType: "json",
                  success: function (data) {
                    if(data.msg=="登录成功"){
                        localStorage.setItem('hasLogin',"true");
                        that.$router.push({ path: "/Home/Home" });
                    }else{
                      that.$message({
                      type: "error",
                      message: data.msg,
                    })
                    } 
                  },
                  fail: function (data) {
                    that.$message({
                      type: "error",
                      message: "当前业务繁忙，请稍后再试",
                    });
                  },
                });
            }
            else{
              that.$message({
                type: "warning",
                message: "请输入正确格式的账户或密码",
              });
            }
        })
    },
  },
};
</script>

<style lang="scss">
.info {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: gainsboro;
}
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
    background-image: url('~@/assets/background1.jpg');
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    box-shadow: 0px 15px 20px rgba(0,0,0,.5);
    border-radius:15px;
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    width: 600px;
    max-width: 100%;
    padding: 70px 35px 0;
    padding-bottom: 20px;
    margin-top:10%;
    margin-left:35%;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
