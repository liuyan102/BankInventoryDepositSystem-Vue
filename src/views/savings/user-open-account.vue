<template>
  <div style="padding: 30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">客户开户</span>
      </div>
      <div class="contend">
        <el-col :span="4">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form id="form" ref="openAccountFormRef" :model="openAccountForm" :rules="FormRules"
                class="demo-ruleForm" label-width="200px" style="width: 600px;margin-top: 50px;">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="openAccountForm.name" />
                </el-form-item>
                <el-form-item label="证件类型" prop="typeOfCertificate">
                  <el-input v-model="openAccountForm.typeOfCertificate" disabled></el-input>
                </el-form-item>
                <el-form-item label="证件号码" prop="idNumber">
                  <el-input v-model="openAccountForm.idNumber"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNumber">
                  <el-input v-model="openAccountForm.phoneNumber" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
                <el-form-item label="家庭住址" prop="address">
                  <el-input v-model="openAccountForm.address"></el-input>
                </el-form-item>
                <el-form-item label="交易密码" prop="transactionPassword">
                  <el-input maxlength="6" auto-complete="new-password" show-password
                    v-model="openAccountForm.transactionPassword" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
                <el-form-item label="交易密码确认" prop="transactionPasswordConfirmation">
                  <el-input maxlength="6" auto-complete="new-password" show-password
                    v-model="openAccountForm.transactionPasswordConfirmation"
                    oninput="value=value.replace(/[^\d]/g,'')">
                  </el-input>
                </el-form-item>
                <el-row>
                  <el-col :span="4">
                    <el-form-item value="手机银行" prop="mobilePhoneBankSign">
                      <el-checkbox-group v-model="openAccountForm.mobilePhoneBankSign">
                        <el-checkbox label="手机银行" value="1"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item value="网上银行" prop="onlineBankSign">
                      <el-checkbox-group v-model="openAccountForm.onlineBankSign">
                        <el-checkbox label="网上银行" value="1"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item value="外汇买卖" prop="forexTradingSign">
                      <el-checkbox-group v-model="openAccountForm.forexTradingSign">
                        <el-checkbox label="外汇买卖" value="1"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item>
                  <el-button style="margin-left: 80%" type="primary" @click="submit()">提交</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-col>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    checkIdCard,
    transactionPasswordVerification,
    mobilePhoneNumberVerification,
  } from "@/utils/validate";
  import $ from "jquery";
  export default {
    data() {
      return {
        openAccountForm: {
          name: "",
          typeOfCertificate: "二代居民身份证", // 证件类型
          idNumber: "", // 证件号码
          phoneNumber: "", // 手机号
          address: "", // 家庭地址
          transactionPassword: "", // 交易密码
          transactionPasswordConfirmation: "", // 交易密码确认
          mobilePhoneBankSign: 'false', //手机银行标记
          onlineBankSign: 'false', //网上银行标记
          forexTradingSign: 'false', //外汇买卖
          accountOpeningDate: '', //开户日期
          accountOpeningOperator: "", //开户操作员
        },
        FormRules: {
          idNumber: [{
            required: true,
            validator: checkIdCard,
            trigger: "blur"
          }, ],
          address: [{
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请填写家庭住址"));
              } else {
                callback();
              }
            },
          }],
          name: [{
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入姓名"));
              } else {
                callback();
              }
            },
          }, ],
          phoneNumber: [{
            required: true,
            trigger: "blur",
            validator: mobilePhoneNumberVerification,
          }, ],
          transactionPassword: [{
            required: true,
            trigger: "blur",
            validator: transactionPasswordVerification,
          }, ],
          transactionPasswordConfirmation: [{
              trigger: "blur",
              validator: (rule, value, callback) => {
                let passwordReg = this.openAccountForm.transactionPassword;
                if (passwordReg != value) {
                  callback(new Error("两次输入的交易密码不相同"));
                } else {
                  callback();
                }
              },
            },
            {
              required: true,
              trigger: "blur",
              validator: transactionPasswordVerification,
            },
          ],
        },
      };
    },
    created: function() {},
    methods: {
      submit() {
        this.$refs.openAccountFormRef.validate((valid) => {
          if (valid) {
            this.$confirm("是否要进行开户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                let that = this;
                $.ajax({
                  type: "post",
                  url: "http://localhost:8088/Open/OpenAccount",
                  contentType: "application/json",
                  data: JSON.stringify(that.openAccountForm),
                  dataType: "json",
                  success: function(data) {
                    if (data.code == 1) {
                      if (data.data == null) {
                        console.log("银行卡号：" + data.msg);
                        alert("[开户成功]\n" + "银行卡号：" + data.msg);
                      } else {
                        console.log("银行卡号：" + data.msg + "\n" + "网上银行登录密码：" + data.data);
                        alert("[开户成功]\n" + "银行卡号：" + data.msg + "\n" + "网上银行登录密码：" + data.data);
                      }
                      setTimeout(() => {
                        location.reload()
                      }, 2000)
                    } else {
                      let result = "error：" + data.msg;
                      alert(result);
                    }
                  },
                  fail: function(data) {
                    alert("请求失败，请稍后再试");
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

<style>
  .choose-color {
    z-index: 9999;
    /* width: 210px; */
  }

  .line {
    text-align: center;
  }

  .contend {
    min-height: 600px;
  }

  .el-form-item {
    margin-bottom: 35px;
  }

  .img-wrap {
    width: 100%;
    height: 500px;
    margin-left: 68px;
  }

  .box {
    width: 220px !important;
  }
</style>
