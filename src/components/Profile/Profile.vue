<template>
    <v-container>
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
                           <deleteUserAccount/>
                         </v-flex>
                       </v-layout>
                    </v-card-actions>
                    <v-container>
                        <v-layout class="text-center">
                            <v-flex class="hidden-xs-only">
                                <v-avatar v-if="loggedinUserInfo" size="180">
                                    <img
                                    :src="loggedinUserInfo.photoURL"
                                    alt="John">
                                </v-avatar>
                                <v-avatar v-else size="180">
                                  <img
                                    :src="initalPhotoUrl"
                                    alt="John">
                                </v-avatar>
                            </v-flex>
                            <v-flex class="hidden-sm-and-up">
                                <v-avatar v-if="loggedinUserInfo" size="100">
                                    <img
                                    :src="loggedinUserInfo.photoURL"
                                    alt="John">
                                </v-avatar>
                                <v-avatar v-else size="100">
                                  <img
                                    :src="initalPhotoUrl"
                                    alt="John">
                                </v-avatar>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-1 mb-10>
                            <v-flex >
                                <h3 v-if="loggedinUserInfo">{{ loggedinUserInfo.displayName }}</h3>
                            </v-flex>
                        </v-layout>
                         <v-layout mr-15>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="ml-4"
                                    v-if="loggedinUserInfo && loggedinUserInfo.id"
                                    :to="'/comment/' + loggedinUserInfo.id">
                                  <v-icon class="hidden-xs-only" left color="green">mdi-comment-multiple-outline</v-icon>
                                  <v-icon class="hidden-sm-and-up" small color="green">mdi-comment-multiple-outline</v-icon>
                                  <span class="hidden-xs-only">{{ loggedinUserInfo ? comments.length : 0 }} コメントを見る</span>
                                  <span class="hidden-sm-and-up font-weight-bold caption">{{ loggedinUserInfo ? comments.length : 0 }} コメントを見る</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3 class="mt-1 ml-0">
                                <v-icon class="hidden-xs-only" left color="orange darken-2">mdi-star</v-icon>
                                <v-icon class="hidden-sm-and-up" small color="orange darken-2">mdi-star</v-icon>
                                <span class="hidden-xs-only">{{ loggedinUserInfo ? followers.length : 0 }} 人から高評価</span>
                                <span class="hidden-sm-and-up caption">{{ loggedinUserInfo ? followers.length : 0 }} 人から高評価</span>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-12>
                            <v-flex>
                                <v-card class="grey lighten-3 ma-2 hidden-xs-only">
                                    <h3>自己紹介</h3>
                                   <v-card-text>
                                     <h3 v-if="loggedinUserInfo">{{ loggedinUserInfo.introduction }}</h3>
                                   </v-card-text>
                                </v-card>
                                <v-card class="grey lighten-3 ma-2 hidden-sm-and-up">
                                    <h5>自己紹介</h5>
                                   <v-card-text>
                                     <span class="caption" v-if="loggedinUserInfo">{{ loggedinUserInfo.introduction }}</span>
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
  import firebase from "firebase"
  import myTabs from '../Profile/MyTabs.vue'
  import editProfile from '../Profile/EditProfile.vue'
  import deleteUserAccount from '../User/DeleteUser.vue'
  export default {
    components: { myTabs, editProfile, deleteUserAccount },
    data () {
      return {
        editDialog: false,
        uid: null,
        loggedinUserInfo: null
      }
    },
    created(){//画面を開くたびに評価数の更新
      firebase.auth().onAuthStateChanged(user =>{
        this.uid = user.uid
        this.$store.dispatch("fetchUserData")
        firebase.database().ref("/users/" + user.uid).on('value', (snap)=>{
          this.loggedinUserInfo = snap.val()
        })
      })
    },
    computed: {
       followers(){//valueからlength取れないので、computedで取得
         return this.loggedinUserInfo ? this.$store.getters.user.followers : null
       },
       comments(){//valueからlength取れないので、computedで取得
         return this.loggedinUserInfo ? this.$store.getters.user.comments : null
       },
       initalPhotoUrl(){
         return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       }
    }
  }
</script>
