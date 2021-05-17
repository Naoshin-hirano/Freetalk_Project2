<template>
    <v-container class="pl-0 pr-0">
        <v-layout v-for="reply in replys" :key="reply.replyId" reverse wrap mb-3>
            <v-flex xs10 sm12 md10 offset-sm1 offset-md2>
                <v-card>
                      <v-card-actions class="grey pt-2">
                          <v-icon class="white--text mb-1">mdi-reply</v-icon>
                          <p class="white--text body-1 mb-0">{{$t('reply_comment')}}</p>
                      </v-card-actions>
                      <v-card-actions class="pb-0 pt-0">
                           <v-btn
                           text
                            class="ml-3"
                            height="50px"
                            fab accent>
                                <v-avatar size="50">
                                    <img
                                    v-if="reply.image"
                                    :src="reply.image"
                                    alt="John">
                                    <img
                                    v-else
                                    src="@/assets/anonymous.jpg"
                                    alt="John">
                                </v-avatar>
                            </v-btn>
                          <v-card-text>
                              <p class="mb-0">{{ reply.datetime | date }}</p>
                              <h4>{{ reply.name }}</h4>
                          </v-card-text>
                      </v-card-actions>
                    <v-layout>
                        <v-card-text class="pt-0">
                            {{ reply.message }}
                        </v-card-text>
                        <v-card-actions>
                            <deleteReply v-show="reply.createrId === userId" :commentId="commentId" :replyId="reply.replyId"/>
                        </v-card-actions>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import deleteReply from '../User/DeleteReply.vue'
  export default {
    components: { deleteReply },
    props: ["commentId"],
    data(){
      return {
         //URLを取得
         id: location.href.split("/")
      }
    },
    created(){
      //ルームユーザー情報を取り出し
      this.$store.dispatch("fetchOtherUserData", this.id[this.id.length - 1])
    },
    computed: {
      //ルームユーザー情報を取得
      otherUser(){
       return this.$store.getters.otherUser
     },
     //ログインユーザーのユーザーID
     userId(){
       return this.$store.getters.user.id
     },
     //ルームユーザーのルーム内にあるリプライ
     replys(){
        const replys = this.$store.getters.otherUser.replys
        return replys.filter((reply) =>{
            return reply.commentId.match(this.commentId)
        })
       }
     }
  }
</script>



