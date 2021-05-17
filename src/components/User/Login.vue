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
                            <h2 class="mb-5">{{$t('login')}} </h2>
                            <div class="mb-5">
                                <router-link text class="blue--text" to="/signup" tag="span" style="cursor: pointer">{{$t('new_registration')}}</router-link>
                            </div>
                            <v-divider class="mb-5"></v-divider>
                             <v-layout>
                                <v-flex>
                                    <v-btn @click="loginWithGestUser" large dark color="pink darken-1" style="width:100%;" >
                                        {{$t('guest_user')}} 
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                             <v-divider class="mb-5"></v-divider>
                            <v-form 
                            @submit.prevent="onSigninWithEmail"
                            v-model="validForEmail">
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
                                <v-layout class="mb-2">
                                    <v-flex>
                                        <v-btn
                                        type="submit" 
                                        style="width:100%;"
                                        :disabled="!validForEmail">
                                            <v-icon left>mdi-email</v-icon>
                                            {{$t('mail_login')}} 
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-container>
                        <v-divider class="mb-2"></v-divider>
                        <v-container>
                            <v-layout>
                                <v-card style="background: #CCCCFF; width:100%;">
                                    <v-flex class="mt-3">
                                        <v-card-actions>
                                            <v-btn
                                                @click="loginWithGoogle"
                                                style="
                                                    cursor:pointer;
                                                    background: #ffff;
                                                    border-radius: 5px;
                                                    color: gray;
                                                    height: 40px;
                                                    line-height:40px;
                                                    text-align: center;
                                                    width: 100%;
                                                    margin-bottom:12px;">
                                                <img class="google-icon" style="width :23px; margin-right :5px;" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                                                {{$t('google_login')}} 
                                            </v-btn>
                                        </v-card-actions>
                                    </v-flex>
                                </v-card>
                            </v-layout>
                       </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex>
              <v-overlay v-show="loading">
                <v-progress-circular
                  indeterminate
                  size="64"
                ></v-progress-circular>
              </v-overlay>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data(){
      return{
      validForEmail: true,
      //メールとパスワードの入力
      email: "",
      password: "",
      //メールとパスワードのバリデーション
      emailRules: [
          v => !!v || this.emailRequire,
          v => /.+@.+\..+/.test(v) || this.notValidEmail
      ],
      passwordRules: [
          v => !!v || this.passRequire,
          v => (v && v.length >= 6) || this.passNeed6words
      ]
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
    //ログインユーザーの取得
    user(){
      return this.$store.getters.user
    },
    //入力エラーの表示
    error(){
      return this.$store.getters.error
    },
    //ローディング
    loading(){
       return this.$store.getters.loading
     }
  },
  watch: {
    //signin成功したらホーム画面へ
    user(value){
      if(value !== null && value !== undefined){
        this.$route.push("/")
      }
    }
  },
  methods: {
    //ゲストユーザーのログイン
    loginWithGestUser(){
      this.$store.dispatch("loginWithGestUser", {email: "guest@example.com", password: "guests"})
    },
    //メールとパスワードでのログイン
    onSigninWithEmail(){  
      this.$store.dispatch("signUserInWithEmail", {email: this.email, password: this.password})
    },
    //グーグルアカウントでのログイン
    loginWithGoogle(){
      this.$store.dispatch("loginWithGoogle")
  },
    //入力エラー画面を削除する
    onDismissed(){
      console.log("Dismissed Alert !")
      this.$store.dispatch("clearError")
    }
  }
}
</script>

