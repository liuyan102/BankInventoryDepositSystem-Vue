<template>
  <div>
    <el-row :gutter="20" style="padding: 20px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>发卡量</span>
            <el-tag type="warning" style="float: right;">总</el-tag>
          </div>
          <div class="content">
            <span> {{ dataForm.bankCardCount }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>交易笔数</span>
            <el-tag type="success" style="float: right;">月</el-tag>
          </div>
          <div class="content">
            <span> {{ dataForm.transactionCount }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>当前现金余额</span>
            <el-tag style="float: right;">日</el-tag>
          </div>
          <div class="content">
            <font slot="prefix">￥</font>
            <span> {{ dataForm.balance }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header">
            <span>活期储蓄利率</span>
            <el-tag style="float: right;">日</el-tag>
          </div>
          <div class="content">
            <span> {{ dataForm.benchmarkInterestRate|InterestRate }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="padding: 20px;margin-top:50px">
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header">
            <span>存取款情况</span>
            <el-tag type="success" style="float: right;">月</el-tag>
          </div>
          <div class="chart1" style="width:auto;height:auto;">
            <div id="depositAndWithdraw" style="width:100%;height:400px;float:left;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">
            <span>存取款占比</span>
            <el-tag type="success" style="float: right;">月</el-tag>
          </div>
          <div class="chart2" style="width:auto;height:auto;">
            <div id="depositAndWithdrawProportion" style="width:100%;height:400px;float:left;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import $ from "jquery";
  import echarts from 'echarts'
  export default {
    filters:{
      InterestRate(value){
        let result = (value*100).toFixed(2)+"%";
        return result;
      }
    },
    data() {
      return {
        dataForm: {
          bankCardCount: '5456165',
          transactionCount: '1556',
          balance: '146516156',
          benchmarkInterestRate: '0.35%',
        },
      };
    },
    created() {
      this.getBankDataInfo();
    },
    mounted() {
      this.drawChart1();
      this.drawChart2();
    },
    methods: {
      //获取信息
      getBankDataInfo() {
        let that = this;
        var nowDate = new Date();
        $.ajax({
          type: "post",
          url: "http://localhost:8088/getBankDataInfo",
          contentType: "application/json",
          data: JSON.stringify({
            nowDate: nowDate,
          }),
          dataType: "json",
          success: function(data) {
            console.log(data);
            that.dataForm = data;
            that.drawChart2(data.depositSum,data.withdrawalSum);
            that.drawChart1(data.depositAndWithdrawals);
          },
          fail: function(data) {
            alert("数据读取失败");
          },
        });
      },
      //画饼图
      drawChart2(depositSum,withdrawalSum) {
        let that = this;
        var myChart = that.$echarts.init(document.getElementById('depositAndWithdrawProportion'));
        myChart.clear();
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            bottom: 'bottom',
            data: ['取款', '存款'],
          },
          color: ['#0676ee', '#00c1de'],
          series: [{
              name: '交易数据',
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              data: [{
                name: '取款',
                value: withdrawalSum
              }, {
                name: '存款',
                value: depositSum
              },],
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

      //画柱状图
      drawChart1(depositAndWithdrawals) {
        let that = this;
        var myChart = that.$echarts.init(document.getElementById('depositAndWithdraw'));
        myChart.clear();
        var getDeposit = [];//存款
        var getWithdrawal = [];//取款
        var getDate = [];//日期
        for(var i = 0;i < depositAndWithdrawals.length;i++){
          getDeposit.push(depositAndWithdrawals[i].deposit);
          getWithdrawal.push(depositAndWithdrawals[i].withdrawal);
          getDate.push(depositAndWithdrawals[i].reallyTime);
        }
        var option = {
          tooltip: { //设置tip提示
            trigger: 'axis'
          },
          legend: {
            data: ['取款', '存款']
          },
          color: ['#29b6e0', '#e0674f'], //设置区分（每条线是什么颜色，和 legend 一一对应）
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
              name: '取款',
              data: getWithdrawal,
              type: 'bar', // 类型为柱状图图
              barWidth: '20%',
            },
            {
              name: '存款',
              data: getDeposit,
              type: 'bar', // 类型为柱状图
              barWidth: '20%',
            },
          ]
        };
        myChart.setOption(option);
      }
    },
  };
</script>

<style>
  .el-card__header {
    padding: 15px;
    font-size: 18px;
  }

  .content {
    height: 50px;
  }
</style>
