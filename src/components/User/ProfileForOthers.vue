<template>
    <v-container>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-container>
                        <v-layout class="text-center" v-show="!loading">
                            <v-flex class="hidden-xs-only">
                                <v-avatar v-if="imageForRoomUser" size="180">
                                    <img
                                    :src="imageForRoomUser"
                                    alt="John">
                                </v-avatar>
                                <v-avatar v-else size="180">
                                    <img
                                    src="@/assets/anonymous.jpg"
                                    alt="John">
                                </v-avatar>
                            </v-flex>
                            <v-flex class="hidden-sm-and-up">
                                <v-avatar v-if="imageForRoomUser" size="100">
                                    <img
                                    :src="imageForRoomUser"
                                    alt="John">
                                </v-avatar>
                                <v-avatar v-else size="100">
                                    <img
                                    src="@/assets/anonymous.jpg"
                                    alt="John">
                                </v-avatar>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" v-show="loading">
                          <v-flex>
                              <v-progress-circular
                                color="purple"
                                indeterminate
                                size="64"
                              ></v-progress-circular>
                          </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-1 mb-10>
                            <v-flex >
                                <h3 v-if="nameForRoomUser">{{ nameForRoomUser }}</h3>
                                <h3 v-else>名無し</h3>
                            </v-flex>
                        </v-layout>
                         <v-layout>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="mt-3 ml-5"
                                    :to="'/comment/' + this.url[this.url.length - 1]">
                                  <v-icon color="green" class="hidden-xs-only" large left>mdi-comment-multiple-outline</v-icon>
                                  <v-icon color="green" class="hidden-sm-and-up">mdi-comment-multiple-outline</v-icon>
                                  <span class="hidden-xs-only">{{ otherUser ? comments.length : 0 }} コメントを見る</span>
                                  <span class="hidden-sm-and-up caption">{{ otherUser ? comments.length : 0 }} コメントを見る</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-sm3 offset-md3> 
                                <followUser/>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-12>
                            <v-flex>
                                <v-card class="grey lighten-3 ma-2 hidden-xs-only">
                                    <h3>自己紹介</h3>
                                   <v-card-text>
                                     <h3>{{ introduction }}</h3>
                                   </v-card-text>
                                </v-card>
                                 <v-card class="grey lighten-3 ma-2 hidden-sm-and-up">
                                    <h5>自己紹介</h5>
                                   <v-card-text>
                                     <span class="caption">{{ introduction }}</span>
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
                <tabsForOthers/>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
  import tabsForOthers from '../User/TabsForOthers.vue'
  import followUser from '../User/FollowUser.vue'
  export default {
    components: { tabsForOthers, followUser },
    data () {
      return {
        editDialog: false,
        url: location.href.split("/"),
        loggedinUserInfo: null
      }
    },
    created(){
        this.$store.dispatch("fetchOtherUserData", this.url[this.url.length - 1])
        this.$store.dispatch('loadedFreeTalks')
        this.$store.dispatch('loadedAttendance')
        this.$store.dispatch("loadedFav")
    },
    computed: {
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
        introduction(){
          return this.otherUser ? this.$store.getters.otherUser.introduction : ""
        },
        loading(){
          return this.$store.getters.loading
        }
     }
  }
</script>
