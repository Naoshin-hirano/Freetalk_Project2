<template>
    <v-container>
        <v-layout class="text-center">
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                  <v-skeleton-loader
                    v-if="loading"
                    class="mx-auto"
                    max-width="700"
                    type="card"
                  ></v-skeleton-loader>
            </v-flex>
        </v-layout>
        <v-layout v-if="!loading">
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
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
                                  <span class="hidden-sm-and-up body-2 ml-1" v-if="currentUser"><strong>{{ currentUser ? comments.length : 0 }}</strong> <span class="ml-1">{{$t('comment_for_user')}}</span> </span>
                              </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center mt-5">
                          <v-flex>
                              <span class="hidden-xs-only" v-if="currentUser"><strong>{{ currentUser ? following.length : 0 }}</strong><span class="ml-2">{{$t('follow')}}</span></span>
                              <span class="hidden-sm-and-up body-2" v-if="currentUser"><strong>{{ currentUser ? following.length : 0 }}</strong><span class="ml-1">{{$t('follow')}} </span></span>
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
                                     <h3 v-if="currentUser">{{ currentUser.introduction }}</h3>
                                   </v-card-text>
                                </v-card>
                                <v-card class="grey lighten-3 ma-2 hidden-sm-and-up">
                                    <h4>{{$t('introduction')}} </h4>
                                   <v-card-text>
                                     <span class="caption" v-if="currentUser">{{ currentUser.introduction }}</span>
                                   </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
                <myTabs v-if="!loading"/>
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
        editDialog: false
      }
    },
    created(){
      //画面上のユーザー情報取得
      this.$store.dispatch("fetchUserData")
      //プロフィール画面に遷移する度に各タブのリストが更新される
      this.$store.dispatch('loadedFreeTalks')
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
       //ログインユーザーのフォロー
       following(){
         return this.currentUser ? this.currentUser.following : null
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
