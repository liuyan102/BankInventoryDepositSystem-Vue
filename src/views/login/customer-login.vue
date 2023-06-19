<template>
  <div class="login-container">
    <el-tabs class="tabs" type="card" v-model="activeName">
      <el-tab-pane label="身份证登录" name="first">
        <div class="title-container">
          <h3 style="font-color: black" class="title">网上银行</h3>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="documentNumber">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm.documentNumber"
              placeholder="证件号码"
            />
          </el-form-item>
          <el-form-item prop="loginPassword">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="loginForm.loginPassword"
              :type="passwordType"
              placeholder="登录密码"
              auto-complete="new-password"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>

          <el-button
            id="login_btn"
            type="primary"
            style="width: 100%; margin-bottom: 30px"
            @click="handleLogin"
            >登录</el-button
          >
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="手机号登录" name="second">
        <div class="title-container">
          <h3 style="font-color: black" class="title">网上银行</h3>
        </div>
        <el-form
          ref="loginForm1"
          :model="loginForm1"
          :rules="loginRules1"
          class="login-form"
          label-position="left"
        >
          <el-form-item prop="mobilePhoneNumber">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm1.mobilePhoneNumber"
              placeholder="手机号码"
            />
          </el-form-item>
          <el-form-item prop="verificationCode">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              style="width: 350px"
              v-model="loginForm1.verificationCode"
              placeholder="验证码"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
            <span class="svg-container">
              <div class="my-code-get" @click="get_captcha" id="new_yan">
                <span v-show="show">获取验证码</span>
                <span v-show="!show">{{ count }} s</span>
              </div>
            </span>
          </el-form-item>

          <el-button
            id="login_btn"
            type="primary"
            style="width: 100%; margin-bottom: 30px"
            @click="handleLogin1"
            >登录</el-button
          >
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div class="info" style="font-size: 20px; color: white">verison: 1.0</div>
  </div>
</template>

<script>
import $ from "jquery";
import { checkIdCard, mobilePhoneNumberVerification } from "@/utils/validate";
export default {
  data() {
    return {
      show: true,
      count: 60,
      timer: null,
      activeName: "first",
      loginForm: {
        documentNumber: "",
        loginPassword: "",
      },
      loginForm1: {
        mobilePhoneNumber: "",
        verificationCode: "",
      },
      loginRules: {
        documentNumber: [
          { required: true, validator: checkIdCard, trigger: "blur" },
        ],
        loginPassword: [
          {
            required: true,
            message: "请输入登录密码",
            transform: (value) => value,
            trigger: "blur",
          },
          {
            type: "string",
            message: "请输入不包含空格的字符",
            trigger: "blur",
            transform(value) {
              if (value && value.indexOf(" ") === -1) {
                return value;
              } else {
                return false;
              }
            },
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              var passwordreg =
                /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,18}/;
              if (!passwordreg.test(value)) {
                callback(
                  new Error(
                    "密码必须由数字、字母、特殊字符组合,并长度在8-18位之间"
                  )
                );
              } else {
                callback();
              }
            },
          },
        ],
      },
      loginRules1: {
        mobilePhoneNumber: [
          {
            required: true,
            validator: mobilePhoneNumberVerification,
            trigger: "blur",
          },
        ],
        verificationCode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              console.log(value);
              if (value == "") {
                callback(new Error("验证码不能为空"));
              } else if (value.length < 6) {
                callback(new Error("验证码位数<6位"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      passwordType: "password",
    };
  },
  watch: {},
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    //获取验证码
    getVerificationCode() {
      let that = this;
      $.ajax({
        type: "post",
        url: "http://localhost:8088/getVerificationCode",
        contentType: "application/json",
        data: JSON.stringify({
          mobilePhoneNumber: that.loginForm1.mobilePhoneNumber,
        }),
        dataType: "json",
        success: function (data) {
          if(data.code==1){
            console.log(data.data);
            that.$message({
            type: "success",
            message: "验证码获取成功",
          });

          }else{
            that.$message({
            type: "success",
            message: "获取验证码失败，请稍后再试",
          });
          }

        },
        fail: function (data) {
          that.$message({
            type: "error",
            message: "当前业务繁忙，请稍后再试",
          });
        },
      });
    },
    //账户密码登录按钮点击事件，如果接收的数据为success，页面跳转，记录身份证号
    handleLogin() {
      //数据格式验证
      let that = this;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          $.ajax({
            type: "post",
            url: "http://localhost:8088/login",
            contentType: "application/json",
            data: JSON.stringify({
              type: "1",
              documentNumber: that.loginForm.documentNumber,
              loginPassword: that.loginForm.loginPassword,
            }),
            dataType: "json",
            success: function (data) {
              //效验登录信息
              if (data.code == 1) {
                console.log(data.code);
                localStorage.setItem("hasLogin", true);
                localStorage.setItem("idNumber", that.loginForm.documentNumber);
                localStorage.setItem("isQuery", "true");
                that.$router.push({ path: "/onlineBanking" });
              } else if (data.code == 2) {
                console.log(data.code);
                localStorage.setItem("isQuery", "false");
                localStorage.setItem("hasLogin", false);
                localStorage.setItem("idNumber", that.loginForm.documentNumber);
                that.$router.push({
                  path: "/onlineBanking/person-info-update",
                });
              } else {
                that.$message({
                  type: "error",
                  message: data.msg,
                });
              }
            },
            fail: function (data) {
              that.$message({
                type: "error",
                message: "登录失败",
              });
            },
          });
        } else {
          that.$message({
            type: "warning",
            message: "请输入正确的证件号码或登录密码",
          });
        }
      });
    },
    get_captcha() {
      let that = this;
      this.$refs.loginForm1.validateField("mobilePhoneNumber", (valid) => {
        if (!valid) {
          if (this.timer == null) {
            this.getVerificationCode();
          }
          if (!this.timer) {
            this.count = 60;
            this.show = false;
            $(".my-code-get").addClass("huise");
            // 将鼠标设置为不可点击状态
            document.getElementById("new_yan").style.cursor = "not-allowed";
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= 60) {
                this.count--;
              } else {
                document.getElementById("new_yan").style.backgroundColor = "#409eff";
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          }
        } else {
          that.$message({
            type: "warning",
            message: "请输入正确的手机号",
          });
        }
      });
    },
    findIdNumber() {
      let that = this;
      $.ajax({
        type: "post",
        url: "http://localhost:8088/getIdNumber",
        contentType: "application/json",
        data: JSON.stringify({
          mobilePhoneNumber: that.loginForm1.mobilePhoneNumber,
        }),
        dataType: "json",
        success: function (data) {
          //效验登录信息
          localStorage.setItem("idNumber", data.idNumber);
        },
      });
    },
    //手机号登录点击事件
    handleLogin1() {
      this.$refs.loginForm1.validate((valid) => {
        if (valid) {
          let that = this;
          $.ajax({
            type: "post",
            url: "http://localhost:8088/login",
            contentType: "application/json",
            data: JSON.stringify({
              type: "2",
              mobilePhoneNumber: that.loginForm1.mobilePhoneNumber,
              verificationCode: that.loginForm1.verificationCode,
            }),
            dataType: "json",
            success: function (data) {
              //效验登录信息
              if (data.code == 1) {
                localStorage.setItem("hasLogin", true);
                that.findIdNumber();
                localStorage.setItem("isQuery", "true");
                that.$router.push({ path: "/onlineBanking" });
              } else if (data.code == 2) {
                that.findIdNumber();
                localStorage.setItem("isQuery", "false");
                localStorage.setItem("hasLogin", false);
                that.$router.push({
                  path: "/onlineBanking/person-info-update",
                });
              } else {
                that.$message({
                  type: "error",
                  message: data.msg,
                });
              }
            },
            fail: function (data) {
              that.$message({
                type: "error",
                message: "登录失败",
              });
            },
          });
        } else {
          that.$message({
            type: "warning",
            message: "请输入正确的手机号或验证码",
          });
        }
      });
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
  background-image: url("~@/assets/background1.jpg");
  background-size: 100% 100%;
  height: 100%;
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

<style lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    background-color: #919191;
}
.tabs {
  box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.5);
  position: relative;
  width: 600px;
  margin-top: 5px;
  max-width: 100%;
  margin-top: 10%;
  margin-left: 35%;
  overflow: hidden;
}

.el-tabs__item {
  color: #fff !important;
  font-size: 18px !important;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
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
  .my-code {
    overflow: hidden;
  }
  .my-code-get {
    width: 80px;
    height: 35px;
    background-color: #409eff;
    margin-left: 20px;
    padding-left: 5px;
    line-height: 35px;
    font-family: PingFangSC-Regular;
    color: #ffffff;
    border-radius: 5px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .my-code-get:active {
    background-color: #007bf7;
  }
  .my-code-get:hover {
    cursor: pointer;
  }
  .huise {
    background-color: #dcdcdc !important;
    color: black;
  }
}
</style>
