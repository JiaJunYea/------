<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">註冊</h1>
      </v-col>
      <v-divider />
      <v-col cols="12">
        <v-form :disabled="form.isSubmitting.value" @submit.prevent="submit">
          <v-text-field
            v-model="account.value.value"
            counter
            :error-messages="account.errorMessage.value"
            label="帳號"
            maxlength="20"
            minlength="4"
            required
          />
          <v-text-field
            v-model="password.value.value"
            counter
            :error-messages="password.errorMessage.value"
            label="密碼"
            maxlength="20"
            minlength="4"
            required
            type="password"
          />
          <v-text-field
            v-model="confirmPassword.value.value"
            counter
            :error-messages="confirmPassword.errorMessage.value"
            label="確認密碼"
            maxlength="20"
            minlength="4"
            required
            type="password"
          />
          <v-btn :loading="form.isSubmitting.value" type="submit">註冊</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import validator from 'validator'
  import { useField, useForm } from 'vee-validate'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import * as yup from 'yup'
  import userService from '@/services/user'

  const createSnackbar = useSnackbar()
  const router = useRouter()

  // 建立 vee-validate 的表單
  const form = useForm({
    // 用 yup 定義表單驗證格式
    // https://github.com/jquense/yup
    validationSchema: yup.object({
      account: yup
        // 資料型態是文字
        .string()
        .required('帳號是必填的')
        .min(4, '帳號至少需要 4 個字元')
        .max(20, '帳號最多只能有 20 個字元')
        // 自訂驗證(驗證名稱, 錯誤訊息, 驗證function)
        .test('isAlphanumeric', '帳號只能包含英文字母和數字', value => {
          return validator.isAlphanumeric(value)
        }),
      password: yup
        .string()
        .required('密碼是必填的')
        .min(4, '密碼至少需要 4 個字元')
        .max(20, '密碼最多只能有 20 個字元'),
      confirmPassword: yup
        .string()
        .required('確認密碼是必填的')
        // .oneOf(陣列, 訊息)   欄位的值必須是陣列內的其中一個
        // .ref(欄位)          取得欄位的值
        // .ref(password)     password 欄位的值
        .oneOf([yup.ref('password')], '密碼和確認密碼必須相同'),
    }),
  })
  // 建立 vee-validate 的表單欄位
  // 一定要在 useForm 後面
  // useField(欄位名稱)
  const account = useField('account')
  const password = useField('password')
  const confirmPassword = useField('confirmPassword')

  // vee-validate 的表單送出
  // handleSubmit(處理function)
  // values 表單所有欄位的值
  const submit = form.handleSubmit(async values => {
    try {
      await userService.create({
        username: values.account,
        password: values.password,
      })
      createSnackbar({
        text: '註冊成功！',
        snackbarProps: {
          color: 'green',
        },
      })
      // 註冊成功後，導向到登入頁面
      router.push('/login')
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '註冊失敗，請稍後再試！',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  })
</script>

<!-- https://uvr.esm.is/guide/extending-routes.html#sfc-route-custom-block -->
<route lang="yaml">
  meta:
    # 標題
    title: '註冊'
    # 只能在沒登入的情況下看
    login: 'no-login-only'
    # 不是管理員也能看
    admin: false
</route>
