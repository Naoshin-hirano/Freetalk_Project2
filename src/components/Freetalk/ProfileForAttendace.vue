<template>
  <v-row justify="center">
    <v-dialog
     v-model="editDialog"
     persistent width="900px">
        <template
        v-slot:activator="{ on, attrs }">
            <v-btn
            height="70px"
            fab accent
            v-bind="attrs"
            v-on="on">
                <v-avatar size="85">
                    <v-img
                    v-if="user.photoURL"
                    :src="user.photoURL"
                    alt="John">
                    </v-img>
                    <v-img
                    v-else
                    src="https://soma-engineering.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"
                    alt="John">
                    </v-img>
                </v-avatar>
            </v-btn>
        </template>
        <v-card>
            <v-container>
                <v-layout>
                    <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                        <v-card>
                            <v-card-actions class="text-right">
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-card-actions>
                                    <v-btn @click="editDialog=false"
                                           fab accent 
                                           class="blue--text darken-1">
                                           <v-icon>mdi-window-close</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card-actions>
                            <v-container>
                                <v-layout class="text-center">
                                    <v-flex>
                                        <v-avatar size="180">
                                            <img
                                            v-if="user.photoURL"
                                            :src="user.photoURL"
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
                                        <h3>{{ user.displayName }}</h3>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex class="text-right">
                                        <!-- <good-btn></good-btn> -->
                                    </v-flex>
                                    <v-flex class="text-left">
                                        <div>
                                            <v-btn icon 
                                                color="green"
                                                :to="'/comment/' + member.uid">
                                                <v-icon left>mdi-comment-multiple-outline</v-icon>
                                            </v-btn>
                                            <span>{{ comments.length }} COMMENTS</span>
                                        </div>
                                    </v-flex>
                                </v-layout>
                                <v-layout class="text-center" mt-12>
                                    <v-flex>
                                        <v-card>
                                            <v-card-title>Self-introduction</v-card-title>
                                        <v-card-text>{{ user.introduction }}</v-card-text>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import db from 'firebase'
  export default {
    props: ["member"],
    data(){
      return {
        editDialog: false,
        user: {
          displayName: "",
          id: "",
          introduction: "",
          photoURL: ""
        }
      }
    },
    computed:{
       comments(){
        const comments = this.$store.state.comments
        return comments.filter((comment)=>{
          return comment.roomUserId.match(this.member.uid)
         })
       }
    },
    created(){
        const uid = this.member.uid
        db.database().ref("/users/" + uid).once("value")
        .then(data =>{
            console.log(data.val())
            this.user.displayName = data.val().displayName,
            this.user.id = data.val().id,
            this.user.introduction = data.val().introduction,
            this.user.photoURL = data.val().photoURL
        })
        .catch(error =>{ 
            console.log(error)
        })
    } 
  }
</script>