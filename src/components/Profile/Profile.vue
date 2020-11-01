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
                         <v-spacer></v-spacer>
                         <v-spacer></v-spacer>
                         <v-spacer></v-spacer>
                         <v-spacer></v-spacer>
                         <delete-user-account></delete-user-account>
                         <edit-profile></edit-profile>
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
                            <v-flex class="text-right">
                                <!-- <good-btn></good-btn> -->
                            </v-flex>
                            <v-flex class="text-left">
                                <!-- コメント機能 -->
                            </v-flex>
                        </v-layout>
                        <v-layout class="text-center" mt-12>
                            <v-flex>
                                <v-card>
                                    <v-card-title>Self-introduction</v-card-title>
                                   <v-card-text>{{ introduction }}</v-card-text>
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
        editDialog: false
      }
    },
    computed: {
       userName(){
         return this.$store.getters.userName
       },
       photoURL(){
         return this.$store.getters.photoURL
       },
       introduction(){
         return this.$store.getters.introduction
       }
    }
  }
</script>
