<template>
  <div style="padding: 30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div>
          <span style="font-size: 16px">身份证号</span>
          <el-input v-model="IdNumber" placeholder="请先输入身份证号" style="width:300px;"></el-input>
          <el-button @click="search" class="my-btn" type="primary">查询</el-button>
        </div>
      </div>
      <div class="contend">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="contractId" label="合约编号"></el-table-column>
          <el-table-column prop="contractName" label="合约名称"></el-table-column>
          <el-table-column prop="contractStatus" label="合约状态"></el-table-column>
          <el-table-column prop="operate" label="操作">
            <template slot-scope="scope">
            <el-button @click="sign(scope.row,1)" type="primary" v-if="">开通</el-button>
            <el-button @click="sign(scope.row,0)" type="danger" v-if="">解约</el-button>
            </template>
          </el-table-column>
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
        headers: {
          token: localStorage.getItem("token")
        },
        IdNumber: '',
        tableData: [], //表格数据
      };
    },
    computed: {

    },
    created: function() {

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
        if (this.IdNumber == "") {
          this.$message({
            type: "warning",
            message: "请输入客户身份证号",
          });
        } else {
          let that = this
          $.ajax({
            type: 'post',
            url: 'http://localhost:8088/',
            contentType: 'application/json',
            data: JSON.stringify({
              flag: '2',
              IdNumber: that.IdNumber,
              pageNum: that.pageNum,
              pageSize: that.pageSize,
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
                  message: "未找到身份证号相关信息",
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
      sign(row,flag) {
        if (this.IdNumber == "") {
          this.$message({
            type: "warning",
            message: "请输入客户身份证号",
          });
        } else {
          let that = this
          $.ajax({
            type: 'post',
            url: 'http://localhost:8088/',
            contentType: 'application/json',
            data: JSON.stringify({
              flag: flag,
              IdNumber: that.IdNumber,
              pageNum: that.pageNum,
              pageSize: that.pageSize,
            }),
            dataType: 'json',
            success: function(data) {
              if (data.msg == "true") {
                that.$message({
                  type: "success",
                  message: "操作成功",
                });
              } else {
                that.$message({
                  type: "warning",
                  message: "未找到相关信息",
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
