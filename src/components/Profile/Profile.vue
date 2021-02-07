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
                                <v-avatar v-if="photoURL" size="180">
                                    <img
                                    :src="photoURL"
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
                                <h3>{{ userName }}</h3>
                            </v-flex>
                        </v-layout>
                         <v-layout mr-15>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="ml-4"
                                    :to="'/comment/' + user.id">
                                  <v-icon left color="green">mdi-comment-multiple-outline</v-icon>
                                  <span>{{ comments.length }} コメントを見る</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3 class="mt-1">
                                <v-icon left color="orange darken-2">mdi-star</v-icon>
                                <span>{{ followers ? followers.length : 0 }} つの高評価</span>
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
        id: ""
      }
    },
    created(){
      this.$store.dispatch("fetchUserData")
      this.id = location.href.split("/")
    },
    computed: {
       user(){
         return this.$store.getters.user
       },
       followers(){
          return this.user ? this.$store.getters.user.followers : null
      },
       userName(){
         return this.$store.getters.userName
       },
       photoURL(){
         return this.$store.getters.photoURL
       },
       initalPhotoUrl(){
         return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       },
       introduction(){
         return this.$store.getters.user.introduction
       },
       comments(){
        return this.$store.getters.user.comments
      }
    }
  }
</script>
