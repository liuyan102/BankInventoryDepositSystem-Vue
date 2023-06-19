<template>
  <div style="padding: 30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="margin-top: 10px;">
        <div class="search">
          <span style="font-size: 16px;">业务类型</span>
          <el-select v-model="SearchLable" placeholder="请选择业务类型">
            <el-option value="全部">全部</el-option>
            <el-option value="库存现金(101001)">库存现金(101001)</el-option>
            <el-option value="客户活期存款(215001)">客户活期存款(215001)</el-option>
            <el-option value="应付利息(260001)">应付利息(260001)</el-option>
            <el-option value="利息支出(640002)">利息支出(640002)</el-option>
            <el-option value="手续费收入(606003)">手续费收入(606003)</el-option>
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
        <el-table :data="tableData" style="width: 100%" :default-sort="{ prop: 'generalLedgerType'}">
          <el-table-column prop="generalLedgerDate" label="总账日期"></el-table-column>
          <el-table-column prop="branch" label="机构编号"></el-table-column>
          <el-table-column prop="generalLedgerType" label="总账类型"></el-table-column>
          <el-table-column prop="earlyDebitBalance" label="初期借方余额（元）"></el-table-column>
          <el-table-column prop="earlyCreditBalance" label="初期贷方余额（元）"></el-table-column>
          <el-table-column prop="currentDebitAmount" label="本期借方发生额（元）"></el-table-column>
          <el-table-column prop="currentCreditAmount" label="本期贷方发生额（元）"></el-table-column>
          <el-table-column prop="theEndOfTheDebitBalance" label="期末借方余额（元）"></el-table-column>
          <el-table-column prop="theEndOfTheCreditBalance" label="期末贷方余额（元）"></el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>
      <div class="bottom clearfix">
        <el-pagination style="margin-top: 1%" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import $ from "jquery";
  export default {
    data() {
      return {
        pageSize: 5, //页面大小
        pageNum: 1, //页码
        total: 5, //总行数
        keyword: "",
        headers: {
          token: localStorage.getItem("token"),
        },
        pickerOptions: "",
        searchTime: [], //查询时间段
        tableData: [], //表格数据
        SearchLable: "全部", //业务类型
        pickerOptions: {
          //快捷日期选择器
          shortcuts: [{
              text: "最近一周",
              onClick(picker) {
                let stringDate = localStorage.getItem("systemDate")
                const end = new Date(stringDate)
                const start = new Date(stringDate)
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit("pick", [start, end])
              },
            },
            {
              text: "最近一个月",
              onClick(picker) {
                let stringDate = localStorage.getItem("systemDate")
                const end = new Date(stringDate)
                const start = new Date(stringDate)
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              },
            },
            {
              text: "最近三个月",
              onClick(picker) {
                let stringDate = localStorage.getItem("systemDate")
                const end = new Date(stringDate)
                const start = new Date(stringDate)
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              },
            },
          ],
          disabledDate(time) {
            let stringDate = localStorage.getItem("systemDate")
            const start = new Date(stringDate)
            return time.getTime() < (start - 3600 * 1000 * 24 * 91) || time.getTime() > start //选择时间范围
          },
        },
      };
    },
    computed: {},
    created() {
      this.defultTime();
    },
    mounted() {
      this.search(); //查询总账列表
    },
    methods: {
      defultTime() {
        let stringDate = localStorage.getItem("systemDate")
        const end = new Date(stringDate)
        const start = new Date(stringDate)
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.searchTime = [start, end];
      },
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
        let that = this;
        $.ajax({
          type: "post",
          url: "http://localhost:8088/totalAccountFlowInquiry",
          contentType: "application/json",
          data: JSON.stringify({
            SearchLable: that.SearchLable,
            pageNum: that.pageNum,
            pageSize: that.pageSize,
            searchTime: that.searchTime,
          }),
          dataType: "json",
          success: function(data) {
            that.total = data.total;
            that.tableData = data.list;
            that.$message({
              type: "success",
              message: "查询成功",
            });
          },
          fail: function(data) {
            alert("数据读取失败");
          },
        });
      },
    },
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
    min-height: 510px;
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
