<template>
    <v-container mt-5>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <h1 class="mb-5">新規登録</h1>
                            <div class="mb-5">
                                <router-link text class="blue--text" to="/login" tag="span" style="cursor: pointer">ログインはこちら</router-link>
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
                                        x-large
                                        type="submit"  
                                        style="width:100%;"
                                        :disabled="!validForPassword"
                                        color="pink darken-1"
                                        class="white--text">
                                            続ける
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
      validForPassword: true,
      email: "",
      emailRules: [
          v => !!v || 'メールアドレスは必須項目です',
          v => /.+@.+\..+/.test(v) || '有効なメールアドレスではありません'
      ],
      password: "",
      passwordRules: [
          v => !!v || 'パスワードは必須項目です',
          v => (v && v.length >= 6) || '変更後のパスワードは６文字以上必要です'
      ],
      confirmPassword: "",
      confirmPasswordRules: [
          v => !!v || 'パスワードは必須項目です',
          v => v !== this.password ? "変更後のパスワード（再入力）が一致しません" : true
      ],
    }
  },
  computed: {
    user(){
      return this.$store.getters.user
    }
  },
  watch: {
    user(value){//signup成功したらホーム画面へ
      if(value !== null && value !== undefined){
        this.$route.push("/")
      }
    }
  },
  methods: {
    onSignup(){  
      this.$store.dispatch("signUserUp", {email: this.email, password: this.password})
    }
  }
}
</script>

