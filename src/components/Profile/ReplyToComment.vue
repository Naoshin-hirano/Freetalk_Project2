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
                        class="cyan--text darken-1"
                        text
                        @click="registerDialog = false">
                        <h3>閉じる</h3>
                        </v-btn>
                        <v-btn
                        class="cyan--text darken-1"
                        text
                        >
                        <h3 @click="replyToComment">返信する</h3>
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
        registerDialog: false,
        id: location.href.split("/"),
        input: '',
        time: new Date()
      }
    },
    computed: {
      //プロフィールユーザ
      otherUser(){
       return this.$store.getters.otherUser
     },
      //自分のユーザー
      user(){
          return this.$store.getters.user
      },
      userName(){
        return this.$store.getters.userName
      },
      photoURL(){
        return this.$store.getters.photoURL
      },
      submittableDateTime(){
        const date = new Date()
        const str = date.getFullYear()
        + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
        + '/' + ('0' + date.getDate()).slice(-2)
        + ' ' + ('0' + date.getHours()).slice(-2)
        + ':' + ('0' + date.getMinutes()).slice(-2)
        return str
        },
      initalPhotoUrl(){
         return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       }
   },
    methods: {
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
          console.log("replyData")
          console.log(replyData)
          this.$store.dispatch("createReply", replyData)
          this.input = ''
          this.registerDialog = false
         }
        }
      }
    }
</script>