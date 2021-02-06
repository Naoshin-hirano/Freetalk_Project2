<template>
    <v-container>
        <v-layout xs12 sm10 md8>
            <v-flex>
                <v-card max-width="1000" class="mx-auto">
                    <v-card-title>
                        <div class="ml-10">
                            <v-btn
                            height="70px"
                            fab accent
                            :to="'/profileforothers/' + creater.id">
                                <v-avatar size="85" >
                                    <v-img
                                    v-if="creater.photoURL"
                                    :src="creater.photoURL"
                                    alt="John">
                                    </v-img>
                                    <v-img
                                    v-else
                                    :src="initalPhotoUrl"
                                    alt="John">
                                    </v-img>
                                </v-avatar>
                            </v-btn>
                        </div>
                        <h3 class="ml-15">{{ freetalk.title }}</h3>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-layout mb-7>
                            <v-flex >
                                <likes-btn :freetalk="freetalk"></likes-btn>
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
                        <p class="primary--text mb-0">{{ freetalk.date | date }} - {{ freetalk.location}}</p>
                        <p class="mt-0">Language: {{ freetalk.language }}</p>
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
import db from "firebase"
export default {
   props: ["id"],
   data () {
      return {
        creater: {
          id: "",
          photoURL: ""
        }
      }
    },
   mounted(){
        db.database().ref("/users/" + this.createrId).once("value").then(data =>{
            this.creater.id = data.val().id,
            this.creater.photoURL = data.val().photoURL
        })
    },
   computed: {
     freetalk(){
      return this.$store.getters.loadedFreeTalk(this.id) 
     },
     user(){
      return this.$store.getters.user
     },
    createrId(){
      return this.freetalk.createrId
    },
    filterAttendance(){
        return this.$store.getters.attendance.filter((data) =>{
          return data.freetalkId === this.$route.params.id
        })
      },
    initalPhotoUrl(){
         return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       },
   }
}
</script>