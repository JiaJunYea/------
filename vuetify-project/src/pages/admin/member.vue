<template>
  <v-container>
    <v-row>

      <!-- 主體內容 -->
      <v-col cols="9">
        <!-- 新增共同管理員頁面 -->
        <div v-if="page === 'addCoAdmin'">
          <v-card>
            <v-card-title>新增共同管理員</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="coAdminAccount"
                label="會員帳號"
                outlined
                required
              />
              <v-btn color="primary" @click="addCoAdmin">新增</v-btn>
            </v-card-text>
          </v-card>
        </div>

        <!-- 修改會員頁面 -->
        <div v-if="page === 'editMember'">
          <v-card>
            <v-card-title>修改會員</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="editMember.username"
                label="會員姓名"
                outlined
                required
                :rules="[rules.required]"
              />
              <v-text-field
                v-model="editMember.name"
                label="會員帳號"
                outlined
                required
                :rules="[rules.required]"
              />
              <v-btn color="primary" @click="editMemberInfo">更新會員資料</v-btn>
            </v-card-text>
          </v-card>
        </div>

        <!-- 刪除會員頁面 -->
        <div v-if="page === 'deleteMember'">
          <v-card>
            <v-card-title>刪除會員</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="deleteMember.username"
                label="會員帳號"
                outlined
                required
                :rules="[rules.required]"
              />
              <v-btn color="red" @click="deleteMemberInfo">刪除會員</v-btn>
            </v-card-text>
          </v-card>
        </div>

        <!-- 會員管理頁面 -->
        <div v-if="page === 'memberManagement'">
          <v-card>
            <v-card-title>會員管理</v-card-title>
            <v-card-text>
              <v-data-table
                class="elevation-1"
                :headers="headers"
                item-key="id"
                :items="users"
              >
                <template #item.actions="{ item }">
                  <v-btn :color="item.role == 'admin'? 'green':'blue'" @click="editMemberForm(item)">
                    {{ item.role }}
                  </v-btn>
                  <v-btn color="red" @click="deleteMemberForm(item)">
                    刪除
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import userService from '@/services/user'

  // 頁面狀態
  const page = ref('memberManagement')
  const users = ref([])

  const createSnackbar = useSnackbar()

  // 新增共同管理員
  const coAdminAccount = ref('')
  const valid = ref(false)

  // 會員資料
  const member = reactive({
    name: '',
    username: '',
  })

  const editMember = reactive({
    username: '',
    name: '',
  })

  const deleteMember = reactive({
    username: '',
    name: '',
  })

  const members = ref([])

  const headers = [
    { title: '帳號', align: 'start', key: 'username' },
    // { text: '角色', align: 'start', key: 'role' },
    { title: '操作', align: 'end', key: 'actions' },
  ]

  // 驗證規則
  const rules = {
    required: value => !!value || '此欄位為必填',
    username: value =>
      /^[a-zA-Z0-9_]{3,}$/.test(value) || '帳號至少包含 3 個字母或數字',
  }

  // 方法區

  const addCoAdmin = () => {
    if (!coAdminAccount.value) {
      alert('請輸入會員帳號')
      return
    }
    alert(`已將 ${coAdminAccount.value} 設為共同管理員`)
    coAdminAccount.value = ''
  }

  const submitForm = () => {
    if (valid.value) {
      alert('會員新增成功！')
      console.log('新增會員資料:', member)
      member.name = ''
      member.username = ''
    }
  }

  const editMemberInfo = () => {
    if (!editMember.username) {
      alert('請輸入會員帳號')
      return
    }
    alert(`已更新會員資料: ${editMember.username}`)
    editMember.username = ''
    editMember.name = ''
  }

  const deleteMemberInfo = () => {
    if (!deleteMember.username) {
      alert('請輸入會員帳號')
      return
    }
    alert(`已刪除會員: ${deleteMember.username}`)
    deleteMember.username = ''
    deleteMember.name = ''
  }

  const editMemberForm = async item => {
    // page.value = 'editMember'
    // editMember.username = item.username
    // editMember.name = item.name

    // console.log('old:', item.role)
    item.role = item.role == 'admin' ? 'user' : 'admin'

    try {
      await userService.changeRole(item)
    } catch (error) {
      console.error('Error fetching users:', error)
      createSnackbar({
        text: '會員更新失敗',
        snackbarProps: {
          color: 'red',
        },
      })
    }

    // console.log('new:', item.role)
  }

  const deleteMemberForm = async item => {
    if (confirm(`確定要刪除會員 ${item.username} 嗎？`)) {
      try {
        await userService.delete({ deluser: item.username })
      } catch (error) {
        console.log('Error fetching users:', error)
        createSnackbar({
          text: '無法刪除會員資料',
          snackbarProps: {
            color: 'red',
          },
        })
      }

      alert(`${item.username} 已刪除`)
      getUsers()
    }
  }

  const getUsers = async () => {
    try {
      const { data } = await userService.getAll()
      users.value = data.users
    } catch (error) {
      console.error('Error fetching users:', error)
      createSnackbar({
        text: '無法載入會員資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  getUsers()

</script>

<route lang="yaml">
  meta:
    layout: 'admin'
    title: '會員管理'
    login: 'login-only'
    admin: true
</route>
