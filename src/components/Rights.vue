<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="rightsInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="authName" label="名称"></el-table-column>
        <el-table-column prop="path" label="路径" width="120"></el-table-column>
        <el-table-column prop="level" label="等级" width="130">
          <template slot-scope="info">
            <el-tag v-if="info.row.level == 0">一级</el-tag>
            <el-tag v-else-if="info.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsInfo()
  },
  methods: {
    async getRightsInfo() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsInfos = res.data
    }
  },
  data() {
    return {
      rightsInfos: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
