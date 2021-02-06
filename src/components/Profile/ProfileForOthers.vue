<template>
    <v-container>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-container>
                        <v-layout class="text-center">
                            <v-flex>
                                <v-avatar size="180">
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
                        <v-layout class="text-center" mt-1 mb-10>
                            <v-flex >
                                <h3>{{ nameForRoomUser }}</h3>
                            </v-flex>
                        </v-layout>
                         <v-layout>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="mt-3 ml-5"
                                    :to="'/comment/' + this.url[this.url.length - 1]">
                                  <v-icon color="green" large left>mdi-comment-multiple-outline</v-icon>
                                  <span>{{ commentsLength }} コメントを見る</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-sm3 offset-md3> 
                                <follow-user></follow-user>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-12>
                            <v-flex>
                                <v-card class="grey lighten-3 ma-2">
                                    <h3>自己紹介</h3>
                                   <v-card-text>
                                     <h3>{{ introduction }}</h3>
                                   </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex>
                                <v-btn 
                                @click="$router.go(-1)" 
                                text 
                                class="blue--text darken-1">
                                    <v-icon >mdi-chevron-left</v-icon>
                                    戻る
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
  export default {
    data () {
      return {
        editDialog: false,
        url: location.href.split("/"),
        comments: null,
        commentsLength: 0,
        nameForRoomUser: null,
        imageForRoomUser: null,
        introduction: null
      }
    },
    created(){
      this.$store.dispatch("fetchOtherUserData", this.url[this.url.length - 1])
    },
    watch: {
       otherUser(value){
           if(value !== null && value !== undefined){
           this.comments = this.$store.getters.otherUser.comments,
           this.commentsLength = this.$store.getters.otherUser.comments.length
           this.nameForRoomUser = this.$store.getters.otherUser.displayName,
           this.imageForRoomUser = this.$store.getters.otherUser.photoURL,
           this.introduction = this.$store.getters.otherUser.introduction
           }
       }
    },
    computed: {
        otherUser(){
        return this.$store.getters.otherUser
        },
       initalPhotoUrl(){
         return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       }
    }
  }
</script>
