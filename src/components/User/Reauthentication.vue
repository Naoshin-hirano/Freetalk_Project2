<template>
  <v-row>
    <v-dialog persistent width="380" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
         <v-btn
            v-bind="attrs"
            v-on="on"
            class="white--text" 
            color="success"
            style="width:100%;">
            変更
            </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-form
             @submit.prevent="onReAuth"
             v-model="validForEmail">
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
                            :disabled="!validForEmail"
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
</template>

<script>
  import firebase from "firebase"
  export default {
    props: ["email"],
    data(){
      return {
        validForEmail: true,
        registerDialog: false,
        reAuth: "",
        rulesForReauth: [
          v => !!v || '現在のパスワードは必須項目です',
          v => (v && v.length >= 6) || '変更後のパスワードは６文字以上必要です'
         ]
        }
      },
    methods: {
        // onReAuth(){
        //    const currentEmail = firebase.auth().currentUser.email
        //    this.$store.dispatch("signUserInWithEmail", {email: currentEmail, password: this.reAuth}).then(()=>{
        //        console.log("認証成功")
        //        this.changeEmail
        //    })
        //    .catch(error =>{
        //        console.log(error)
        //    })
        // },
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
            user.updateEmail(this.email).then(()=> {
                console.log("メールアドレス更新完了")
            }).catch((error)=> {
                console.log(error)
            })
         })
         .catch((error)=> {
            console.log(error)
            // An error happened.
        })
      }
    //   changeEmail(){
    //     const user = firebase.auth().currentUser
    //     user.updateEmail(this.email).then(()=> {
    //         console.log("メールアドレス更新完了")
    //     }).catch((error)=> {
    //         console.log(error)
    //     })
    // }
  }
}
</script>