<template>
  <div style="padding: 30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div>
          <span style="font-size: 16px">银行卡号</span>
          <el-input v-model="bankCardNumber" placeholder="请先输入银行卡号" style="width:300px;"></el-input>
        </div>
        <el-divider></el-divider>
        <div class="search">
          <span style="font-size: 16px;">业务类型</span>
          <el-select v-model="SearchLabel" placeholder="请选择业务类型">
            <el-option value="全部">全部</el-option>
            <el-option value="存款">存款</el-option>
            <el-option value="取款">取款</el-option>
            <el-option value="转账">转账</el-option>
            <el-option value="转账-手续费">转账-手续费</el-option>
            <el-option value="结息">结息</el-option>
          </el-select>
        </div>
        <div style="float: left;margin-left: 20px;">
          <span style="font-size: 16px;">时间段</span>
          <el-date-picker style="width: 400px" v-model="searchTime" type="daterange" align="right"
            value-format="yyyy-MM-dd" :clearable="false" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
          <el-button @click="search" class="my-btn" type="primary">查询</el-button>
        </div>
      </div>
      <div class="contend">
        <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'reallyTime', order: 'descending'}">
          <el-table-column prop="transactionId" label="交易流水"></el-table-column>
          <el-table-column prop="reallyTime" label="交易时间"></el-table-column>
          <el-table-column prop="businessType" label="业务类型"></el-table-column>
          <el-table-column prop="transactionAmount" label="交易金额（元）"></el-table-column>
          <el-table-column prop="paymentName" label="付款户名"></el-table-column>
          <el-table-column prop="paymentAccount" label="付款账户"></el-table-column>
          <el-table-column prop="receiveName" label="收款户名"></el-table-column>
          <el-table-column prop="receiveAccount" label="收款账户"></el-table-column>
          <el-table-column prop="currentBalance" label="当前余额（元）"></el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>
      <div class="bottom clearfix">
        <el-pagination style="margin-top:1%" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {
    bankAccountValid,
  } from "@/utils/validate";
  export default {
    data() {
      return {
        pageSize: 10, //页面大小
        pageNum: 1, //页码
        total: 5, //总行数
        keyword: "",
        headers: {
          token: localStorage.getItem("token")
        },
        bankCardNumber: '',
        pickerOptions: '',
        searchTime: [], //查询时间段
        tableData: [], //表格数据
        SearchLabel: '全部', //业务类型
        pickerOptions: { //快捷日期选择器
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate(time) {
            return time.getTime() < (Date.now() - 3600 * 1000 * 24 * 91) || time.getTime() > Date.now() //选择时间范围
          },
        },
      };
    },
    computed: {
      defaultDate() { //设置时间段默认值，30天前-今天
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.searchTime = [start, end];
      }
    },
    created: function() {
      this.defaultDate;
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val;
        this.search();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.search();
        console.log(`当前页: ${val}`);
      },
      search() {
        if (this.bankCardNumber == "") {
          this.$message({
            type: "warning",
            message: "请输入客户银行卡号",
          });
        } else {
          let that = this
          $.ajax({
            type: 'post',
            url: 'http://localhost:8088/getTradingWater',
            contentType: 'application/json',
            data: JSON.stringify({
              flag: '2',
              bankCardNumber: that.bankCardNumber,
              SearchLabel: that.SearchLabel,
              pageNum: that.pageNum,
              pageSize: that.pageSize,
              searchTime: that.searchTime,
            }),
            dataType: 'json',
            success: function(data) {
              if (data.msg == "true") {
                that.$message({
                  type: "success",
                  message: "查询成功",
                });
              } else {
                that.$message({
                  type: "warning",
                  message: "未找到银行卡号相关信息",
                });
              }
              that.total = data.pageInfo.total;
              that.tableData = data.pageInfo.list;

            },
            fail: function(data) {
              alert("数据读取失败")
            }
          })
        }
      },
    }
  };
</script>

<style scoped>
  .upload {
    width: 200px;
    margin: 20px;
    float: right;
  }

  .my-pic {
    width: 48px;
    height: 27px;
  }

  .search {
    float: left;
  }

  .contend {
    min-height: 425px;
  }

  .pagination {
    margin-top: 20px;
    margin-right: 50px;
    float: right;
  }


  .my-btn {
    margin-left: 50px;
  }
</style>
