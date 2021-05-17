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
                    :rules="emailRules"></v-text-field>
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
      emailRules: [
          v => !!v || this.emailRequire,
          v => /.+@.+\..+/.test(v) || this.notValidEmail
      ],
      rulesForReauth: [
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

