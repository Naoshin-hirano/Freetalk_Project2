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
                           <edit-profile></edit-profile>
                         </v-flex>
                         <v-flex>
                           <delete-user-account></delete-user-account>
                         </v-flex>
                       </v-layout>
                    </v-card-actions>
                    <v-container>
                        <v-layout class="text-center">
                            <v-flex>
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
                        </v-layout>
                        <v-layout class="text-center" mt-1 mb-10>
                            <v-flex >
                                <h3 v-if="loggedinUserInfo">{{ loggedinUserInfo.userName }}</h3>
                            </v-flex>
                        </v-layout>
                         <v-layout mr-15>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="ml-4"
                                    v-if="loggedinUserInfo && loggedinUserInfo.id"
                                    :to="'/comment/' + loggedinUserInfo.id">
                                  <v-icon left color="green">mdi-comment-multiple-outline</v-icon>
                                  <span>{{ loggedinUserInfo ? comments.length : 0 }} コメントを見る</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3 class="mt-1">
                                <v-icon left color="orange darken-2">mdi-star</v-icon>
                                <span>{{ loggedinUserInfo ? followers.length : 0 }} つの高評価</span>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-12>
                            <v-flex>
                                <v-card class="grey lighten-3 ma-2">
                                    <h3>自己紹介</h3>
                                   <v-card-text>
                                     <h3 v-if="loggedinUserInfo">{{ loggedinUserInfo.introduction }}</h3>
                                   </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
  import firebase from "firebase"
  export default {
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
