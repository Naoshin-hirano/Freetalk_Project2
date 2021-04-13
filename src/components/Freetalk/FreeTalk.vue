<template>
    <v-container>
        <v-layout xs12 sm10 md8>
            <v-flex>
                <v-card max-width="1000" class="mx-auto">
                    <v-layout class="pb-0 ml-5 pt-2">
                        <p v-if="freetalk" class="subtitle-1 mb-0">{{ freetalk.date | date }}</p>
                    </v-layout>
                    <v-layout>
                        <v-flex>
                            <h1 class="hidden-xs-only ml-5">{{ freetalk ? freetalk.title : "" }}</h1>
                            <h3 class="ml-5 hidden-sm-and-up">{{ freetalk ? freetalk.title : "" }}</h3>
                        </v-flex>
                    </v-layout>
                    <v-layout class="mt-2 mb-4">
                        <v-flex class="hidden-xs-only ml-5">
                            <v-btn
                            class="hidden-xs-only"
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
                            <span v-if="freetalk" class="title ml-2 pb-0">開催者: {{ freetalk.createrName }}</span>
                        </v-flex>
                         <v-flex class="ml-3 hidden-sm-and-up">
                            <v-btn
                            width="20"
                            height="20"
                            class="ml-3"
                            v-if="freetalk"
                            fab accent
                            :to="'/profileforothers/' + freetalk.createrId">
                                <v-avatar size="40">
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
                            <span v-if="freetalk" class="body-1 ml-5">開催者: <span class="subtitle-2">{{ freetalk.createrName }}</span></span>
                        </v-flex>
                        <div>
                            <v-layout v-if="freetalk">
                                <v-flex >
                                    <deleteFreeTalk v-show="freetalk.createrId === userId" :freetalk="freetalk" width="400"/>
                                </v-flex>
                                <v-flex class="ml-15">
                                    <editFreeTalk v-show="freetalk.createrId === userId" :freetalk="freetalk"/>
                                </v-flex>
                                <v-flex class="text-right mr-2 ml-6">
                                    <likesBtn v-show="freetalk" :freetalk="freetalk"/>
                                </v-flex>
                            </v-layout>
                        </div>
                    </v-layout>
                    <div class="hidden-sm-and-up">
                            <v-layout v-if="freetalk">
                                <v-flex class="ml-15 pl-11">
                                    <deleteFreeTalk v-show="freetalk.createrId === userId" :freetalk="freetalk" width="400"/>
                                </v-flex>
                                <v-flex class="ml-3">
                                    <editFreeTalk v-show="freetalk.createrId === userId" :freetalk="freetalk"/>
                                </v-flex>
                                <v-flex class="text-right">
                                    <likesBtn v-show="freetalk" :freetalk="freetalk"/>
                                </v-flex>
                            </v-layout>
                        </div>
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
                        <p v-if="freetalk" class="mb-0">開催日時： <span class="primary--text">{{ freetalk.date | date }} -</span></p>
                        <p v-if="freetalk" class="mb-0">開催場所： <span class="primary--text">{{ freetalk.location}}</span></p>
                        <p v-if="freetalk" class="mb-0">言語： <span class="primary--text">{{ freetalk.language }}</span></p>
                    </v-card-text>
                    <v-layout mb-7>
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
                    </v-layout>
                        
                    <v-layout>
                        <h3 class="ml-5 hidden-xs-only">詳細</h3>
                        <h5 class="hidden-sm-and-up ml-4">詳細</h5>
                    </v-layout>
                    <v-card-text>
                        <div v-if="freetalk" class="mb-5 ml-1">{{ freetalk.description }}</div>
                    </v-card-text>
                    <v-layout>
                        <v-flex xs3 sm3 md3>
                            <h3 class="ml-5 hidden-xs-only">出席者Pick Up</h3>
                            <h5 class="ml-4 hidden-sm-and-up">出席者PickUp</h5>
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
                        <v-flex class="hidden-sm-and-up">
                            <registerDialog class="ml-16" v-if="freetalk" :freetalkId="freetalk.id"/>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                        <showAttendees class="pb-0"/>
                        <v-spacer></v-spacer>
                        <registerDialog class="mr-2 mt-10 hidden-xs-only" v-if="freetalk" :freetalkId="freetalk.id"/>
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
   //データ変更後もリアルタイムで更新
   beforeUpdate(){
      this.$store.dispatch('loadedAttendance')
   },
   computed: {
     //いまの画面のFREETALKを取得
     freetalk(){
      return this.id ? this.$store.getters.loadedFreeTalk(this.id) : null
     },
     //ログインユーザーの情報を取得
     userId(){
      return this.$store.getters.user ? this.$store.getters.user.id : null
     },
     //いまの画面のFREETALKに登録している参加者を取得
    filterAttendance(){
        return this.$store.getters.attendance.filter((data) =>{
          return data.freetalkId === this.$route.params.id
        })
      }
   }
}
</script>