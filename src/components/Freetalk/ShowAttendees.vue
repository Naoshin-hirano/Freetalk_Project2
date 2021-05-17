<template>
    <v-container>
        <v-layout row wrap>
            <v-flex v-show="!loading" xs4 sm3 md3 v-for="member in showThreeAttendees" :key="member.attendKey">
                <v-card class="grey lighten-3 ma-2" width="70%" height="150">
                    <v-layout class="text-center">
                        <v-flex>
                            <v-btn
                            text
                            height="80px"
                            fab accent
                            :to="'/profileforothers/' + member.uid">
                                <v-avatar size="70" class="hidden-xs-only">
                                    <img
                                    v-if="member.photoURL"
                                    :src="member.photoURL"
                                    alt="John">
                                    <img
                                    v-else
                                    src="@/assets/anonymous.jpg"
                                    alt="John">
                                </v-avatar>
                                <v-avatar size="55" class="hidden-sm-and-up">
                                    <img
                                    v-if="member.photoURL"
                                    :src="member.photoURL"
                                    alt="John">
                                    <img
                                    v-else
                                    src="@/assets/anonymous.jpg"
                                    alt="John">
                                </v-avatar>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-layout class="text-center">
                        <v-flex v-if="member.userName">
                            <h4 class="hidden-xs-only">{{ member.userName }}</h4>
                            <span class="hidden-sm-and-up caption">{{ member.userName }}</span>
                        </v-flex>
                        <v-flex v-else>
                            <h4 class="hidden-xs-only">{{$t('anonymous')}}</h4>
                            <span class="hidden-sm-and-up caption">{{$t('anonymous')}}</span>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex class="text-center" v-show="loading" xs4 sm3 md3>
                <v-progress-circular
                color="purple"
                indeterminate
                size="64"
                ></v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-show="!filterAttendance.length">
            <v-flex xs8 sm8 md8>
                <v-card class="grey lighten-3 ma-2 hidden-xs-only">
                    <v-card-text>{{$t('no_members')}}</v-card-text>
                </v-card>
                <v-card class="grey lighten-3 pl-9 hidden-sm-and-up caption">
                    <p class="mb-0">{{$t('no_members')}}</p>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    computed: {
      //いま見ているFREETALKの出席者情報を取得
      filterAttendance(){
        return this.$store.getters.attendance.filter((data) =>{
          return data.freetalkId === this.$route.params.id
        })
      },
      //いま見ているFREETALKの出席者情報の中から３名を表示
      showThreeAttendees(){
        return this.filterAttendance.slice(0, 3)
      },
      //ローディング
       loading(){
          return this.$store.getters.loading
       }
    }
  }
</script>

<style scoped>
 span{
  line-height: 0%;
 }
</style>