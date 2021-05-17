<template>
    <v-container>
      <v-layout class="text-center">
          <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                <v-progress-circular
                  v-show="loading"
                  color="purple"
                  indeterminate
                  size="64"
                ></v-progress-circular>
            </v-flex>
      </v-layout>
        <v-layout class="text-center">
            <v-flex v-show="!loading" xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                <v-avatar size="150" class="hidden-xs-only">
                  <img
                  v-if="imageForRoomUser"
                  :src="imageForRoomUser"
                  alt="John">
                  <img
                  v-else
                  src="@/assets/anonymous.jpg"
                  alt="John">
                </v-avatar>
                <v-avatar size="80" class="hidden-sm-and-up">
                  <img
                  v-if="imageForRoomUser"
                  :src="imageForRoomUser"
                  alt="John">
                  <img
                  v-else
                  src="@/assets/anonymous.jpg"
                  alt="John">
                </v-avatar>
            </v-flex>
            <v-flex v-show="loading" xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
               <v-progress-circular
                  v-show="loading"
                  color="purple"
                  indeterminate
                  size="64"
                ></v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout wrap class="text-center">
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                <h3 class="mb-5">{{ nameForRoomUser }}</h3>
            </v-flex>
        </v-layout>
        <v-layout row wrap mb-5>
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
              <v-card class="pl-3 pr-3 pb-3">
                <form @submit.prevent="doSend">
                    <v-textarea
                    rows="4"
                    name="input"
                    id="input"
                    v-model="input"
                    required
                    :label="$t('post_your_comment')"
                    >
                    </v-textarea>
                    <v-btn
                    class="mr-5 blue--text darken-1 pl-0"
                    type="submit"
                    text>
                    {{$t('send')}}</v-btn>
                </form>
              </v-card>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                <v-pagination
                      v-model="currentPage"
                      :length="getPageCount"
                      dark color="indigo accent-3"
                      class="mb-3">
                </v-pagination>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-for="comment in getLists" :key="comment.commentId" mb-3>
            <v-flex v-show="!loading" xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                <v-card>
                  <v-card-actions>
                      <v-btn
                        width="40"
                        class="ml-3"
                        fab accent
                        :to="'/profileforothers/' + comment.createrId">
                            <v-avatar size="55">
                                <img
                                v-if="comment.image"
                                :src="comment.image"
                                alt="John">
                                <img
                                v-else
                                src="@/assets/anonymous.jpg"
                                alt="John">
                            </v-avatar>
                        </v-btn>
                      <v-card-text>{{$t('')}}
                          <p class="mb-0">{{ comment.datetime | date }}</p>
                          <h4>{{ comment.name ? comment.name : $t('anonymous') }}</h4>
                      </v-card-text>
                  </v-card-actions>
                  <v-layout>
                      <v-card-text class="pt-0">
                      {{ comment.message}}
                      </v-card-text>
                      <v-card-actions>
                            <deleteComment v-show="comment.createrId === user.id" :commentId="comment.commentId"/>
                            <replyBtn :commentId="comment.commentId"/>
                      </v-card-actions>
                  </v-layout>
                </v-card>
            </v-flex>
            <v-flex class="text-center" v-show="loading" xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
               <v-progress-circular
                  color="purple"
                  indeterminate
                  size="64"
                ></v-progress-circular>
            </v-flex>
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
               <showReplyList :commentId="comment.commentId"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import deleteComment from '../User/DeleteComment.vue'
  import replyBtn from '../User/ReplyToComment.vue'
  import showReplyList from '../User/ShowReplyList.vue'
  export default {
    components: { deleteComment, replyBtn, showReplyList },
    data(){
      return {
        //URLのParamsId
         paramsId: location.href.split("/"),
         //コメント機能のダイアログ
         commentDialog: false,
         input: '',
         //コメント投稿する時間の初期値
         time: new Date(),
         //1画面に表示する投稿数
         parPage:3,
         //現在何ページ目か
         currentPage:1
      }
    },
    //画面上のユーザー情報を取り出し
    created(){
      this.$store.dispatch("fetchOtherUserData", this.paramsId[this.paramsId.length - 1])
    },
    computed: {
     //ルームユーザー情報
     otherUser(){
       return this.$store.getters.otherUser
     },
     //ルームユーザーのコメント
     comments(){
       return this.otherUser ? this.$store.getters.otherUser.comments : ""
     },
     //ルームユーザーの名前
     nameForRoomUser(){
       return this.otherUser ? this.$store.getters.otherUser.displayName : ""
     },
     //ルームユーザーのアイコン
     imageForRoomUser(){
       return this.otherUser ? this.$store.getters.otherUser.photoURL : "" 
     },
     //ページネーション
     getLists(){
       let current = this.currentPage * this.parPage//freetalkの合計数
       let start = current - this.parPage//1ページ目の３つのfreetalkが最初
       return this.comments.slice(start, current)//現存する全てのfreetalkを取り出す
     },
     //ページネーションのページ数を取得
     getPageCount(){
       return Math.ceil(this.comments.length / this.parPage)
     },
     //ログインユーザー情報
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
     //ローディング
     loading(){
       return this.$store.getters.loading
    },
    //コメント投稿の日時
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
    //コメント投稿
    doSend() {
      if (this.input.length >= 0) {
        const commentData = {
          roomUserId: this.otherUser.id,
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


