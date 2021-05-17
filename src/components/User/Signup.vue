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
                                      :rules="emailRules"></v-text-field>
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
                                      :rules="passwordRules"></v-text-field>
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
                                      :rules="confirmPasswordRules"></v-text-field>
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
      emailRules: [
          v => !!v || this.emailRequire,
          v => /.+@.+\..+/.test(v) || this.notValidEmail
      ],
      passwordRules: [
          v => !!v || this.passRequire,
          v => (v && v.length >= 6) || this.passNeed6words
      ],
      confirmPasswordRules: [
          v => !!v || this.passRequire,
          v => v !== this.password ? this.passNotMatch : true
      ],
    }
  },
  computed: {
    //メールアドレスは必須項目（バリデーション）
    emailRequire(){
      if(this.$i18n.locale === 'ja'){
        return 'メールアドレスは必須項目です'
      }else if(this.$i18n.locale === 'en'){
        return 'Email is a required field'
      }
    },
    //有効なメールアドレスではありません（バリデーション）
    notValidEmail(){
      if(this.$i18n.locale === 'ja'){
        return '有効なメールアドレスではありません'
      }else if(this.$i18n.locale === 'en'){
        return 'Not a valid email address'
      }
    },
    //パスワードは必須項目です（バリデーション）
    passRequire(){
      if(this.$i18n.locale === 'ja'){
        return 'パスワードは必須項目です'
      }else if(this.$i18n.locale === 'en'){
        return 'Passwore is a required field'
      }
    },
    //変更後のパスワードは６文字以上です（バリデーション）
    passNeed6words(){
      if(this.$i18n.locale === 'ja'){
        return '変更後のパスワードは６文字以上です'
      }else if(this.$i18n.locale === 'en'){
        return 'The changed password must be at least 6 characters'
      }
    },
    //変更後のパスワードが一致しません（バリデーション）
    passNotMatch(){
      if(this.$i18n.locale === 'ja'){
        return '変更後のパスワード（再入力）は一致しません'
      }else if(this.$i18n.locale === 'en'){
        return 'The changed password does not match'
      }
    },
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

