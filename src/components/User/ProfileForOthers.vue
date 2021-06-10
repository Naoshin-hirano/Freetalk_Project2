<template>
    <v-container>
        <v-layout class="text-center">
          <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
              <v-overlay v-show="loading">
                <v-progress-circular
                  indeterminate
                  size="64">
                </v-progress-circular>
              </v-overlay>
          </v-flex>
       </v-layout>
        <v-layout>
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3> 
                <v-card>
                    <v-container>
                        <v-layout
                         v-if="currentUser"
                         class="text-right mb-2">
                          <v-flex v-show="uid !== currentUser.id">
                             <followButton/>
                          </v-flex>
                        </v-layout>
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
                        <v-layout class="text-center" mt-1 mb-10>
                            <v-flex >
                                <h3 v-if="nameForRoomUser">{{ nameForRoomUser }}</h3>
                                <h3 v-else>{{$t('anonymous')}} </h3>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center">
                            <v-flex>
                              <v-btn icon
                                    v-if="currentUser"
                                    :to="'/comment/' + currentUser.id">
                                  <v-icon class="hidden-xs-only" left color="green">mdi-comment-multiple-outline</v-icon>
                                  <v-icon class="hidden-sm-and-up mr-1" color="green">mdi-comment-multiple-outline</v-icon>
                                  <span class="hidden-xs-only body-1" v-if="currentUser"><strong>{{ currentUser ? comments.length : 0 }}</strong> {{$t('comment_for_user')}} </span>
                                  <span class="hidden-sm-and-up font-weight-bold body-2 ml-1" v-if="currentUser"><strong>{{ currentUser ? comments.length : 0 }}</strong> <span class="ml-1">{{$t('comment_for_user')}}</span> </span>
                              </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center mt-5">
                          <v-flex>
                              <span class="hidden-xs-only" v-if="currentUser"><strong>{{ currentUser ? following.length : 0 }}</strong> <span class="ml-2">{{$t('follow')}}</span></span>
                              <span class="hidden-sm-and-up body-2" v-if="currentUser"><strong>{{ currentUser ? following.length : 0 }}</strong> <span class="ml-1">{{$t('follow')}} </span></span>
                          </v-flex>
                          <v-flex>
                              <span class="hidden-xs-only" v-if="currentUser"><strong>{{ currentUser ? followers.length : 0 }}</strong> <span class="ml-2"></span>{{$t('follower')}} </span>
                              <span class="hidden-sm-and-up body-2" v-if="currentUser"><strong>{{ currentUser ? followers.length : 0 }}</strong> <span class="ml-1">{{$t('follower')}} </span></span>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-12>
                            <v-flex>
                                <v-card class="grey lighten-3 ma-2 hidden-xs-only">
                                    <h3>{{$t('introduction')}} </h3>
                                   <v-card-text>
                                     <h3>{{ introduction }}</h3>
                                   </v-card-text>
                                </v-card>
                                 <v-card class="grey lighten-3 ma-2 hidden-sm-and-up">
                                    <h4>{{$t('introduction')}} </h4>
                                   <v-card-text>
                                     <span class="caption">{{ introduction }}</span>
                                   </v-card-text>
                                </v-card>
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
  import followButton from '../User/FollowButton.vue'
  export default {
    components: { tabsForOthers , followButton },
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
      //ログインアカウントユーザー
       uid(){
         return this.$store.getters.user ? this.$store.getters.user.id : ""
       },
       //画面上のユーザー情報を取得
       currentUser(){
         return this.$store.getters.otherUser
        },
        //画面上のユーザーのコメント
        comments(){
          return this.currentUser ? this.$store.getters.otherUser.comments : ""
        },
        //画面上のユーザーの名前
        nameForRoomUser(){
          return this.currentUser ? this.$store.getters.otherUser.displayName : ""
        },
        //ログインユーザーのフォロー
       following(){
         return this.currentUser ? this.$store.getters.otherUser.following : null
       },
       //ログインユーザーのフォロワー
       followers(){
         return this.currentUser ? this.$store.getters.otherUser.followers : null
       },
        //画面上のユーザーのアイコン
        imageForRoomUser(){
          return this.currentUser ? this.$store.getters.otherUser.photoURL : "" 
        },
        //画面上のユーザーの自己紹介
        introduction(){
          return this.currentUser ? this.$store.getters.otherUser.introduction : ""
        },
        //ローディング
        loading(){
          return this.$store.getters.loading
        }
     }
  }
</script>
