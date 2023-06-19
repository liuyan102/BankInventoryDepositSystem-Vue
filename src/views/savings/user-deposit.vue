<template>
  <div style="padding: 30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">客户存款</span>
      </div>
      <div class="contend">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form ref="depositForm" :model="depositForm" :rules="FormRules" label-width="200px"
              style="width: 600px;margin-top: 50px;">
              <el-form-item label="银行卡号" prop="bankAccount">
                <el-input v-model="depositForm.bankAccount" oninput="value=value.replace(/[^\d]/g,'')" />
              </el-form-item>
              <el-form-item label="存款金额" prop="transactionAmount">
                <el-input v-model="depositForm.transactionAmount" v-bind="$attrs" :maxlength="maxlength"
                  oninput="value=value.replace(/[^\d.]/g,'')" @input="handleInput" @focus="handleFocus"
                  @blur="handleBlur" @change="handleChange">
                  <template slot="append">
                    <slot name="append"></slot>
                  </template>
                  <font slot="prefix">￥</font>
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
  </div>
</template>

<script>
  import {
    inputNumber
  } from "@/utils/inputNumber";
  import {
    formatMoney
  } from "@/utils/formatMoney";
  import $ from "jquery";
  import {
    bankAccountValid,
    transactionAmountVerification,
  } from "@/utils/validate";
  export default {
    props: {
      value: {
        type: [String, Number],
        default: "",
      },
      // 金额位数格式（a-b）；a:整数位数；b:小数位数
      format: {
        type: String,
        default: "11-2",
      },
    },
    data() {
      return {
        inputing: false,
        depositForm: {
          flag: "1", //标志为存款
          bankAccount: "", //银行账户
          transactionAmount: "", //交易金额
        },
        FormRules: {
          bankAccount: [{
            required: true,
            trigger: "blur",
            validator: bankAccountValid
          }, ],
          transactionAmount: [{
              required: true,
              trigger: "blur",
              validator: transactionAmountVerification,
            },
            {
              required: true,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (value == 0) {
                  callback(new Error("转账金额不能为0元"));
                } else {
                  callback();
                }
              }
            },
          ],
        },
      };
    },
    computed: {
      integerNum() {
        return Number(this.format.split("-")[0]);
      },
      decimalNum() {
        return Number(this.format.split("-")[1]);
      },
      maxlength() {
        return (
          this.integerNum +
          (this.decimalNum > 0 ? this.decimalNum + 1 : this.decimalNum)
        );
      },
    },
    watch: {
      value: {
        immediate: true,
        handler(n) {
          if (!n) {
            this.depositForm.transactionAmount = n;
            return;
          }
          if (this.inputing) {
            this.depositForm.transactionAmount = n;
          } else {
            this.depositForm.transactionAmount = formatMoney(
              inputNumber(n.toString()),
              this.format
            );
          }
        },
      },
    },
    created: function() {},
    methods: {
      submit() {
        this.$refs.depositForm.validate((valid) => {
          if (valid) {
            this.$confirm("是否要进行存款?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                let that = this;
                this.depositForm.transactionAmount = this.depositForm.transactionAmount.replaceAll(",", "");
                $.ajax({
                  type: "post",
                  url: "http://localhost:8088/depositwithdraw",
                  contentType: "application/json",
                  data: JSON.stringify({
                    flag: that.depositForm.flag,
                    bankAccount: that.depositForm.bankAccount,
                    transactionPassword: that.depositForm.transactionPassword,
                    transactionAmount: that.depositForm.transactionAmount,
                  }),
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
      handleInput(val) {
        this.inputing = true;
        let money = inputNumber(val);
        const format = this.format;
        const intNum = Number(format.split("-")[0]);
        const decimalNum = Number(format.split("-")[1]);
        const moneyArr = money.split(".");
        moneyArr[0] =
          moneyArr[0].length > intNum ?
          moneyArr[0].substr(0, intNum) :
          moneyArr[0];
        if (moneyArr[1]) {
          moneyArr[1] =
            moneyArr[1].length > decimalNum ?
            moneyArr[1].substr(0, decimalNum) :
            moneyArr[1];
        }
        money = moneyArr.join(".");
        this.depositForm.transactionAmount = money;
        let value = "";
        if (money === "-" || money === ".") {
          value = "";
        } else if (money !== "") {
          value = Number(inputNumber(money));
        } else {

        }
        this.$emit("input", value);
      },
      handleChange(val) {
        this.inputing = true;
        this.$emit("change", Number(val.replaceAll(",", "")));
      },
      handleBlur(e) {
        this.inputing = false;
        this.depositForm.transactionAmount = formatMoney(
          inputNumber(e.target.value),
          this.format
        );
        this.$emit("blur", e);
      },
      handleFocus(e) {
        this.inputing = true;
        this.depositForm.transactionAmount = inputNumber(
          this.depositForm.transactionAmount
        );
        this.$emit("focus", e);
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
