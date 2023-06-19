<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="font-size: 18px;">登录密码修改</span>
    </div>
    <div style="margin-left: 200px;min-height: 550px;">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form id="form" ref="updatePasswordFormRef" :model="updatePasswordForm" :rules="FormRules"
            class="demo-ruleForm" label-position="right" label-width="120px" >
            <el-form-item label="原登录密码" prop="oldLoginPwd">
              <el-input v-model="updatePasswordForm.oldLoginPwd" auto-complete="new-password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新登录密码" prop="NewLoginPwd">
              <el-input v-model="updatePasswordForm.NewLoginPwd" auto-complete="new-password" show-password></el-input>
            </el-form-item>
            <el-form-item v-if="updatePasswordForm.NewLoginPwd" label="密码强度" style="width: 400px;">
              <password-strength v-model="updatePasswordForm.NewLoginPwd" style="padding-top: 10px;"></password-strength>
            </el-form-item>
            <el-form-item label="登录密码确认" prop="NewLoginPwdVerify">
              <el-input v-model="updatePasswordForm.NewLoginPwdVerify" auto-complete="new-password" show-password>
              </el-input>
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
    components:{PasswordStrength},//注册验证密码强度组件
    data() {
      return {
        updatePasswordForm: {
          oldLoginPwd: '',
          NewLoginPwd: '',
          NewLoginPwdVerify: '',
          idNumber:localStorage.getItem("idNumber")
        },
        FormRules: {
          oldLoginPwd: [{
              required: true,
              message: "请输入原登录密码",
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
          NewLoginPwd: [{
              required: true,
              message: "请输入新登录密码",
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
          NewLoginPwdVerify: [{
              required: true,
              message: "请输入新登录密码",
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
                let passwordReg = this.updatePasswordForm.NewLoginPwd;
                if (passwordReg != value) {
                  callback(new Error("两次输入的登录密码不相同"));
                } else {
                  callback();
                }
              },
            },
          ],
        }
      };
    },
    created: function() {},
    mounted() {},
    methods: {
      submit() {
        this.$refs.updatePasswordFormRef.validate((valid) => {
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
                  url: "http://localhost:8088/updateLoginPwd",
                  contentType: "application/json",
                  data: JSON.stringify(that.updatePasswordForm),
                  dataType: "json",
                  success: function(data) {
                    if (data.success=="true") {
                      that.$message({
                        type: "success",
                        message: "修改成功，请重新登录",
                      });
                      that.$router.push({
                        path: "/customer-login"
                      });
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
</style>
