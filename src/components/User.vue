<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column prop="name" label="状态" width="70">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showFenpeiDialog(info.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>

      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色弹出框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="fenpeiDialogVisible"
        width="50%"
        top="185px"
        @close="fenpeiDialogClose"
      >
        <!-- :before-close="fenpeiDialogCloseBefore" -->
        <el-form
          :model="fenpeiForm"
          :rules="fenpeiFormRules"
          ref="fenpeiFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="当前的用户" prop="username">{{fenpeiForm.username}}</el-form-item>
          <el-form-item label="分配角色">
            <el-select v-model="fenpeiForm.rid" placeholder="请选择">
              <el-option
                v-for="item in roleInfos"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fenpeiDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="fenpeiRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  methods: {
    // 分配用户
    fenpeiDialogClose() {
      this.$refs.fenpeiFormRef.resetFields()
    },
    async fenpeiRole() {
      const { data: res } = await this.$http.put(
        'users/' + this.fenpeiForm.id + '/role',
        this.fenpeiForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.fenpeiDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getUserInfos()
    },

    async showFenpeiDialog(id) {
      this.fenpeiDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.mate.msg)
      }

      this.fenpeiForm = res.data

      const { data: res2 } = await this.$http.get('roles')
      if (res2.meta.status !== 200) {
        return this.$message.error(res2.mate.msg)
      }
      this.roleInfos = res2.data
    },

    // 修改   
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },

    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
    },

    // 删除
    delUser(id) {
      this.$confirm('确定要删除该会员吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          if (this.userInfos.length === 1 && this.queryParams.pagenum > 1) {
            this.queryParams.pagenum--
          }

          this.getUserInfos()
        })
        .catch(() => {})
    },

    // 添加
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }

          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },

    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getUserInfos()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getUserInfos()
    },
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.mate.msg)
      }

      this.queryParams.total = res.data.total
      this.userInfos = res.data.users
    }
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      }
      callback()
    }
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      fenpeiDialogVisible: false,
      // 分配角色
      roleInfos: [],
      fenpeiForm: {
        username: '',
        rid: ''
      },
      fenpeiFormRules: {
        rid: [{ required: true, message: '角色必须选择', trigger: 'change' }]
      },

      editForm: {
        username: '',
        email: '',
        mobile: ''
      },

      editFormRules: {
        mobile: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      userInfos: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 3,
        total: 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>

