<template>
  <v-row>
    <v-dialog persistent width="600" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        dark color="indigo accent-3"
        class="mr-3 ml-3"
        v-bind="attrs"
        v-on="on">
         返信
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                  <v-card-text>
                      <v-textarea
                        name="input"
                        id="id"
                        v-model="input"
                        required
                        clearable
                        clear-icon="mdi-close-circle"
                        label="コメント内容"
                      ></v-textarea>
                  </v-card-text>
             </v-layout>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="red--text darken-1"
                        text
                        @click="registerDialog = false">
                        <h3 class="hidden-xs-only">閉じる</h3>
                        <span class="hidden-sm-and-up">閉じる</span>
                        </v-btn>
                        <v-btn
                        class="green--text darken-1"
                        text
                        >
                        <h3 @click="replyToComment" class="hidden-xs-only">返信する</h3>
                        <span @click="replyToComment" class="hidden-sm-and-up">返信する</span>
                        </v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ["commentId"],//commentId
    data(){
      return {
        //ダイアログ
        registerDialog: false,
        //URLを取得
        id: location.href.split("/"),
        input: '',
        //現在の時間を取得
        time: new Date()
      }
    },
    computed: {
      //画面上のユーザー情報取得
      otherUser(){
       return this.$store.getters.otherUser
     },
      //ログインユーザー情報取得
      user(){
          return this.$store.getters.user
      },
      //ログインユーザーの名前
      userName(){
        return this.$store.getters.userName
      },
      //ログインユーザーのアイコン
      photoURL(){
        return this.$store.getters.photoURL
      },
      //リプライする日時
      submittableDateTime(){
        const date = new Date()
        const str = date.getFullYear()
        + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
        + '/' + ('0' + date.getDate()).slice(-2)
        + ' ' + ('0' + date.getHours()).slice(-2)
        + ':' + ('0' + date.getMinutes()).slice(-2)
        return str
        }
   },
    methods: {
      //コメントのリプライする
      replyToComment(){
        if(this.input.length >= 0){
          const replyData = {
            commentId: this.commentId,
            roomUserId: this.id[this.id.length - 1],
            createrId: this.user.id,
            message: this.input,
            name: this.userName,
            image: this.photoURL,
            datetime: this.submittableDateTime
          }
          this.$store.dispatch("createReply", replyData)
          this.input = ''
          this.registerDialog = false
         }
        }
      }
    }
</script>