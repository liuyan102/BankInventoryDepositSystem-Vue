<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="font-size: 18px;">客户信息修改</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form id="form" ref="openAccountFormRef" :model="openAccountForm" :rules="FormRules" class="demo-ruleForm"
            label-width="110px">
            <el-divider class="divider"><span class="title">基本信息</span></el-divider>
            <el-form-item label="姓名" prop="name">
              <el-input readonly v-model="openAccountForm.name" />
            </el-form-item>
            <el-form-item label="证件类型" prop="typeOfCertificate">
              <el-input readonly v-model="openAccountForm.typeOfCertificate"></el-input>
            </el-form-item>
            <el-form-item label="证件号码" prop="idnumber">
              <el-input readonly v-model="openAccountForm.idnumber"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input readonly v-model="openAccountForm.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
              <el-input readonly v-model="openAccountForm.address"></el-input>
            </el-form-item>
            <el-divider class="divider"><span class="title">补充信息</span></el-divider>
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model="openAccountForm.mail"></el-input>
            </el-form-item>
            <el-form-item label="职业" prop="profession">
              <el-input v-model="openAccountForm.profession"></el-input>
            </el-form-item>
            <el-form-item label="家庭固定电话" prop="familyFixedPhone">
              <el-input oninput = "value=value.replace(/[^\d]/g,'')" v-model="openAccountForm.familyFixedPhone"></el-input>
            </el-form-item>
            <el-form-item label="单位固定电话" prop="unitFixationPhone">
              <el-input oninput = "value=value.replace(/[^\d]/g,'')" v-model="openAccountForm.unitFixationPhone"></el-input>
            </el-form-item>
            <el-form-item label="工作单位地址" prop="workUnitAddress">
              <el-input v-model="openAccountForm.workUnitAddress"></el-input>
            </el-form-item>
            <el-divider class="divider" v-if="query=='false'"><span class="title">密码修改</span></el-divider>
            <el-form-item label="新登录密码" prop="loginPwd" v-if="query=='false'">
              <el-input minlength="8" maxlength="18" v-model="openAccountForm.loginPwd" auto-complete="new-password" show-password></el-input>
            </el-form-item>
            <el-form-item v-if="openAccountForm.loginPwd" label="密码强度" style="width: 400px;">
              <password-strength v-model="openAccountForm.loginPwd" style="padding-top: 10px;"></password-strength>
            </el-form-item>
            <el-form-item label="登录密码确认" prop="loginPwdVerify" v-if="query=='false'">
              <el-input minlength="8" maxlength="18"  v-model="openAccountForm.loginPwdVerify" auto-complete="new-password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="margin-left: 80%" type="primary" @click="submit()">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
  import $ from "jquery";
  import PasswordStrength from "@/components/PasswordStrength/PasswordStrength.vue"
  export default {
    components: {
      PasswordStrength
    }, //注册验证密码强度组件
    data() {
      return {
        query: localStorage.getItem("isQuery"),
        openAccountForm: {
          name: "",
          typeOfCertificate: "居民身份证", // 证件类型
          idnumber: "", // 证件号码
          phoneNumber: "", // 手机号
          address: "", // 家庭地址
          mail: '',
          profession: "", //职业
          familyFixedPhone: '', //家庭固定电话
          unitFixationPhone: '', //单位固定电话
          workUnitAddress: '', //工作单位地址
          loginPwd: '',
          loginPwdVerify: '',
          query: '',
        },
        FormRules: {
          mail:[{
              required:true,
              trigger:"blur",
              validator: (rule, value, callback) => {
                var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                if (value != '' && !regEmail.test(value)) {
                  callback(
                    new Error(
                      "邮箱格式错误"
                    ));
                }else{
                  callback();
                }
              }
          }],
          loginPwd: [{
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
          loginPwdVerify: [{
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
            {
              trigger: "blur",
              validator: (rule, value, callback) => {
                let passwordReg = this.openAccountForm.loginPwd;
                if (passwordReg != value) {
                  callback(new Error("两次输入的交易密码不相同"));
                } else {
                  callback();
                }
              },
            },
          ],
          idCardValidity: [{
            required: true,
            trigger: blur,
            message: '请选择证件有效期'
          }]
        }
      };
    },
    created: function() {},
    mounted() {
      this.getInfo();
    },
    methods: {
      getInfo() {
        let that = this;
        $.ajax({
          type: "post",
          url: "http://localhost:8088/getInfo",
          contentType: "application/json",
          data: JSON.stringify({
            idNumber: localStorage.getItem("idNumber"),
          }),
          dataType: "json",
          success: function(data) {
            that.openAccountForm = data;
          },
          fail: function(data) {
            alert("当前业务繁忙，请稍后再试");
          },
        });
      },

      submit() {
        this.openAccountForm.query = this.query;
        console.log(this.openAccountForm);
        this.$refs.openAccountFormRef.validate((valid) => {
          if (valid) {
            this.$confirm("是否要确认进行?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                let that = this;
                $.ajax({
                  type: "post",
                  url: "http://localhost:8088/correct",
                  contentType: "application/json",
                  data: JSON.stringify(that.openAccountForm),
                  dataType: "json",
                  success: function(data) {
                    if (data.code == 1) {
                      if(that.query=="false"){
                        that.$message({
                          type: "success",
                          message: "修改成功，请重新登录",
                        });
                        that.$router.push({
                          path: "/customer-login"
                        });
                      }else{
                        that.$message({
                          type: "success",
                          message: "个人信息修改成功",
                        });
                      }

                    } else {
                      that.$message({
                        type: "error",
                        message: data.msg,
                      });
                    }

                  },
                  fail: function(data) {
                    alert("当前业务繁忙，请稍后再试");
                  },
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消提交",
                });
              });
          } else {
            this.$message({
              type: "warning",
              message: "请将信息填写完整，并保证信息的准确性",
            });
          }
        });
      },
    },
  };
</script>

<style scoped>
  .choose-color {
    z-index: 9999;
    /* width: 210px; */
  }

  .line {
    text-align: center;
  }

  .img-wrap {
    width: 100%;
    height: 500px;
    margin-left: 68px;
  }

  .divider {
    padding: 50px;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    background-color: #dcdfe6;

  }

  .el-divider__text {
    position: absolute;
    background-color: #dcdfe6;
    padding: 0;
    color: #303133;
  }
</style>
