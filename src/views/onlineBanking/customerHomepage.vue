<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <el-row>
            <el-col :span="4">
              <el-avatar :size="120" :src="require('../../assets/head.png')">
              </el-avatar>
              <el-divider direction="vertical" class="divider1"></el-divider>
            </el-col>
            <el-col :span="8">
              <span style="font-size: 24px; font-weight: 600;">
                欢迎您, {{ dataForm.name }}先生
              </span>
              <p></p>
              <span style="font-size: 17px;">
                手机号码：{{ dataForm.phoneNumber|phone }}
              </span>
              <br />
              <span style="font-size: 17px;">
                上次登录：{{ dataForm.lastLoginTime }}
              </span>
            </el-col>
            <el-col :span="12">
              <!-- <img class="logo" src="../../assets/logo2.png" /> -->
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="12">
              <div class="chart1" style="width:auto;height:auto;">
                <div id="balanceChart" style="width:100%;height:400px;float:left;"></div>
              </div>
            </el-col>
            <el-col :span="1">
              <el-divider direction="vertical" class="divider2"></el-divider>
            </el-col>
            <el-col :span="11">
              <span style="font-size: 18px;font-weight: 700;">账户资产概览</span>
              <span class="show-balance" @click="changeShowType">
                <svg-icon :icon-class="showBalnce=== false ? 'eye' : 'eye-open'" />
              </span>
              <div class="personal-relation" style="margin-top: 50px;">
                <div class="relation-item">
                  账户状态:
                  <div style="float: right; padding-right: 20px">
                    {{ dataForm.accountCurrentStatus }}
                  </div>
                </div>
              </div>
              <div class="personal-relation">
                <div class="relation-item">
                  银行卡号:
                  <div style="float: right; padding-right: 20px">
                    {{ dataForm.bankCardNumber|bankCard }}
                  </div>
                </div>
              </div>
              <div class="personal-relation">
                <div class="relation-item">
                  总余额:
                  <div style="float: right; padding-right: 20px" v-if="showBalnce">
                    {{ dataForm.bankBalance }}
                  </div>
                  <div style="float: right; padding-right: 20px" v-if="!showBalnce">
                    --.--
                  </div>
                </div>
              </div>
              <div class="personal-relation">
                <div class="relation-item">
                  可用余额:
                  <div style="float: right; padding-right: 20px" v-if="showBalnce">
                    {{ dataForm.availableBalance }}
                  </div>
                  <div style="float: right; padding-right: 20px" v-if="!showBalnce">
                    --.--
                  </div>
                </div>
              </div>
              <div class="personal-relation">
                <div class="relation-item">
                  冻结余额:
                  <div style="float: right; padding-right: 20px" v-if="showBalnce">
                    {{ dataForm.frozenBalance }}
                  </div>
                  <div style="float: right; padding-right: 20px" v-if="!showBalnce">
                    --.--
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="24">
              <div class="chart2" style="width:auto;height:auto;">
                <div id="incomeAndExpenditureStatementsChart" style="width:100%;height:400px;float:left;"></div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

    </el-row>
    <!-- <div id="main" style="width: 600px;height:400px;"></div> -->
  </div>
</template>

<script>
  import $ from "jquery";
  import echarts from 'echarts'
  export default {
    filters: {
      phone(value) {
        let start = value.slice(0, 3);
        let end = value.slice(-4);
        return start + '****' + end;
      },
      bankCard(value) {
        let start = value.slice(0, 4);
        let second = value.slice(15, 16);
        let end = value.slice(-3);
        return start + ' **** **** ***' + second + ' ' + end;
      }
    },
    data() {
      return {
        dataForm: {
          name: '',
          phoneNumber: '',
          lastLoginTime: '',
          bankCardNumber: '',
          bankBalance: '', //总余额
          availableBalance: '', //可用余额
          frozenBalance: '', //冻结余额
          accountCurrentStatus: '', //账户状态
          sex: '', //性别
          age: '', //年龄
          birth: '', //出生日期
          mail: '', //邮箱
          address: '', //家庭地址
        },
        idCardNumber: localStorage.getItem("idNumber"),
        showBalnce: false, //是否显示金额
      };
    },
    created() {
      this.getCustomerInfo();
    },
    mounted() {},
    methods: {
      //切换金额显示状态
      changeShowType() {
        if (this.showBalnce == true) {
          this.showBalnce = false;
        } else {
          this.showBalnce = true;
        }
      },
      //获取客户个人信息
      getCustomerInfo() {
        let that = this;
        var nowDate = new Date();
        $.ajax({
          type: "post",
          url: "http://localhost:8088/getCustomerAndAccountBalanceInfo",
          contentType: "application/json",
          data: JSON.stringify({
            idCardNumber: that.idCardNumber,
            nowDate: nowDate,
          }),
          dataType: "json",
          success: function(data) {
            that.dataForm = data;
            var infomation = that.getIdCardInfo(that.idCardNumber);
            that.dataForm.sex = infomation.sex;
            that.dataForm.age = infomation.age;
            that.dataForm.birth = infomation.birth;
            that.drawBalanceChart(data.availableBalance, data.frozenBalance, data.bankBalance);
            that.drawMonthBalanceChart(data.incomeAndExpenditureStatements);
          },
          fail: function(data) {
            alert("数据读取失败");
          },
        });
      },
      getIdCardInfo(idCard) {
        let sex = null;
        let birth = null;
        let myDate = new Date();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        let age = 0;
        if (idCard.length === 18) {
          age = myDate.getFullYear() - idCard.substring(6, 10) - 1;
          sex = idCard.substring(16, 17);
          birth = idCard.substring(6, 10) + "-" + idCard.substring(10, 12) + "-" + idCard.substring(12, 14);
          if (idCard.substring(10, 12) < month || idCard.substring(10, 12) === month && idCard.substring(12, 14) <= day)
            age++;
        }
        if (idCard.length === 15) {
          age = myDate.getFullYear() - idCard.substring(6, 8) - 1901;
          sex = idCard.substring(13, 14);
          birth = "19" + idCard.substring(6, 8) + "-" + idCard.substring(8, 10) + "-" + idCard.substring(10, 12);
          if (idCard.substring(8, 10) < month || idCard.substring(8, 10) === month && idCard.substring(10, 12) <= day)
            age++;
        }
        if (sex % 2 === 0)
          sex = '女'; //1代表男，0代表女
        else
          sex = '男';
        return {
          age,
          sex,
          birth
        }
      },
      //画余额饼图
      drawBalanceChart(availableBalance, frozenBalance, bankBalance) {
        let that = this;
        var myChart = that.$echarts.init(document.getElementById('balanceChart'));
        myChart.clear();
        var balance = [{
          name: '可用余额',
          value: availableBalance
        }, {
          name: '冻结余额',
          value: frozenBalance
        }, ];
        var totalBalance = [{
          name: '总余额',
          value: bankBalance
        }, ];
        var option = {
          title: {
            text: '活期储蓄账户余额', // 主标题
            subtext: '', // 副标题
            x: 'left' // x轴方向对齐方式
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            bottom: 'bottom',
            data: ['可用余额', '冻结余额', '总余额'],
          },
          color: ['#0676ee', '#00c1de', '#85fe6f'],
          series: [{
              name: '余额数据',
              type: 'pie',
              radius: ["40%", "55%"],
              center: ['45%', '50%'],
              data: balance,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              }
            },
            {
              name: '余额数据',
              type: 'pie',
              radius: ["15%", "30%"],
              center: ['45%', '50%'],
              data: totalBalance,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              }
            },
          ]
        };
        myChart.setOption(option);
      },

      //画30天余额折线图
      drawMonthBalanceChart(incomeAndExpenditureStatements) {
        let that = this;
        var myChart = that.$echarts.init(document.getElementById('incomeAndExpenditureStatementsChart'));
        myChart.clear();
        var getDate = [];
        var getIncome = [];
        var getExpenditure = [];
        var getProfit = [];
        for (var i = 0; i < incomeAndExpenditureStatements.length; i++) {
          getIncome.push(incomeAndExpenditureStatements[i].income);
          getExpenditure.push(incomeAndExpenditureStatements[i].expenditure);
          getProfit.push(incomeAndExpenditureStatements[i].profit)
          getDate.push(incomeAndExpenditureStatements[i].reallyTime);
        }
        var option = {
          title: {
            text: '账户近期收支情况', // 主标题
            subtext: '', // 副标题
            x: 'right' // x轴方向对齐方式
          },
          tooltip: { //设置tip提示
            trigger: 'axis'
          },
          legend: { //设置区分（哪条线属于什么）
            data: ['收入', '支出']
          },
          color: ['#29b6e0', '#e0674f', '#8AE09F'], //设置区分（每条线是什么颜色，和 legend 一一对应）
          xAxis: { //设置x轴
            type: 'category',
            boundaryGap: true, //坐标轴两边不留白
            data: getDate,
            name: '日期', //X轴 name
            nameTextStyle: { //坐标轴名称的文字样式
              color: '#000000',
              fontSize: 12,
              padding: [0, 0, 0, 20]
            },
            axisLine: { //坐标轴轴线相关设置。
              lineStyle: {
                color: '#000000',
              }
            }
          },
          yAxis: {
            name: '金额',
            nameTextStyle: {
              color: '#000000',
              fontSize: 12,
              padding: [0, 0, 10, 0]
            },
            axisLine: {
              lineStyle: {
                color: '#000000',
              }
            },
            type: 'value'
          },
          dataZoom: [{
            type: 'inside',
            show: true,
            // start: 0,
            // end: 30,
          }, ],
          series: [{
              name: '收入',
              data: getIncome,
              type: 'bar', // 类型为柱状图图
              barWidth: '20%',
            },
            {
              name: '支出',
              data: getExpenditure,
              type: 'bar', // 类型为柱状图
              barWidth: '20%',
            },
            {
              name: '利润',
              data: getProfit,
              type: 'line', // 类型为折线图
              lineStyle: { // 线条样式 => 必须使用normal属性
                normal: {
                  color: '#59e05d',
                }
              },
            },
          ]
        };
        myChart.setOption(option);
      }
    },
  };
</script>

<style lang="scss" scoped>
  //卡片样式
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 100%;
  }

  //文本样式区
  .name-role {
    font-size: 16px;
    padding: 5px;
    text-align: center;
  }

  .sender {
    text-align: center;
  }

  .registe-info {
    text-align: center;
    padding-top: 10px;
  }

  .personal-relation {
    font-size: 17px;
    padding: 0px 5px 15px;
    margin-right: 1px;
    width: 100%;
  }

  .relation-item {
    padding: 12px;
  }

  .dialog-footer {
    padding-top: 10px;
    padding-left: 10%;
  }

  //布局样式区
  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .el-divider--vertical {
    display: inline-block;
    margin: 0 8px;
    vertical-align: baseline;
    position: relative;
  }

  .divider1 {
    width: 1px;
    height: 120px;
  }

  .divider2 {
    width: 1px;
    height: 390px;
  }

  .show-balance:hover {
    cursor: pointer;
    color: #2baaff;
  }

  .logo {
    margin-left: 50px;
    width: 350px;
    height: 120px;
  }
</style>
