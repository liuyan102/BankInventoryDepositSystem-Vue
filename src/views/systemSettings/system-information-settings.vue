<template>
  <div style="padding: 30px;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">系统设置</span>
      </div>
      <div class="contend">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form ref="SystemInfoFormRef" :model="SystemInfoForm" :rules="FormRules" class="demo-ruleForm"
              label-width="200px" style="width: 600px;margin-top: 50px;">
              <el-form-item label="系统编号" prop="systemNumber">
                <el-input v-model="SystemInfoForm.systemNumber" readonly></el-input>
              </el-form-item>
              <el-form-item label="系统名称" prop="systemName">
                <el-input v-model="SystemInfoForm.systemName" readonly></el-input>
              </el-form-item>
              <el-form-item label="当前系统日期" prop="currentSystemDate">
                <el-input v-model="SystemInfoForm.currentSystemDate" readonly></el-input>
              </el-form-item>
              <el-form-item label="上一日期" prop="lastDay">
                <el-input v-model="SystemInfoForm.lastDay" readonly></el-input>
              </el-form-item>
              <el-form-item label="下一日期" prop="nextDay">
                <el-input v-model="SystemInfoForm.nextDay" readonly></el-input>
              </el-form-item>
              <el-form-item label="日切时间" prop="complimentaryTime">
                <el-time-picker v-model="SystemInfoForm.complimentaryTime" placeholder="日切时间" value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="日切状态" prop="comparativeState">
                <el-select v-model="SystemInfoForm.comparativeState">
                  <el-option value="启用">启用</el-option>
                  <el-option value="停用">停用</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结息日" prop="settlementDay">
                <el-select v-model="SystemInfoForm.settlementDay" placeholder="请选择结息日" :style="{ width: '200px' }">
                  <el-option v-for="item in days" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>

                <el-button style="margin-left: 80%" type="primary" @click="submit()">更改</el-button>
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
  export default {
    data() {
      return {
        days: [],
        SystemInfoForm: {
          systemNumber: "",
          systemName: "",
          currentSystemDate: "",
          lastDay: "",
          nextDay: "",
          complimentaryTime: "",
          comparativeState: "启用",
          settlementDay: '',
        },
        FormRules: {
          complimentary_time: [{
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入日切时间"));
              } else {
                callback();
              }
            },
          }, ],
        },
      };
    },
    created: function() {},
    mounted() {
      //页面创建时自动执行
      this.initDay();
      this.getSystemInfo();
    },
    methods: {
      initDay() {
        for (var i = 1; i <= 30; i++) {
          this.days.push({
            value: i,
            label: i
          });
        }
      },

      submit() {
        this.$refs.SystemInfoFormRef.validate((valid) => {
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
                  url: "http://localhost:8088/updateSystemMessage",
                  contentType: "application/json",
                  data: JSON.stringify({
                    complimentaryTime: that.SystemInfoForm.complimentaryTime,
                    comparativeState: that.SystemInfoForm.comparativeState,
                    settlementDay: that.SystemInfoForm.settlementDay
                  }),
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
                  message: "已取消更改",
                });
              });
          }
        });
      },
      //打开页面时获取系统信息，并反显在前端
      getSystemInfo() {
        let that = this;
        $.ajax({
          type: "post",
          url: "http://localhost:8088/getSystemInfo",
          contentType: "application/json",
          data: JSON.stringify({}),
          dataType: "json",
          success: function(data) {
            console.log(data)
            that.SystemInfoForm = data;
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
  #changeContab /deep/ #tab-0 {
    display: none;
  }

  #changeContab /deep/ #tab-5 {
    display: none;
  }

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
