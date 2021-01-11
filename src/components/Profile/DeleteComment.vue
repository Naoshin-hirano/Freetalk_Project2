<template>
         <v-container>
             <v-layout v-for="comment in comments" :key="comment.message" row wrap mb-3>
                    <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                        <v-card>
                            <v-card-actions>
                              <v-avatar size="60">
                                 <v-img :src="comment.image"></v-img>
                              </v-avatar>
                              <v-card-text>
                                 <p>{{ comment.name }}</p>
                              </v-card-text>
                            </v-card-actions>
                            <v-card-text>
                              <h2>{{ comment.message}}</h2>
                            </v-card-text>
                        </v-card>
                    </v-flex>
            </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                     <v-alert
                        border="bottom"
                        colored-border
                        type="warning"
                        elevation="2">
                       本当にこのコメントを削除してもよろしいですか？
                     </v-alert>
                 </v-flex>
             </v-layout>
             <v-layout>
                 <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                     <v-card-actions>
                         <v-btn @click="$router.go(-1)" text class="blue--text darken-1">
                           <v-icon>mdi-arrow-left</v-icon>
                           キャンセル
                         </v-btn>
                         <v-btn @click="deleteComment" text class="blue--text darken-1">削除</v-btn>
                     </v-card-actions>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
         </v-container>
</template>

<script>
  export default {
    data () {
      return {
        id: location.href.split("/"),
        replymessage: ""
      }
    },
    created(){
        console.log(this.id)
    },
    computed: {
        comments(){
        const comments = this.$store.state.comments
        return comments.filter((comment)=>{
          return comment.commentId.match(this.id[this.id.length - 1])
         })
       },
        replys(){
        const replys = this.$store.state.replys
        return replys.filter((reply)=>{
          return reply.commentId.match(this.id[this.id.length - 1])
          })
        },
       user(){
        return this.$store.getters.user
        },
        userName(){
        return this.$store.getters.userName
        },
        photoURL(){
        return this.$store.getters.photoURL
        }
    },
    methods: {
      deleteComment(){
        if(this.replymessage.length >= 0){
            this.$store.dispatch("deleteComment",{
                image: this.photoURL,
                replymessage: this.replymessage,
                name: this.userName,
                replyuserid: this.user.id,
                commentId: this.id[this.id.length - 1]
            })
            this.$store.dispatch("deleteReply",{
                commentId: this.id[this.id.length - 1]
            })
        }
      }
    }
  }
</script>