<template>
    <v-container mt-5>

        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <h2 class="text-center mb-5">登録情報</h2>
                            <p class="mb-5"><v-icon>mdi-email-edit</v-icon>メールアドレス</p>
                            <v-form
                            v-model="validForEmail">
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="email"
                                      label="メールアドレス"
                                      id="email"
                                      v-model="email"
                                      type="email"
                                      required
                                      :rules="emailRules"></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex class="mt-3">
                                        <Reauthentication 
                                        :disabled="!validForEmail"
                                        :email="email"/>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                            <v-divider class="mt-10 mb-9"></v-divider>
                            <p class="mb-5"><v-icon>mdi-account-key</v-icon>パスワード</p>
                            <v-form 
                              @submit.prevent="changePassword"
                              v-model="validForPass"
                              ref="form">
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="password"
                                      label="変更後のパスワード"
                                      id="password"
                                      v-model="password"
                                      type="password"
                                      required
                                      :rules="passwordRules"></v-text-field>
                                      <v-text-field
                                      name="confirmPassword"
                                      label="変更後のパスワード(再入力)"
                                      id="confirmPassword"
                                      v-model="confirmPassword"
                                      type="confirmPassword"
                                      required
                                      :rules="confirmPasswordRules"></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex>
                                        <v-btn 
                                        class="white--text"
                                        :disabled="!validForPass"
                                        type="submit"
                                        color="success"
                                        style="width:100%;">
                                        変更
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                            <v-divider class="mt-8 mb-7"></v-divider>
                            <p class="mb-5"><v-icon>mdi-account-remove</v-icon>アカウントを削除する</p>
                            <v-layout>
                                <v-flex>
                                    <v-btn
                                    type="submit"
                                    color="error"
                                    style="width:100%;">
                                        削除
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import firebase from "firebase"
import Reauthentication from '../User/Reauthentication.vue'
export default {
  components: { Reauthentication },
  data(){
      return{
      validForEmail: true,
      validForPass: true,
      email: firebase.auth().currentUser.email,
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
      ]
    }
  },
  methods: {
    changePassword(){
        this.$refs.form.validate()
        const user = firebase.auth().currentUser;
        user.updatePassword(this.password).then(()=> {
         console.log("Password更新完了")
        }).catch((error)=> {
         console.log(error)
        })
     }
  }
}
</script>

