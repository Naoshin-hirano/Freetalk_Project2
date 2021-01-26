<template>
    <v-container>
        <v-layout class="text-center">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
              <v-avatar size="150">
                  <img
                  v-if="roomUser.roomPhotoURL"
                  :src="roomUser.roomPhotoURL"
                  alt="John">
                  <img
                  v-else
                  :src="initalPhotoUrl"
                  alt="John">
                </v-avatar>
            </v-flex>
        </v-layout>
        <v-layout class="text-center">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <h3>{{ roomUser.roomDisplayName }}</h3>
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
                            height="70px"
                            fab accent
                            :to="'/profileforothers/' + comment.uid">
                                <v-avatar size="70">
                                    <v-img
                                    v-if="comment.image"
                                    :src="comment.image"
                                    alt="John">
                                    </v-img>
                                    <v-img
                                    v-else
                                    :src="initalPhotoUrl"
                                    alt="John">
                                    </v-img>
                                </v-avatar>
                            </v-btn>
                          <v-card-text>
                              <p>{{ comment.datetime | date }}</p>
                              <h4>{{ comment.name }}</h4>
                          </v-card-text>
                          <v-spacer></v-spacer>
                      </v-card-actions>
                      <v-spacer></v-spacer>
                      <v-card-actions>
                        <v-btn text 
                              :to="'/comment/reply/' + comment.commentId">
                            <v-icon 
                            large 
                            class="blue-grey--text lighten-5">mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </v-card-actions>
                  </v-layout>
                  <v-card-text>
                    <h3>{{ comment.message}}</h3>
                  </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import db from "firebase"

  export default {
    data(){
      return {
         id: location.href.split("/"),
         commentDialog: false,
         input: '',
         time: new Date(),
         parPage:3,
         currentPage:1,
         roomUser: {
           roomDisplayName: "",
           roomPhotoURL: ""
         }
      }
    },
    created(){
        const uid = this.id[this.id.length - 1]
        db.database().ref("/users/" + uid).once("value")
        .then(data =>{
            this.roomUser.roomDisplayName = data.val().displayName,
            this.roomUser.roomPhotoURL = data.val().photoURL
        })
        .catch(error =>{
            console.log(error)
        })
    },
    computed: {
     user(){
        return this.$store.getters.user
     },
     comments(){
        const comments = this.$store.state.comments
        return comments.filter((comment)=>{
          return comment.roomUserId.match(this.id[this.id.length - 1])
        })
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
    getLists(){
      let current = this.currentPage * this.parPage//freetalkの合計数
      let start = current - this.parPage//1ページ目の３つのfreetalkが最初
      return this.comments.slice(start, current)//現存する全てのfreetalkを取り出す
     },
     getPageCount(){
         //引数として与えた数以上の最小の整数を返します。
       return Math.ceil(this.comments.length / this.parPage)
     },
     initalPhotoUrl(){
         return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       },
   },
   methods: {
    doSend() {
      if (this.input.length >= 0) {
        const commentData = {
          id: this.id[this.id.length - 1],
          uid: this.user.id,
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


