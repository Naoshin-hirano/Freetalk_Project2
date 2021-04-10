<template>
    <v-container>
        <v-layout class="text-center">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
              <v-overlay v-if="loading">
                  <v-progress-circular
                      indeterminate
                      size="70"
                  ></v-progress-circular>
                </v-overlay>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                       <v-layout>
                         <v-flex>
                           <editProfile/>
                         </v-flex>
                         <v-flex>
                           <v-btn :to="'/userRegisteredInfo/'" text fab accent>
                             <v-icon>mdi-cog</v-icon>
                           </v-btn>
                         </v-flex>
                       </v-layout>
                    </v-card-actions>
                    <v-container>
                        <v-layout class="text-center">
                            <v-flex class="hidden-xs-only">
                                <v-avatar v-if="photoURL" size="180">
                                    <img
                                    :src="photoURL"
                                    alt="John">
                                </v-avatar>
                                <v-avatar v-else size="180">
                                  <img
                                    src="@/assets/anonymous.jpg"
                                    alt="John">
                                </v-avatar>
                            </v-flex>
                            <v-flex class="hidden-sm-and-up">
                                <v-avatar v-if="photoURL" size="100">
                                    <img
                                    :src="photoURL"
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
                                <h3 v-if="userName">{{ userName }}</h3>
                                <h3 v-else>名無し</h3>
                            </v-flex>
                        </v-layout>
                         <v-layout mr-15>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="ml-4"
                                    v-if="currentUser"
                                    :to="'/comment/' + currentUser.id">
                                  <v-icon class="hidden-xs-only" left color="green">mdi-comment-multiple-outline</v-icon>
                                  <v-icon class="hidden-sm-and-up" small color="green">mdi-comment-multiple-outline</v-icon>
                                  <span class="hidden-xs-only" v-if="currentUser">{{ currentUser ? comments.length : 0 }} コメントを見る</span>
                                  <span class="hidden-sm-and-up font-weight-bold caption" v-if="currentUser">{{ currentUser ? comments.length : 0 }} コメントを見る</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3 class="mt-1 ml-0">
                                <v-icon class="hidden-xs-only" left color="orange darken-2">mdi-star</v-icon>
                                <v-icon class="hidden-sm-and-up" small color="orange darken-2">mdi-star</v-icon>
                                <span class="hidden-xs-only" v-if="currentUser">{{ currentUser ? followers.length : 0 }} 人から高評価</span>
                                <span class="hidden-sm-and-up caption" v-if="currentUser">{{ currentUser ? followers.length : 0 }} 人から高評価</span>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-12>
                            <v-flex>
                                <v-card class="grey lighten-3 ma-2 hidden-xs-only">
                                    <h3>自己紹介</h3>
                                   <v-card-text>
                                     <h3 v-if="currentUser">{{ currentUser.introduction }}</h3>
                                   </v-card-text>
                                </v-card>
                                <v-card class="grey lighten-3 ma-2 hidden-sm-and-up">
                                    <h5>自己紹介</h5>
                                   <v-card-text>
                                     <span class="caption" v-if="currentUser">{{ currentUser.introduction }}</span>
                                   </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
                <myTabs/>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
  import myTabs from '../User/MyTabs.vue'
  import editProfile from '../User/EditProfile.vue'
  export default {
    components: { myTabs, editProfile },
    data () {
      return {
        //ダイアログ
        editDialog: false,
      }
    },
    //プロフィール画面に遷移する度に各タブのリストが更新される
    created(){
      this.$store.dispatch('loadedFreeTalks')
      this.$store.dispatch('loadedAttendance')
      this.$store.dispatch("loadedFav")
    },
    computed: {
       //ログインユーザーの取得
       currentUser(){
         return this.$store.getters.user
       },
       //ログインユーザーのアイコン
       photoURL(){
         return this.$store.getters.user ? this.$store.getters.user.photoURL : null
       },
       //ログインユーザーの名前
       userName(){
         return this.$store.getters.user ? this.$store.getters.user.displayName : null
       },
       //ログインユーザーのフォロワー
       followers(){
         return this.currentUser ? this.currentUser.followers : null
       },
       //ログインユーザーのコメント
       comments(){
         return this.currentUser ? this.currentUser.comments : null
       },
       //ローディング
       loading(){
       return this.$store.getters.loading
      }
    }
  }
</script>
