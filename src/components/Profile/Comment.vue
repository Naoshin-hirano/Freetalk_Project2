<template>
  <div class="text-center">
    <v-dialog width="1000" height="1000" v-model="commentDialog">
      <template v-slot:activator="{ on, attrs }">
        <div>
            <v-btn
            v-bind="attrs"
            v-on="on"
            icon color="green">
                <v-icon left>mdi-comment-multiple-outline</v-icon>
            </v-btn>
            <span>{{ messages.length }} COMMENTS</span>
        </div>
      </template>
      <v-card>
        <v-container fluid>
                  <v-layout row wrap >
                    <v-flex xs12 sm10 md8 offset-sm1 offset-md2 mb-4 >
                        <form @submit.prevent="doSend" >
                            <v-textarea
                            name="input"
                            id="input"
                            v-model="input"
                            required
                            label="Post a comment"
                            >
                            </v-textarea>
                            <v-btn width="100px" class="mr-5" type="submit">Send</v-btn>
                            <v-btn width="100px" @click="commentDialog = false">Close</v-btn>
                        </form> 
                    </v-flex>
                </v-layout>
                <v-layout row wrap v-for="comment in messages" :key="comment.message" mb-3>
                    <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                        <v-card class="lime accent-4">
                            <v-img :src="comment.image" width="60"></v-img>
                            <h4>{{ comment.name }}</h4>
                            <v-card-text>
                              {{ comment.message}}
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row wrap v-show="!messages.length">
                   <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                        <v-card>
                           <v-card-text>
                              There is no comment. Please post yours.
                           </v-card-text>
                        </v-card>
                   </v-flex>
                </v-layout>
         </v-container>
       </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return {
         commentDialog: false,
         input: ''  // 入力したメッセージ
      }
    },
    computed: {
     user(){
        return this.$store.getters.user
     },
     messages(){
        return this.$store.getters.user.loadedChats
     },
     userName(){
       return this.$store.getters.userName
     },
     photoURL(){
       return this.$store.getters.photoURL
     }
   },
   methods: {
    doSend() {
      if (this.input.length >= 0) {
        const chatData = {
          message: this.input,
          name: this.userName,
          image: this.photoURL
         }
         this.$store.dispatch("createChat", chatData)
         this.input = '' // フォームを空にする 
        }
      }
    }
  }
</script>
