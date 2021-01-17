<template>
         <v-container>
             <v-layout v-for="(comment, index) in comments" :key="`first-${index}`" row wrap mb-3>
                    <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                        <v-card>
                            <v-card-actions>
                              <v-avatar size="60">
                                 <v-img :src="comment.image"></v-img>
                              </v-avatar>
                              <v-card-text>
                                 <p>{{ comment.datetime | date }}</p>
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
                     <v-card-text>
                        <v-textarea
                            name="Reply"
                            label="返信をする"
                            id="Reply"
                            v-model="replymessage"
                            required>
                        </v-textarea>
                     </v-card-text>
                 </v-flex>
             </v-layout>
             <v-layout>
                 <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                     <v-card-actions>
                         <v-btn @click="$router.go(-1)" text class="blue--text darken-1">
                           <v-icon>mdi-chevron-left</v-icon>
                           戻る
                         </v-btn>
                         <v-btn @click="updateReplyData" text class="blue--text darken-1 mr-5">投稿</v-btn>
                         <delete-comment :paramsId="paramsId"></delete-comment>
                     </v-card-actions>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout :replys="replys" v-for="(reply, index) in replys" :key="`second-${index}`" row wrap mb-3>
                   <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                        <v-card>
                            <v-card-actions>
                              <v-avatar size="60">
                                 <v-img :src="reply.image"></v-img>
                              </v-avatar>
                              <v-card-text>
                                 <p>{{ reply.name }}</p>
                              </v-card-text>
                              <v-spacer></v-spacer>
                              <delete-reply @click="logme($event)"></delete-reply>
                            </v-card-actions>
                            <v-card-text>
                              <h2>{{ reply.replymessage }}</h2>
                            </v-card-text>
                        </v-card>
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
    computed: {
        paramsId(){
          return this.id[this.id.length - 1]
        },
        comments(){
        const comments = this.$store.state.comments
        return comments.filter((comment)=>{
          return comment.commentId.match(this.paramsId)
         })
       },
        replys(){
        const replys = this.$store.state.replys
        return replys.filter((reply)=>{
          return reply.commentId.match(this.paramsId)
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
      updateReplyData(){
        if(this.replymessage.length >= 0){
            this.$store.dispatch("createReply",{
              image: this.photoURL,
              replymessage: this.replymessage,
              name: this.userName,
              replyuserid: this.user.id,
              commentId: this.paramsId
            })
            this.replymessage = ""
        }
      },
      logme(event) { // a regular event object is passed by $event in template
         console.log(event.target.parentElement) // parent element
       }
    }
  }
</script>