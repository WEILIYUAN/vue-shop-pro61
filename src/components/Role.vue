<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card区 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
      <el-table :data="roleInfos" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="info">
            <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="{'border-bottom':'1px solid #ebeef5','border-top': k===0?'1px solid #ebeef5':''}"
            >
              <el-col :span="5">
                <el-tag closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2,kk) in item.children"
                  :key="item2.id"
                  :style="{'border-top':kk!==0?'1px solid #ebeef5':''}"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="30"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column label="操作" width="330">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" size="mini" icon="el-icon-setting">分配权限</el-button>
        </el-table-column>
      </el-table>
      <!-- 添加用户弹层 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        top="185px"
        :before-close="addDialogCloseBefore"
        @close="addDialogClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleInfos()
  },
  methods: {
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.addDialogClose()
          this.getRoleInfos()
          if (res.meta.status === 201) {
            return this.$message.success(res.meta.msg)
          }
        }
      })
    },
    //添加角色  关闭按钮
    addDialogCloseBefore(done) {
      this.$refs.addFormRef.resetFields()
      done()
    },
    addDialogClose() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    async getRoleInfos() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleInfos = res.data
    }
  },
  data() {
    return {
      roleInfos: [],

      // 对话框
      addDialogVisible: false,

      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述信息', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
