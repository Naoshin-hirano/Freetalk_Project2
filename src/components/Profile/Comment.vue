<template>
    <v-container>
        <v-layout class="text-center">
            <v-flex xs12 sm10 md8 offset-sm3 offset-md2>
              <v-avatar size="150">
                  <img
                  v-if="roomUser.roomPhotoURL"
                  :src="roomUser.roomPhotoURL"
                  alt="John">
                  <img
                  v-else
                  src="https://soma-engineering.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"
                  alt="John">
                </v-avatar>
            </v-flex>
        </v-layout>
        <v-layout class="text-center">
            <v-flex xs12 sm10 md8 offset-sm3 offset-md2>
                <h3>{{ roomUser.roomDisplayName }}</h3>
            </v-flex>
        </v-layout>
        <v-layout row wrap mb-5>
            <v-flex xs12 sm10 md8 offset-sm3 offset-md2>
                <form @submit.prevent="doSend" >
                    <v-textarea
                    name="input"
                    id="input"
                    v-model="input"
                    required
                    label="Post a comment"
                    >
                    </v-textarea>
                    <v-btn @click="$router.go(-1)" text class="blue--text darken-1">
                      <v-icon >mdi-arrow-left</v-icon>
                      戻る
                    </v-btn>
                    <v-btn class="mr-5 blue--text darken-1" type="submit" text>コメントを投稿</v-btn>
                </form>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-for="comment in comments" :key="comment.message" mb-3>
            <v-flex xs12 sm10 md8 offset-sm3 offset-md2>
                <v-card color="cyan lighten-4">
                  <v-layout>
                      <v-card-actions>
                          <v-flex>
                              <v-avatar size="80">
                                  <v-img :src="comment.image"></v-img>
                              </v-avatar>
                          </v-flex>
                          <v-card-text>
                            <v-flex>
                              <p>{{ comment.name }}</p>
                            </v-flex>
                          </v-card-text>
                          <v-spacer></v-spacer>
                      </v-card-actions>
                      <v-spacer></v-spacer>
                      <v-card-actions>
                        <v-btn text
                              :to="'/comment/reply/delete/' + comment.commentId">
                            <v-icon >mdi-delete-forever</v-icon>
                        </v-btn>
                        <v-btn text 
                              :to="'/comment/reply/' + comment.commentId">
                            <v-icon >mdi-reply-circle</v-icon>
                        </v-btn>
                      </v-card-actions>
                  </v-layout>
                  <v-card-text>
                    <h2>{{ comment.message}}</h2>
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
         roomUser: {
           roomDisplayName: "",
           roomPhotoURL: ""
         }
      }
    },
    created(){
        const uid = this.id[this.id.length - 1]
        db.database().ref("/users/" + uid).once("value").then(data =>{
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
     }
   },
   methods: {
    counter(number){
      this.length = number
    },
    doSend() {
      if (this.input.length >= 0) {
        const chatData = {
          id: this.id[this.id.length - 1],
          message: this.input,
          name: this.userName,
          image: this.photoURL
         }
         this.$store.dispatch("createChat", chatData)
         this.input = '' // フォームを空にする 
        }
      },
      // displayMessage(replys){
      //   console.log(replys)
      // }
    }
  }
</script>


