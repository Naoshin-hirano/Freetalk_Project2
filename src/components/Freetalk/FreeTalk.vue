<template>
    <v-container>
        <v-layout xs12 sm10 md8>
            <v-flex>
                <v-card max-width="1000" class="mx-auto">
                    <v-card-title class="pt-5">
                        <div class="hidden-xs-only ml-10">
                            <v-btn
                            v-if="freetalk"
                            height="70px"
                            fab accent
                            :to="'/profileforothers/' + freetalk.createrId">
                                <v-avatar size="85">
                                    <img
                                    v-if="freetalk.photoURL"
                                    :src="freetalk.photoURL"
                                    alt="John">
                                    <img
                                    v-else
                                    src="@/assets/anonymous.jpg"
                                    alt="John">
                                </v-avatar>
                            </v-btn>
                        </div>
                        <div class="hidden-sm-and-up mb-3">
                            <v-btn
                            v-if="freetalk"
                            fab accent
                            :to="'/profileforothers/' + freetalk.createrId">
                                <v-avatar size="55">
                                    <img
                                    v-if="freetalk.photoURL"
                                    :src="freetalk.photoURL"
                                    alt="John">
                                    <img
                                    v-else
                                    src="@/assets/anonymous.jpg"
                                    alt="John">
                                </v-avatar>
                            </v-btn>
                        </div>
                        <h3 class="ml-15 hidden-xs-only">{{ freetalk ? freetalk.title : "" }}</h3>
                        <h5 class="ml-3 hidden-sm-and-up">{{ freetalk ? freetalk.title : "" }}</h5>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-layout mb-7>
                            <v-flex v-if="freetalk">
                                 <deleteFreeTalk v-show="freetalk.createrId === userId" :freetalk="freetalk" width="500"/>
                            </v-flex>
                            <v-flex v-if="freetalk">
                                <editFreeTalk v-show="freetalk.createrId === userId" :freetalk="freetalk"/>
                            </v-flex>
                            <v-flex>
                                <likesBtn v-show="freetalk" :freetalk="freetalk"/>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-img
                     v-if="freetalk"
                     :src="freetalk.imageUrl"
                     height="500"
                     class="hidden-xs-only"
                    ></v-img>
                    <v-img
                     v-if="freetalk"
                     :src="freetalk.imageUrl"
                     height="200"
                     class="hidden-sm-and-up"
                    ></v-img>
                    <v-card-text>
                        <p v-if="freetalk" class="primary--text mb-0">{{ freetalk.date | date }} - {{ freetalk.location}}</p>
                        <p v-if="freetalk" class="mt-0">Language: {{ freetalk.language }}</p>
                        <v-chip-group column class="ml-3">
                           <div v-if="freetalk" class="mr-10">
                               <editDate
                                v-show="freetalk.createrId === userId"
                                :freetalk="freetalk"/>
                            </div>
                            <div v-if="freetalk" class="ml-5">
                                <editTime
                                v-show="freetalk.createrId === userId"
                                :freetalk="freetalk"/>
                            </div>
                        </v-chip-group>
                        <div v-if="freetalk" class="mt-5 mb-5">{{ freetalk.description }}</div>
                    </v-card-text>
                    <v-layout>
                        <v-flex xs3 sm3 md3>
                            <h3 class="ml-5 hidden-xs-only">出席者Pick Up</h3>
                            <p class="ml-2 hidden-sm-and-up caption">出席者PickUp</p>
                        </v-flex>
                        <v-flex xs3 sm3 md3 v-show="filterAttendance.length">
                             <v-btn
                            v-if="freetalk"
                            :to="'/freetalks/' + freetalk.id + '/attendance/'"
                            text
                            class="blue--text">
                               <v-icon class="hidden-xs-only" large color="blue">mdi-chevron-left</v-icon>
                               <v-icon class="hidden-sm-and-up mb-3" color="blue">mdi-chevron-left</v-icon>
                               <h3 class="hidden-xs-only" v-if="filterAttendance">全出席者({{ filterAttendance.length }})を見る</h3>
                               <p class="hidden-sm-and-up caption" v-if="filterAttendance">全出席者({{ filterAttendance.length }})を見る</p>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                        <showAttendees class="pb-0"/>
                        <v-spacer></v-spacer>
                        <registerDialog class="mr-2 mt-10" v-if="freetalk" :freetalkId="freetalk.id"/>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import likesBtn from '../Freetalk/LikesButton.vue'
import deleteFreeTalk from '../Freetalk/DeleteFreeTalk.vue'
import editFreeTalk from '../Freetalk/EditFreeTalk.vue'
import editDate from '../Freetalk/EditDate.vue'
import editTime from '../Freetalk/EditTime.vue'
import showAttendees from '../Freetalk/ShowAttendees.vue'
import registerDialog from '../Freetalk/RegisterDialog.vue'
export default {
   components: { likesBtn, deleteFreeTalk, editFreeTalk, editDate, editTime, showAttendees, registerDialog },
   props: ["id"],
   beforeUpdate(){
      this.$store.dispatch('loadedAttendance')
   },
   computed: {
     freetalk(){
      return this.id ? this.$store.getters.loadedFreeTalk(this.id) : null
     },
     userId(){
      return this.$store.getters.user ? this.$store.getters.user.id : null
     },
    filterAttendance(){
        return this.$store.getters.attendance.filter((data) =>{
          return data.freetalkId === this.$route.params.id
        })
      }
   }
}
</script>