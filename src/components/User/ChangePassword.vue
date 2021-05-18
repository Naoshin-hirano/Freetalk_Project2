<template>
    <v-container>
        <p class="mb-5"><v-icon>mdi-account-key</v-icon>{{$t('password')}}</p>
        <v-form 
        @submit.prevent="changePassword"
        v-model="validForPass"
        ref="form">
            <v-layout>
            <v-flex xs12>
                <v-text-field
                name="password"
                :label="$t('password_after_change')"
                id="password"
                v-model="password"
                type="password"
                required
                :rules="this.$i18n.locale === 'ja' ? passwordRules : passwordEnRules"></v-text-field>
                <v-text-field
                name="confirmPassword"
                :label="$t('password_after_change_reenter')"
                id="confirmPassword"
                v-model="confirmPassword"
                type="confirmPassword"
                required
                :rules="this.$i18n.locale === 'ja' ? confirmPasswordRules : confirmPasswordEnRules"></v-text-field>
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
                                {{$t('change')}}
                            </v-btn>
                            <v-btn
                                v-show="gestUser"
                                class="white--text"
                                color="grey darken-1"
                                style="width:100%;">
                                {{$t('change_for_guest')}}
                                </v-btn>
                        </template>
                        <v-card>
                            <v-container>
                                <v-form
                                @submit.prevent="onReAuth"
                                v-model="validForReAuth">
                                    <v-layout>
                                        <v-flex>
                                            <v-card-title class="pt-0"></v-card-title>
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
                                            :label="$t('current_password')"
                                            id="reAuth"
                                            v-model="reAuth"
                                            type="password"
                                            required
                                            :rules="this.$i18n.locale === 'ja' ? rulesForReauth : enRulesForReauth">
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
                                                {{$t('reauthentication')}}
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
      //パスワードの入力フォーム初期値
      password: "",
      confirmPassword: "",
      //再認証の入力フォーム初期値
      reAuth: "",
      
      validForPass: true,
      validForReAuth: true,
      registerDialog: false,
      //パスワードのバリデーション
      passwordRules: [
          v => !!v || 'パスワードは必須項目です',
          v => (v && v.length >= 6) || '変更後のパスワードは６文字以上です'
      ],
       //パスワードのバリデーション（英語版）
      passwordEnRules: [
          v => !!v || 'Password is a required field',
          v => (v && v.length >= 6) || 'Password must be at least 6 characters'
      ],
      //パスワード確認のバリデーション
      confirmPasswordRules: [
          v => !!v || '変更後のパスワード（再入力）は必須項目です',
          v => v !== this.password ? '変更後のパスワード（再入力）は一致しません' : true
      ],
       //パスワード確認のバリデーション（英語版）
      confirmPasswordEnRules: [
          v => !!v || 'The changed password is a required field',
          v => v !== this.password ? 'The changed password must be at least 6 characters' : true
      ],
      //再認証のバリデーション
      rulesForReauth: [
          v => !!v || 'パスワードは必須項目です',
          v => (v && v.length >= 6) || 'パスワードは６文字以上です'
         ],
      //再認証のバリデーション（英語版）
      enRulesForReauth: [
          v => !!v || 'Password is a required field',
          v => (v && v.length >= 6) || 'Password must be at least 6 characters'
         ]
    }
  },
  computed: {
      //現在のログインユーザーがゲストユーザー
      gestUser(){
          return firebase.auth().currentUser ? firebase.auth().currentUser.uid === "mKSpW1jBFHgmKYjPGBpz8OenXvE3" : null
      }
  },
  methods: {
      onReAuth(){
       //再認証機能
       const user = firebase.auth().currentUser
       const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.reAuth)
        user.reauthenticateWithCredential(credential)
         .then(()=> {
         console.log("再認証完了")
        })
        //パスワード更新
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
        })
      }
    }
}
</script>

