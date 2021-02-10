<template>
    <v-container>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-container>
                        <v-layout class="text-center">
                            <v-flex>
                                <v-avatar v-if="loggedinUserInfo" size="180">
                                    <img
                                    :src="loggedinUserInfo.photoURL"
                                    alt="John">
                                </v-avatar>
                                <v-avatar v-else>
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
                         <v-layout>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="mt-3 ml-5"
                                    :to="'/comment/' + this.url[this.url.length - 1]">
                                  <v-icon color="green" large left>mdi-comment-multiple-outline</v-icon>
                                  <span>{{ loggedinUserInfo ? comments.length : 0 }} コメントを見る</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-sm3 offset-md3> 
                                <follow-user v-if="loggedinUserInfo"></follow-user>
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
  import firebase from "firebase"
  export default {
    data () {
      return {
        editDialog: false,
        url: location.href.split("/"),
        uid: null,
        loggedinUserInfo: null
      }
    },
    created(){
      firebase.auth().onAuthStateChanged(user =>{
          this.uid = user.uid
          this.$store.dispatch("fetchOtherUserData", this.url[this.url.length - 1])
          firebase.database().ref("/users/" + user.uid).on("value", (snap)=>{
              this.loggedinUserInfo = snap.val()
          })
      })
    },
    computed: {
       comments(){//valueからlength取れないので、computedで取得
         return this.loggedinUserInfo ? this.$store.getters.user.comments : null
       },
       initalPhotoUrl(){
          return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       }
    }
  }
</script>
