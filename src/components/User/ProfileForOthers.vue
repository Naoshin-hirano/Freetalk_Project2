<template>
    <v-container>
        <v-layout>
            <v-flex>
                <v-card>
                    <v-container>
                        <v-layout class="text-center" v-if="!loading">
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
                        <v-layout class="text-center" v-else>
                          <v-flex>
                             <v-avatar size="100">
                                <v-progress-circular
                                color="purple"
                                indeterminate>
                                </v-progress-circular>
                             </v-avatar>
                          </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-1 mb-10>
                            <v-flex >
                                <h3 v-if="nameForRoomUser">{{ nameForRoomUser }}</h3>
                                <h3 v-else>名無し</h3>
                            </v-flex>
                        </v-layout>
                         <v-layout mr-12>
                            <v-flex xs12 sm10 md8 offset-xs3 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="mt-3 ml-2"
                                    :to="'/comment/' + this.url[this.url.length - 1]">
                                  <v-icon color="green" class="hidden-xs-only" large left>mdi-comment-multiple-outline</v-icon>
                                  <v-icon color="green" class="hidden-sm-and-up">mdi-comment-multiple-outline</v-icon>
                                  <span class="hidden-xs-only">{{ otherUser ? comments.length : 0 }} コメントを見る</span>
                                  <span class="hidden-sm-and-up body-2">{{ otherUser ? comments.length : 0 }} コメントを見る</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-xs3 offset-sm3 offset-md3> 
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
                                    <h4>自己紹介</h4>
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
       <v-layout class="text-center">
          <v-flex>
              <v-overlay v-show="loading">
                <v-progress-circular
                  indeterminate
                  size="64">
                </v-progress-circular>
              </v-overlay>
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
        //ダイアログ
        editDialog: false,
        //URLを取得
        url: location.href.split("/")
      }
    },
    created(){
        //画面上のユーザー情報取得
        this.$store.dispatch("fetchOtherUserData", this.url[this.url.length - 1])
        //プロフィール画面に遷移する度に各タブのリストが更新される
        this.$store.dispatch('loadedFreeTalks')
    },
    computed: {
       //画面上のユーザー情報を取得
       otherUser(){
         return this.$store.getters.otherUser
        },
        //画面上のユーザーのコメント
        comments(){
          return this.otherUser ? this.$store.getters.otherUser.comments : ""
        },
        //画面上のユーザーの名前
        nameForRoomUser(){
          return this.otherUser ? this.$store.getters.otherUser.displayName : ""
        },
        //画面上のユーザーのアイコン
        imageForRoomUser(){
          return this.otherUser ? this.$store.getters.otherUser.photoURL : "" 
        },
        //画面上のユーザーの自己紹介
        introduction(){
          return this.otherUser ? this.$store.getters.otherUser.introduction : ""
        },
        //ローディング
        loading(){
          return this.$store.getters.loading
        }
     }
  }
</script>
