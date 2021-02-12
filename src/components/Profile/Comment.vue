<template>
    <v-container>
        <v-layout class="text-center">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-avatar size="150" class="hidden-xs-only">
                  <img
                  v-if="imageForRoomUser"
                  :src="imageForRoomUser"
                  alt="John">
                  <img
                  v-else
                  :src="initalPhotoUrl"
                  alt="John">
                </v-avatar>
                <v-avatar size="80" class="hidden-sm-and-up">
                  <img
                  v-if="imageForRoomUser"
                  :src="imageForRoomUser"
                  alt="John">
                  <img
                  v-else
                  :src="initalPhotoUrl"
                  alt="John">
                </v-avatar>
            </v-flex>
        </v-layout>
        <v-layout wrap class="text-center">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <h3>{{ nameForRoomUser }}</h3>
            </v-flex>
        </v-layout>
        <v-layout row wrap mb-5>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
              <v-card class="pl-3 pr-3 pb-3">
                <form @submit.prevent="doSend" >
                    <v-textarea
                    name="input"
                    id="input"
                    v-model="input"
                    required
                    label="コメントを入力"
                    >
                    </v-textarea>
                    <v-btn 
                    @click="$router.go(-1)" 
                    text 
                    class="blue--text darken-1">
                      <v-icon >mdi-chevron-left</v-icon>
                      戻る
                    </v-btn>
                    <v-btn 
                    class="mr-5 blue--text darken-1"
                    type="submit"
                    text>
                    投稿する</v-btn>
                </form>
              </v-card>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-pagination
                      v-model="currentPage"
                      :length="getPageCount"
                      dark color="indigo accent-3"
                      class="mb-3">
                </v-pagination>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-for="comment in getLists" :key="comment.commentId" mb-3>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                  <v-layout>
                      <v-card-actions>
                           <v-btn
                            class="ml-3"
                            fab accent
                            :to="'/profileforothers/' + comment.createrId">
                                <v-avatar size="70">
                                    <img
                                    v-if="comment.image"
                                    :src="comment.image"
                                    alt="John">
                                    <img
                                    v-else
                                    :src="initalPhotoUrl"
                                    alt="John">
                                </v-avatar>
                            </v-btn>
                          <v-card-text>
                              <p>{{ comment.datetime | date }}</p>
                              <h4>{{ comment.name }}</h4>
                          </v-card-text>
                          <v-spacer></v-spacer>
                      </v-card-actions>
                      <v-spacer></v-spacer>
                  </v-layout>
                  <v-layout>
                      <v-card-text>
                            <h3>{{ comment.message}}</h3>
                      </v-card-text>
                      <v-card-actions>
                            <delete-comment :commentId="comment.commentId"></delete-comment>
                            <reply-btn :commentId="comment.commentId"></reply-btn>
                      </v-card-actions>
                  </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
               <show-reply-list :commentId="comment.commentId"></show-reply-list>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    data(){
      return {
         id: location.href.split("/"),
         commentDialog: false,
         input: '',
         time: new Date(),
         parPage:3,
         currentPage:1
      }
    },
    created(){
      this.$store.dispatch("fetchOtherUserData", this.id[this.id.length - 1])
    },
    computed: {
      //プロフィールユーザ
      otherUser(){
       return this.$store.getters.otherUser
     },
     comments(){
       return this.otherUser ? this.$store.getters.otherUser.comments : ""
     },
     nameForRoomUser(){
       return this.otherUser ? this.$store.getters.otherUser.displayName : ""
     },
     imageForRoomUser(){
       return this.otherUser ? this.$store.getters.otherUser.photoURL : "" 
     },
     getLists(){
       let current = this.currentPage * this.parPage//freetalkの合計数
       let start = current - this.parPage//1ページ目の３つのfreetalkが最初
       return this.comments.slice(start, current)//現存する全てのfreetalkを取り出す
     },
     getPageCount(){
       return Math.ceil(this.comments.length / this.parPage)
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
    doSend() {
      if (this.input.length >= 0) {
        const commentData = {
          roomUserId: this.id[this.id.length - 1],
          createrId: this.user.id,
          message: this.input,
          name: this.userName,
          image: this.photoURL,
          datetime: this.submittableDateTime
         }
         this.$store.dispatch("createComment", commentData)
         this.input = '' // フォームを空にする 
        }
      }
    }
  }
</script>


