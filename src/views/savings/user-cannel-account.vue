<template>
  <div style="padding: 30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">客户销户</span>
      </div>
      <div class="contend">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form ref="cannelAccountForm" :model="cannelAccountForm" :rules="FormRules" class="demo-ruleForm"
              label-width="200px" style="width: 600px;margin-top: 50px;">
              <el-form-item label="银行卡号" prop="cardNumber">
                <el-input v-model="cannelAccountForm.cardNumber" oninput="value=value.replace(/[^\d]/g,'')" />
              </el-form-item>
              <el-form-item label="交易密码" prop="transactionPassword">
                <el-input placeholder="请输入密码" maxlength="6" auto-complete="new-password" show-password
                  v-model="cannelAccountForm.transactionPassword" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="margin-left: 80%" type="primary" @click="submit">提交</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  import $ from "jquery";
  import {
    bankAccountValid,
    transactionPasswordVerification
  } from "@/utils/validate";
  export default {
    data() {
      return {
        inputing: false,
        cannelAccountForm: {
          cardNumber: "", //银行卡号
          transactionPassword: "", //交易密码
          tellerNumber: "001", //柜员编号
        },
        FormRules: {
          cardNumber: [{
            required: true,
            trigger: "blur",
            validator: bankAccountValid,
          }],
          transactionPassword: [{
            required: true,
            trigger: "blur",
            validator: transactionPasswordVerification,
          }, ],
        },
      }
    },
    created: function() {},
    methods: {
      submit() {

        this.$refs.cannelAccountForm.validate((valid) => {
          console.log("valid:" + valid);
          if (valid) {
            this.$confirm("是否要进行销户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {

                let that = this;
                $.ajax({
                  type: "post",
                  url: "http://localhost:8088/cancelaccount",
                  contentType: "application/json",
                  data: JSON.stringify(that.cannelAccountForm),
                  dataType: "json",
                  success: function(data) {
                    if (data.success == "true") {
                      that.$message({
                        type: "success",
                        message: data.ans,
                      });
                      setTimeout(() => {
                        location.reload()
                      }, 2000)
                    } else {
                      that.$message({
                        type: "error",
                        message: data.ans,
                      });
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
    }
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

