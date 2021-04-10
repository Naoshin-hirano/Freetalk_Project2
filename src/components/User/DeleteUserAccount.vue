<template>
    <v-container>
           <p class="mb-5"><v-icon>mdi-account-remove</v-icon>アカウントを削除する</p>
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
                                削除
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
                                                @click="onReAuth">
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
        v => !!v || '現在のパスワードは必須項目です',
        v => (v && v.length >= 6) || '変更後のパスワードは６文字以上必要です'
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

