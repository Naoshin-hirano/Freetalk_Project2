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
                           <delete-user-account></delete-user-account>
                         </v-flex>
                         <v-flex>
                           <edit-profile></edit-profile>
                         </v-flex>
                       </v-layout>
                    </v-card-actions>
                    <v-container>
                        <v-layout class="text-center">
                            <v-flex>
                                <v-avatar size="180">
                                    <img
                                    v-if="photoURL"
                                    :src="photoURL"
                                    alt="John">
                                    <img
                                    v-else
                                    src="https://soma-engineering.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"
                                    alt="John">
                                </v-avatar>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-1 mb-10>
                            <v-flex >
                                <h3>{{ userName }}</h3>
                            </v-flex>
                        </v-layout>
                         <v-layout>
                            <v-flex xs12 sm10 md8 offset-xs2 offset-sm3 offset-md3>
                              <v-btn icon
                                    class="mt-3 ml-5"
                                    :to="'/comment/' + user.id">
                                  <v-icon color="green" large left>mdi-comment-multiple-outline</v-icon>
                                  <span>{{ comments.length }}</span>
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm10 md8 offset-sm3 offset-md3> 
                                <follow-user></follow-user>
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-12>
                            <v-flex>
                                <v-card class="grey lighten-3 ma-2">
                                    <v-card-title>自己紹介</v-card-title>
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
        id: location.href.split("/"),
      }
    },
    computed: {
       user(){
         return this.$store.getters.user
       },
       userName(){
         return this.$store.getters.userName
       },
       photoURL(){
         return this.$store.getters.photoURL
       },
       introduction(){
         return this.$store.getters.introduction
       },
       comments(){
        const comments = this.$store.state.comments
        return comments.filter((comment)=>{
          return comment.roomUserId.match(this.id[this.id.length - 1])
        })
     },
    }
  }
</script>
