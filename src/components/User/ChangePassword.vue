<template>
    <v-container>
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
                    <v-row>
                        <v-dialog persistent width="380" v-model="registerDialog">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                v-bind="attrs"
                                v-on="on"
                                v-show="!gestUser"
                                class="white--text" 
                                color="success"
                                style="width:100%;"
                                :disabled="!validForPass"
                                :password="password">
                                変更
                            </v-btn>
                            <v-btn
                                v-show="gestUser"
                                class="white--text"
                                color="grey darken-1"
                                style="width:100%;">
                                変更(ゲストユーザーのため変更不可)
                                </v-btn>
                        </template>
                        <v-card>
                            <v-container>
                                <v-form
                                @submit.prevent="onReAuth"
                                v-model="validForReAuth">
                                    <v-layout>
                                        <v-flex>
                                            <v-card-title class="pt-0">再認証</v-card-title>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn 
                                                text
                                                @click="registerDialog = false">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex>
                                            <v-text-field
                                            name="reAuth"
                                            label="現在のパスワード"
                                            id="reAuth"
                                            v-model="reAuth"
                                            type="password"
                                            required
                                            :rules="rulesForReauth">
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex>
                                            <v-btn
                                                class="white--text"
                                                color="success"
                                                style="width:100%;"
                                                :disabled="!validForReAuth"
                                                type="submit">
                                                再認証
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-card>
                      </v-dialog>
                    </v-row>
                </v-flex>
            </v-layout>
        </v-form>
    </v-container>
</template>

<script>
import firebase from "firebase/app"
import 'firebase/auth'
export default {
  data(){
      return{
      password: "",
      reAuth: "",
      validForPass: true,
      validForReAuth: true,
      registerDialog: false,
      passwordRules: [
          v => !!v || 'パスワードは必須項目です',
          v => (v && v.length >= 6) || '変更後のパスワードは６文字以上必要です'
      ],
      confirmPassword: "",
      confirmPasswordRules: [
          v => !!v || 'パスワードは必須項目です',
          v => v !== this.password ? "変更後のパスワード（再入力）が一致しません" : true
      ],
      rulesForReauth: [
          v => !!v || '現在のパスワードは必須項目です',
          v => (v && v.length >= 6) || '変更後のパスワードは６文字以上必要です'
         ]
    }
  },
  computed: {
      gestUser(){
          return firebase.auth().currentUser ? firebase.auth().currentUser.uid === "mKSpW1jBFHgmKYjPGBpz8OenXvE3" : null
      }
  },
  methods: {
      onReAuth(){
       const user = firebase.auth().currentUser
       const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.reAuth)
        user.reauthenticateWithCredential(credential)
         .then(()=> {
         console.log("再認証完了")
        // User re-authenticated.
        })
         .then(() =>{
            const user = firebase.auth().currentUser
            user.updatePassword(this.password).then(()=> {
                console.log("Password更新完了")
                this.registerDialog = false
            }).catch((error)=> {
                console.log(error)
            })
         })
         .catch((error)=> {
            console.log(error)
            // An error happened.
        })
      }
    }
}
</script>

