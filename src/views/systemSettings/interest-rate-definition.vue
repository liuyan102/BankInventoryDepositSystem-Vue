<template>
  <div style="padding: 30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="margin-top: 10px;">
        <div class="search">
          <span style="font-size: 16px">利率类型</span>
          <el-select v-model="SearchLable" placeholder="请选择利率类型">
            <el-option value="全部">全部</el-option>
            <el-option value="活期储蓄">活期储蓄</el-option>
          </el-select>
          <span style="font-size: 16px;margin-left: 10px;">利率代码</span>
          <el-input style="width:200px;" placeholder="请输入想要搜索的利率代码" v-model="interestRateCode"></el-input>
          <el-button style="margin-top:-5%" @click="search" class="my-btn" type="primary">查询</el-button>
        </div>
      </div>
      <div class="contend">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="interestRateCode" label="利率代码"></el-table-column>
          <el-table-column prop="currency" label="币种"></el-table-column>
          <el-table-column prop="effectiveDate" label="生效日期"></el-table-column>
          <el-table-column prop="failureDate" label="失效日期"></el-table-column>
          <el-table-column prop="interestRateType" label="利率类型"></el-table-column>
          <el-table-column prop="benchmark" label="基准天数(天)"></el-table-column>
          <el-table-column prop="benchmarkInterestRate" label="基准利率"></el-table-column>
          <el-table-column prop="updated" label="更新日期"></el-table-column>
          <el-table-column prop="updateOperator" label="更新操作员"></el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
          <el-table-column prop="operation" label="操作">
            <template slot-scope="scope">
              <el-button @click="updata(scope.row)">更改</el-button>
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
    <el-dialog title="利率更改" :visible.sync="dialogVisible" width="43%">
      <el-form ref="interestRateUpdataFormRef" :model="interestRateUpdataForm" :rules="FormRules" label-width="120px"
        style="width: 100%">
        <el-row style="width:1400px">
          <el-col :span="6">
            <el-form-item label="利率代码" prop="interestRateCode">
              <el-input readonly v-model="interestRateUpdataForm.interestRateCode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="币种" prop="currency">
              <el-input v-model="interestRateUpdataForm.currency" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="有效期" prop="effectiveDate">
          <el-date-picker style="width:400px" v-model="effectivedate" type="daterange" value-format="yyyy-MM-dd"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-row style="width:1400px">
          <el-col :span="6">
            <el-form-item label="利率类型" prop="interestRateType">
              <el-select v-model="interestRateUpdataForm.interestRateType">
                <el-option value="活期储蓄">活期储蓄</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="基准天数" prop="benchmark">
              <el-input v-model="interestRateUpdataForm.benchmark" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="width:1400px">
          <el-col :span="6">
            <el-form-item label="基准利率" prop="benchmarkInterestRate">
              <el-input v-model="interestRateUpdataForm.benchmarkInterestRate" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="更新时间" prop="updated">
              <el-input readonly v-model="interestRateUpdataForm.updated" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="width:1400px">
          <el-col :span="6">
            <el-form-item label="更新操作员" prop="updateOperator">
              <el-input v-model="interestRateUpdataForm.updateOperator" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="interestRateUpdataForm.remark" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item style="margin-top:20px;">
            <el-button type="primary" @click="submit" style="float: right;margin-right: 10px;">确 定</el-button>
            <el-button @click="dialogVisible = false" style="float: right;margin-right: 10px;">取 消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'
  import Moment from 'moment'
  export default {
    data() {
      return {
        dialogVisible: false, //利率更改对话框，默认为隐藏
        pageSize: 5, //页面大小
        pageNum: 1, //页码
        total: 5, //总行数
        keyword: "",
        headers: {
          token: localStorage.getItem("token")
        },
        tableData: [], //表格数据
        SearchLable: '全部', //业务类型
        interestRateCode: '', //利率代码
        effectivedate: '',
        interestRateUpdataForm: {
          interestRateCode: '',
          currency: '',
          effectiveDate: '',
          failureDate: '',
          interestRateType: '',
          benchmark: '',
          benchmarkInterestRate: '',
          updated: '',
          updateOperator: '',
          remark: '',
        },
        FormRules: {},
      }
    },
    created: function() {
      this.search();
    },
    mounted: function() {

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
      valueToPercent(value) {
        value = value + '';
        const pointIndex = value.indexOf('.');
        if (pointIndex === -1) return (value - 0) * 100;
        const powIndex = value.length - pointIndex - 1;
        return (value.replace('.', '') - 0) * Math.pow(10, 2 - powIndex);
      },
      search() {
        console.log(this.SearchLable)
        let that = this
        $.ajax({
          type: 'post',
          url: 'http://localhost:8088/getInterestRateList',
          contentType: 'application/json',
          data: JSON.stringify({
            SearchLable: that.SearchLable, //业务类型
            pageNum: that.pageNum, //页码
            pageSize: that.pageSize, //页面大小
            interestRateCode: that.interestRateCode //利率代码
          }),
          dataType: 'json',
          success: function(data) {
            that.$message({
              type: "success",
              message: "查询成功",
            });
            that.total = data.total;
            that.tableData = data.list;

          },
          fail: function(data) {
            alert("数据读取失败")
          }
        })
      },
      updata(scope) {
        this.interestRateUpdataForm = scope;
        this.interestRateUpdataForm.updated = localStorage.getItem("systemDate");
        let start = scope.effectiveDate
        let end = scope.failureDate
        this.effectivedate = [start, end];
        this.dialogVisible = true;
      },
      submit() {
        this.interestRateUpdataForm.effectiveDate = this.effectivedate[0]
        this.interestRateUpdataForm.failureDate = this.effectivedate[1]
        this.$refs.interestRateUpdataFormRef.validate((valid) => {
          if (valid) {
            this.$confirm("是否要进行更改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                let that = this;
                $.ajax({
                  type: "post",
                  url: "http://localhost:8088/updateInterestRateDefinition",
                  contentType: "application/json",
                  data: JSON.stringify(that.interestRateUpdataForm),
                  dataType: "json",
                  success: function(data) {
                    if (data.success == "true") {
                      that.$message({
                        type: "success",
                        message: "更改成功",
                      });
                    } else {
                      that.$message({
                        type: "error",
                        message: "更改失败",
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
        this.dialogVisible = false;

      }

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
    min-height: 500px;
  }

  .pagination {
    margin-top: 20px;
    margin-right: 50px;
    float: right;
  }

  .search-by-time {
    margin-top: 20px;
  }

  .my-btn {
    margin-top: 20px;
    margin-left: 50px;
  }
</style>
