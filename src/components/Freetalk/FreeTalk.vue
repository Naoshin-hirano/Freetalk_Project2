<template>
    <v-container>
        <v-layout xs12 sm10 md8>
            <v-flex>
                <v-card max-width="1000" class="mx-auto">
                    <v-card-title>
                        <div class="ml-10">
                            <profile-others  :freetalk="freetalk"></profile-others>
                        </div>
                        <h3 class="ml-15">{{ freetalk.title }}</h3>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-layout mb-7>
                            <v-flex >
                                <likes-btn></likes-btn>
                            </v-flex>
                            <v-flex>
                                 <delete-free-talk :freetalk="freetalk" width="500"></delete-free-talk>
                            </v-flex>
                            <v-flex>
                                <edit-free-talk :freetalk="freetalk"></edit-free-talk>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-img
                     :src="freetalk.imageUrl"
                     height="500"
                    ></v-img>
                    <v-card-text>
                        <p class="primary--text">{{ freetalk.date | date }} - {{ freetalk.location}}</p>
                        <v-chip-group column class="ml-3">
                           <div class="mr-10">
                               <edit-date
                                :freetalk="freetalk"
                                ></edit-date>
                            </div>
                            <div class="ml-5">
                                <edit-time
                                :freetalk="freetalk"
                                ></edit-time>
                            </div>
                        </v-chip-group>
                        <div class="mt-5 mb-5">{{ freetalk.description }}</div>
                    </v-card-text>
                    <v-layout>
                        <v-flex xs3 sm3 md3>
                            <h3 class="ml-5">出席者Pick Up</h3>
                        </v-flex>
                        <v-flex xs3 sm3 md3>
                             <v-btn
                            :to="'/freetalks/' + freetalk.id + '/attendance/'"
                            text
                            class="blue--text"
                            v-show="filterAttendance.length">
                            <v-icon large color="blue">mdi-chevron-left</v-icon>
                            <h3>全出席者({{ filterAttendance.length }})を見る</h3>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                        <show-attendees></show-attendees>
                        <v-spacer></v-spacer>
                        <register-dialog class="mr-2 mt-10" :freetalkId="freetalk.id"></register-dialog>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
   props: ["id"],
   computed: {
     freetalk(){
      return this.$store.getters.loadedFreeTalk(this.id) 
     },
     user(){
      return this.$store.getters.user
     },
     filterAttendance(){
        return this.$store.getters.filterAttendance(this.$route.params.id)
      }
   }
}
</script>