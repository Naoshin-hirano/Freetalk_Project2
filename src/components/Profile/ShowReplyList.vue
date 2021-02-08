<template>
    <v-container class="pl-0 pr-0">
        <v-layout v-for="reply in replys" :key="reply.replyId" reverse wrap mb-3>
            <v-flex xs10 sm12 md10 offset-sm1 offset-md2>
                <v-card>
                      <v-card-title class="grey pb-0 pt-4">
                          <v-icon class="white--text mb-5">mdi-reply</v-icon>
                          <p class="white--text">返信コメント</p>
                      </v-card-title>
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
                                    :src="initalPhotoUrl"
                                    alt="John">
                                </v-avatar>
                            </v-btn>
                          <v-card-text>
                              <p class="mb-0">{{ reply.datetime | date}}</p>
                              <h4>{{ reply.name }}</h4>
                          </v-card-text>
                      </v-card-actions>
                    <v-layout>
                        <v-card-text class="pt-0">
                            <p>{{ reply.message }}</p>
                        </v-card-text>
                        <v-card-actions>
                            <delete-reply :commentId="commentId" :replyId="reply.replyId"></delete-reply>
                        </v-card-actions>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    props: ["commentId"],
    data(){
      return {
         id: location.href.split("/")
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
      replys(){
        const replys = this.$store.getters.otherUser.replys
        return replys.filter((reply) =>{
            return reply.commentId.match(this.commentId)
        })
      },
     initalPhotoUrl(){
         return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       }
     }
  }
</script>



