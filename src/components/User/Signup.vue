<template>
    <v-container mt-5>
        <v-layout v-if="error">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert><!-- textはAlert内での呼び名 -->
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <h2 class="mb-5">{{$t('signup')}}</h2>
                            <div class="mb-5">
                                <router-link text class="blue--text" to="/login" tag="span" style="cursor: pointer">{{$t('login')}}</router-link>
                            </div>
                            <v-divider class="mb-5"></v-divider>
                            <v-form 
                            @submit.prevent="onSignup"
                            v-model="validForPassword">
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="email"
                                      label="Mail"
                                      id="email"
                                      v-model="email"
                                      type="email"
                                      required
                                      :rules="this.$i18n.locale === 'ja' ? emailRules : emailEnRules"></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="password"
                                      label="Password"
                                      id="password"
                                      v-model="password"
                                      type="password"
                                      required
                                      :rules="this.$i18n.locale === 'ja' ? passwordRules : passwordEnRules"></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="confirmPassword"
                                      label="ConfirmPassword"
                                      id="confirmPassword"
                                      v-model="confirmPassword"
                                      type="confirmPassword"
                                      required
                                      :rules="this.$i18n.locale === 'ja' ? confirmPasswordRules : confirmPasswordEnRules"></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex class="mt-3">
                                        <v-btn
                                        large
                                        type="submit"  
                                        style="width:100%;"
                                        :disabled="!validForPassword"
                                        color="pink darken-1"
                                        class="white--text">
                                            {{$t('continue')}}
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data(){
      return{
      //メール・パスワード・パスワード確認のバリデーションがOKならボタン押せる
      validForPassword: true,
      //メール・パスワード・パスワード確認の入力フォーム
      email: "",
      password: "",
      confirmPassword: "",
  //メール・パスワード・パスワード確認のバリデーション
      //メール
      emailRules: [
          v => !!v || "メールアドレスは必須項目です",
          v => /.+@.+\..+/.test(v) || '有効なメールアドレスではありません'
      ],
      //メール（英語版）
      emailEnRules: [
          v => !!v || "Mail address is requeired",
          v => /.+@.+\..+/.test(v) || 'Not a valid Email address'
      ],
      //パスワード
      passwordRules: [
          v => !!v || 'パスワードは必須項目です',
          v => (v && v.length >= 6) || 'パスワードは６文字以上です'
      ],
      //パスワード（英語版）
      passwordEnRules: [
          v => !!v || 'Password is a required field',
          v => (v && v.length >= 6) || 'The password must be at least 6 characters'
      ],
      //パスワード確認
      confirmPasswordRules: [
          v => !!v || 'パスワードは必須項目です',
          v => v !== this.password ? 'パスワード（再入力）は一致しません' : true
      ],
      //パスワード確認（英語版）
      confirmPasswordEnRules: [
          v => !!v || 'Password is a required field',
          v => v !== this.password ? 'The password does not match' : true
      ],
    }
  },
  computed: {
    //ログインユーザー情報
    user(){
      return this.$store.getters.user
    },
    //入力エラー表示
    error(){
      return this.$store.getters.error
    }
  },
  //signup成功したらホーム画面へ
  watch: {
    user(value){
      if(value !== null && value !== undefined){
        this.$route.push("/")
      }
    }
  },
  methods: {
    //入力したメールアドレスとパスワードでログインする
    onSignup(){  
      this.$store.dispatch("signUserUp", {email: this.email, password: this.password})
    },
    //入力エラー表示の削除
    onDismissed(){
      console.log("Dismissed Alert !")
      this.$store.dispatch("clearError")
    }
  }
}
</script>

