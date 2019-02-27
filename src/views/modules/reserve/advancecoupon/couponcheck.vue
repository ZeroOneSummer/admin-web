<template>
  <div class="page-container">
    <div class="show-box" v-show="!switchForm">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label class="form-item">
            <el-input v-model.trim="q.couponNo" placeholder="请输入券批次号"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-select v-model="q.status" placeholder="请选择审核状态">
              <el-option
                v-for="item in statusList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="form-item">
            <el-date-picker
              v-model="value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="500"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="id" label="id" align="left" width="60"/>
          <el-table-column prop="couponNo" label="券批次号" align="left"/>
          <el-table-column prop="status" label="审核状态" align="left" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"/>
          <el-table-column prop="updateTime" label="审核时间" align="center"/>
          <el-table-column prop="updateUser" label="审核人" align="left" width="120"/>
          <el-table-column prop="rmk" label="审核意见" align="left"/>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="checkup(scope.$index, scope.row)">审查</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          :current-page="page.currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <div v-show="switchForm" class="form-section">
      <div class="panel">
        <span>{{panelTitle}}</span>
      </div>
      <div class="form-container">
        <el-form label-position="right" label-width="160px" :model="d">
          <el-form-item label="服务商名称">
            <el-input v-model="d.dealerName" disabled></el-input>
          </el-form-item>
          <el-form-item label="券名称">
            <el-input v-model="d.couponName" disabled></el-input>
          </el-form-item>
          <el-form-item label="券状态">
            <el-radio-group v-model="d.status">
              <el-radio label="0.5">待审核</el-radio>
              <el-radio label="1">有效</el-radio>
              <el-radio label="-0.5">审核驳回</el-radio>
              <el-radio label="-1">过期失效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="券类型">
            <el-select v-model="d.couponType" placeholder="选择券类型" disabled>
              <el-option
                v-for="item in coupons"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="券面额">
            <el-input v-model="d.price" disabled></el-input>
          </el-form-item>
          <el-form-item label="满多少可用">
            <el-input v-model="d.fullPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="券生效起始时间">
            <el-input v-model="d.startDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="券有效截止时间">
            <el-input v-model="d.endDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="券领取后有多少天失效">
            <el-input v-model="d.couponGetInvalidDay" disabled></el-input>
          </el-form-item>
          <el-form-item label="券初始化数量">
            <el-input v-model="d.couponNumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="每人获取次数上限">
            <el-input v-model="d.obtainLimit" disabled></el-input>
          </el-form-item>
          <el-form-item label="券获取方式">
            <el-select v-model="d.obtainType" placeholder="选择获取方式" disabled>
              <el-option
                v-for="item in obtains"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发券场景">
            <el-select v-model="d.sendType" placeholder="选择发券场景" disabled>
              <el-option
                v-for="item in sends"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="券限制条件">
            <el-input v-model="d.closeDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="券描述信息">
            <el-input type="textarea" v-model="d.description" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" v-model="d.rmk" :disabled="!flag" placeholder="备注信息"></el-input>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input v-model="d.loginPwd" :disabled="!flag" placeholder="登录密码"></el-input>
          </el-form-item>
          <el-form-item label="支付密码">
            <el-input v-model="d.payPwd" :disabled="!flag" placeholder="支付密码"></el-input>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-radio-group v-model="d.approvalStatus">
              <el-radio label="true">同意</el-radio>
              <el-radio label="false">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="submit-btn">
          <el-form>
            <el-form-item class="btn">
              <el-button type="primary" @click="onSubmit" :disabled="!flag">提交</el-button>
              <el-button type="warning" @click="reback">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog title="提示" :visible.sync="auditTip" width="20%" top="30vh">
        <span>确定提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="auditTip = false">取 消</el-button>
          <el-button type="primary" @click="auditConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { FormatAllDate, getTimeByType,formatDate } from "@/utils/timeUtils";
import { formatDateTime, isBlank } from "@/utils";
export default {
  data() {
    return {
      labelPosition: "right",
      q: {
        couponNo: "",
        status: "",
        startTime: "",
        endTime: ""
      },
      activeNames: [],
      tableData: [],
      statusList: [
        { id: 0, name: "待审核" },
        { id: 0.5, name: "已驳回" },
        { id: 1, name: "已通过" }
      ],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      value: [new Date(), new Date()],
      pickerOptions2: {
        shortcuts: [
          {
            text: "当日",
            onClick(picker) {
              const end = getTimeByType("CURRENTDAY").endTime;
              const start = getTimeByType("CURRENTDAY").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上日",
            onClick(picker) {
              const end = getTimeByType("YESTERODAY").endTime;
              const start = getTimeByType("YESTERODAY").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本周",
            onClick(picker) {
              const end = getTimeByType("CURRENTWEEK").endTime;
              const start = getTimeByType("CURRENTWEEK").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上周",
            onClick(picker) {
              const end = getTimeByType("PREWEEK").endTime;
              const start = getTimeByType("PREWEEK").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              const monthStart = new Date(
                start.getFullYear(),
                start.getMonth(),
                1
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [monthStart, end]);
            }
          },
          {
            text: "上月",
            onClick(picker) {
              const start = new Date();
              const monthStart = new Date(
                start.getFullYear(),
                start.getMonth(),
                1
              );
              const preMS = new Date(
                start.getFullYear(),
                start.getMonth() - 1,
                1
              );
              const preME = new Date(
                monthStart.getTime() - 60 * 60 * 24 * 1000
              );
              picker.$emit("pick", [preMS, preME]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      coupons: [
        { value: "0", name: "全额券" },
        { value: "1", name: "服务费券" },
        { value: "2", name: "预付款券" }
      ],
      obtains: [
        { value: "1", name: "用户领取" },
        { value: "2", name: "系统发放" }
      ],
      sends: [
        { value: "1", name: "注册发放" },
        { value: "2", name: "实名发放" },
        { value: "3", name: "升级商家等级发放" },
        { value: "4", name: "手动发券" }
      ],
      d: {},
      switchForm: false,
      panelTitle: "优惠券审核",
      flag: false,
      auditTip: false
    };
  },
  filters: {
    statusFilter(status) {
      switch (status) {
        case "0":
          return "info";
        case "1":
          return "success";
        case "0.5":
          return "danger";
        // case '-1' : return 'danger';
        default:
          return "info";
      }
    },
    formatStatus(status) {
      switch (status) {
        case "0":
          return "待审核";
        case "1":
          return "已通过";
        case "0.5":
          return "已驳回";
        // case '-1' : return '不通过';
        default:
          return "未知状态";
      }
    }
  },
  created() {
    this.query();
  },
  methods: {
    async query() {
      this.q.startTime = FormatAllDate(this.value[0]);
      this.q.endTime = formatDate(this.value[1]) + ' 23:59:59';
      let queryParams =
        "&couponNo=" +
        this.q.couponNo +
        "&status=" +
        this.q.status +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime;
      let r = await this._fetch(
        "/couponCheck/list?type=0&limit=10&page=1" + queryParams,
        {
          method: "GET"
        }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
      } else {
        console.log(r.msg)
      }
    },
    reset() {
      this.value = [new Date(), new Date()];
      this.q = {
        couponNo: "",
        status: "",
        startTime: FormatAllDate(this.value[0]),
        endTime: formatDate(this.value[1]) + ' 23:59:59'
      };
    },
    checkup(index, row) {
      this.switchForm = true;
      console.log(row);
      this.getInfo(row.couponNo);
      if (row.status != "0") {
        this.flag = false; //不可重复审核,只能查看
      } else {
        this.flag = true;
      }
    },
    async getInfo(id) {
      let r = await this._fetch("/couponCheck/info/" + id + "?_=123", {
        method: "GET"
      });
      if (r) {
        this.d = r.couponDetail;
        console.log(r);
      } else {
        this.$message(r.msg);
      }
    },
    onSubmit() {
      if (this.d.status != "0") {
        if (isBlank(this.d.loginPwd)) {
          this.$message("登录密码不能为空");
          return;
        } else if (isBlank(this.d.payPwd)) {
          this.$message("支付密码不能为空");
          return;
        }
      }
      if (!this.d.approvalStatus) {
        this.$message("请选择审核意见");
        return;
      }
      this.auditTip = true;
    },
    async auditConfirm() {
      let r = await this._fetch("/couponCheck/update", {
        method: "POST",
        body: this.d
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.auditTip = false;
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
    },
    reback() {
      this.switchForm = false;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/refundapply/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/refundapply/list?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    rowClass() {
      return "text-align:center";
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-box {
  padding-top: 15px;
}
form {
  border-bottom: 1px solid #ddd;
}
.form-container {
  width: 100%;
  form {
    border: none;
    padding-left: 40px;
    overflow: auto;
    .el-form-item.el-form-item--medium {
      padding-right: 40px;
      width: 50%;
      float: left;
    }
  }
}
.panel {
  position: relative;
  .el-button {
    position: absolute;
    right: 40px;
    top: 3px;
  }
}
.submit-btn {
  padding: 10px 150px;
}
</style>

