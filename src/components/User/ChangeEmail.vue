<template>
    <v-container>
        <p class="mb-5"><v-icon>mdi-email-edit</v-icon>{{$t('mail_address')}}</p>
        <v-form
        v-model="validForEmail">
            <v-layout>
                <v-flex xs12>
                    <v-text-field
                    name="email"
                    :label="$t('mail_address')"
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    :rules="this.$i18n.locale === 'ja' ? emailRules : emailEnRules"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex class="mt-3">
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
                                :disabled="!validForEmail"
                                >
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
                                            <v-card-title class="pt-0">{{$t('reauthentication')}}</v-card-title>
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
      email: firebase.auth().currentUser ? firebase.auth().currentUser.email : null,
      reAuth: "",
      validForEmail: true,
      validForReAuth: true,
      registerDialog: false,
      //メールのバリデーション
      emailRules: [
          v => !!v ||'メールアドレスは必須項目です',
          v => /.+@.+\..+/.test(v) || '有効なメールアドレスではありません'
      ],
      //メールのバリデーション（英語版）
      emailEnRules: [
          v => !!v || 'Email is a required field',
          v => /.+@.+\..+/.test(v) || 'Not a valid email address'
      ],
      //再認証のバリデーション
      rulesForReauth: [
          v => !!v || 'パスワードは必須項目です',
          v => (v && v.length >= 6) || '変更後のパスワードは６文字以上です'
      ],
      //再認証のバリデーション（英語版）
      enRulesForReauth: [
          v => !!v || 'Password is a required field',
          v => (v && v.length >= 6) || 'Password must be at least 6 characters'
      ]
    }
  },
  computed: {
      //現在のログインユーザーがゲストユーザーであるか
      gestUser(){
          return firebase.auth().currentUser ? firebase.auth().currentUser.uid === "mKSpW1jBFHgmKYjPGBpz8OenXvE3" : null
      }
  },
  methods: {
      onReAuth(){
       //ユーザー再認証
       const user = firebase.auth().currentUser
       const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.reAuth)
        user.reauthenticateWithCredential(credential)
         .then(()=> {
         console.log("再認証完了")
        })
        //メールアドレス更新
         .then(() =>{
            const user = firebase.auth().currentUser
            user.updateEmail(this.email).then(()=> {
                console.log("メールアドレス更新完了")
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

