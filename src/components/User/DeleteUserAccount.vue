<template>
    <v-container>
           <p class="mb-5"><v-icon>mdi-account-remove</v-icon>{{$t('delete_account')}}</p>
            <v-layout>
                <v-flex>
                    <v-row>
                        <v-dialog persistent width="380" v-model="registerDialog">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                v-show="!gestUser"
                                v-bind="attrs"
                                v-on="on"
                                color="error"
                                style="width:100%;">
                                {{$t('delete')}}   
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
                                                @click="onReAuth">
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
    </v-container>
</template>

<script>
import firebase from "firebase/app"
import 'firebase/auth'
export default {
  data(){
    return{
      //入力フォーム
      password: "",
      reAuth: "",
      //バリデーションがOKならボタン押せる
      validForReAuth: true,
      //ダイアログ
      registerDialog: false,
      //再認証のバリデーション
      rulesForReauth: [
        v => !!v || 'パスワードは必須項目です',
        v => (v && v.length >= 6) || 'パスワードは６文字以上です'
      ],
      //再認証のバリデーション（英語版）
      enRulesForReauth: [
        v => !!v || 'Passwore is a required field',
        v => (v && v.length >= 6) || 'The password must be at least 6 characters'
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
     //再認証機能
    onReAuth(){
       const user = firebase.auth().currentUser
       const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.reAuth)
        user.reauthenticateWithCredential(credential)
         .then(()=> {
         console.log("再認証完了")
        })
        //現在のアカウント削除
         .then(() =>{ 
          this.$store.dispatch("deleteUserAccount")
          this.registerDialog = false
          this.$router.push({name: 'Home'})
         })
         .catch((error)=> {
            console.log(error)
        })
      }
    }
}
</script>

