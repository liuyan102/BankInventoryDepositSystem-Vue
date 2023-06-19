<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="font-size: 18px;">客户转账</span>
    </div>
    <div style="margin-left: 200px;">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form id="form" ref="transferFormRef" :model="transferForm" :rules="FormRules" class="demo-ruleForm"
             label-width="120px">
            <el-form-item label="付款银行卡号" prop="paymentAccount">
              <el-input readonly v-model="transferForm.paymentAccount" />
              <span class="sender">{{ bankInfo }}</span>
            </el-form-item>
            <el-form-item label="收款银行卡号" prop="receiveAmountAccount">
              <el-input v-model="transferForm.receiveAmountAccount" oninput="value=value.replace(/[^\d]/g,'')"
                @blur="getName"></el-input>
            </el-form-item>
            <el-form-item label="收款人姓名" prop="receiveAmountName">
              <el-input readonly v-model="transferForm.receiveAmountName"></el-input>
            </el-form-item>
            <el-form-item label="转账方式" prop="transferMethod">
              <el-input v-model="transferForm.transferMethod" disabled></el-input>
            </el-form-item>
            <el-form-item label="转账金额" prop="transferAmount">
              <el-input v-model="transferForm.transferAmount" v-bind="$attrs" :maxlength="maxlength"
                @input="handleInput" @focus="handleFocus" @blur="handleBlur" @change="handleChange"
                oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  <slot name="append"></slot>
                </template>
                <font slot="prefix">￥</font>
              </el-input>
              <span class="sender">手续费：{{ transferForm.handingFee}} 元</span>
            </el-form-item>

            <el-form-item label="交易密码" prop="transactionPassword">
              <el-input maxlength="6" auto-complete="new-password" show-password
                v-model="transferForm.transactionPassword" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="margin-left: 80%" type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
          <div style="margin-left: 10%; margin-top: 15%">
            <label
              style="font-size: 20px">*温馨提示请勿轻易向陌生收款人转账，请勿相信以兼职、投资为借口或假冒客服、公检法、熟人等骗局，请仔细核实收款方信息，谨防受骗,如有疑问请咨询95533。</label>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
  import $ from "jquery";
  import {
    inputNumber
  } from "@/utils/inputNumber";
  import {
    formatMoney
  } from "@/utils/formatMoney";
  import {
    bankAccountValid,
    transactionPasswordVerification,
    transactionAmountVerification,
    selectItemVerification,
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
        IdNumber: localStorage.getItem("idNumber"),
        bankInfo: '',
        transferForm: {
          handingFee: '0',
          paymentAccount: "", //付款账户
          receiveAmountName: "", //收款户名
          receiveAmountAccount: "", //收款账号
          receiveAmountBank: 'xx银行', //收款银行
          transferMethod: '实时转账', //转账方式
          transferAmount: "", //转账金额
          transactionPassword: "", //交易密码
        },

        FormRules: {
          paymentAccount: [{
            required: true,
            trigger: "blur",
            message: "未找到银行卡信息"
          }],
          receiveAmountName: [{
            required: true,
            trigger: "blur",
            message: "收款账户不存在"
          }],
          receiveAmountBank: [{
            required: true,
            trigger: "blur",
            validator: selectItemVerification,
          }, ],
          transferMethod: [{
            required: true,
            trigger: "blur"
          }],
          transferAmount: [{
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
          receiveAmountAccount: [{
              required: true,
              trigger: "blur",
              validator: bankAccountValid
            },
            {
              required: true,
              trigger: "blur",
              validator: (rule, value, callback) => {
                let account = this.transferForm.paymentAccount;
                if (account == value) {
                  callback(new Error("收款账户不能为本人账户"));
                } else {
                  callback();
                }
              }
            },
          ],
          transactionPassword: [{
            required: true,
            trigger: "blur",
            validator: transactionPasswordVerification,
          }, ],
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
            this.transferForm.transferAmount = n;
            return;
          }
          if (this.inputing) {
            this.transferForm.transferAmount = n;
          } else {
            this.transferForm.transferAmount = formatMoney(
              inputNumber(n.toString()),
              this.format
            );
          }
        },
      },
    },
    created: function() {
      this.getBankInfo();
      this.defaultForm = this.transferForm;
    },
    methods: {
      getName() {
        let that = this;
        $.ajax({
          type: "post",
          url: "http://localhost:8088/getReceiveName",
          contentType: "application/json",
          data: JSON.stringify({
            bank: that.transferForm.receiveAmountBank,
            account: that.transferForm.receiveAmountAccount
          }),
          dataType: "json",
          success: function(data) {
            if (data.name == null) {
              that.transferForm.receiveAmountName=""
              that.$message({
                type: "warning",
                message: "未找到该账户",
              })
            } else {
              console.log(data.name)
              that.transferForm.receiveAmountName = data.name;
            }
          },
          fail: function(data) {

          },
        });
      },
      getBankInfo() {
        let that = this;
        $.ajax({
          type: "post",
          url: "http://localhost:8088/getAccountInformation",
          contentType: "application/json",
          data: JSON.stringify({
            IdNumber: localStorage.getItem("idNumber"),
          }),
          dataType: "json",
          success: function(data) {
            that.transferForm.paymentAccount = data.bankNumber;
            that.bankInfo = data.bankInfo;
          },
          fail: function(data) {

          },
        });
      },
      submit() {
        this.$refs.transferFormRef.validate((valid) => {
          if (valid) {
            this.$confirm("是否要进行转账?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                let that = this;
                this.transferForm.transferAmount = this.transferForm.transferAmount.replaceAll(",", "");
                $.ajax({
                  type: "post",
                  url: "http://localhost:8088/transferRequestFeedback",
                  contentType: "application/json",
                  data: JSON.stringify(
                    that.transferForm
                  ),
                  dataType: "json",
                  success: function(data) {
                    that.transferForm = that.defaultForm;
                    if (data.success=="true") {
                      that.$message({
                        type: "success",
                        message: data.msg,
                      });
                      setTimeout(()=>{
                      	location.reload()
                      },2000)
                    } else {
                      that.$message({
                        type: "error",
                        message: data.msg,
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
        this.transferForm.transferAmount = money;
        let value = "";
        if (money === "-" || money === ".") {
          value = "";
        } else if (money !== "") {
          value = Number(inputNumber(money));
        }
        this.$emit("input", value);
      },
      handleChange(val) {
        this.inputing = true;
        this.$emit("change", Number(val.replaceAll(",", "")));
      },
      handleBlur(e) {
        this.inputing = false;
        this.transferForm.transferAmount = formatMoney(
          inputNumber(e.target.value),
          this.format
        );
        this.transferForm.handingFee = parseFloat((e.target.value * 0.005)).toFixed(2)
        if (this.transferForm.handingFee > 50) {
          this.transferForm.handingFee = 50.00
        }
        this.$emit("blur", e);
      },
      handleFocus(e) {
        this.inputing = true;
        this.transferForm.transferAmount = inputNumber(
          this.transferForm.transferAmount
        );
        this.$emit("focus", e);
      },
    },
  };
</script>

<style scoped>
  body {
    font-size: 30px;
  }

  .choose-color {
    z-index: 9999;
  }

  .line {
    text-align: center;
  }

  .img-wrap {
    width: 100%;
    height: 500px;
    margin-left: 68px;
  }

  .box {
    width: 220px !important;
  }

  .sender {
    font-size: 15px;
    float: right;
    color: grey;
  }

  .select-style {
    width: 100%;
  }
</style>
