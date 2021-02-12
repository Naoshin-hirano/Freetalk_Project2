<template>
    <v-container>
      <v-card>
          <v-layout row wrap class="mb-5 pt-5">
              <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                    <v-container>
                        <v-layout wrap>
                            <h3 class="hidden-xs-only">出席者リスト</h3>
                            <h5 class="hidden-sm-and-up pl-3">出席者リスト</h5>
                        </v-layout>
                    </v-container>
              </v-flex>
          </v-layout>
          <v-layout wrap v-for="member in filterAttendance" :key="member.userName" mb-1>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card class="grey lighten-3">
                  <v-container>
                    <v-layout>
                        <v-flex xs4 sm3 md3>
                               <v-btn
                                class="ml-3 hidden-xs-only"
                                text
                                height="80px"
                                fab accent
                                :to="'/profileforothers/' + member.uid">
                                    <v-avatar size="70" >
                                        <img
                                        v-if="member.photoURL"
                                        :src="member.photoURL"
                                        alt="John">
                                        <img
                                        v-else
                                        :src="initalPhotoUrl"
                                        alt="John">
                                    </v-avatar>
                                </v-btn>
                                <v-btn
                                class="ml-3 hidden-sm-and-up"
                                text
                                height="60px"
                                fab accent
                                :to="'/profileforothers/' + member.uid">
                                    <v-avatar size="60">
                                        <img
                                        v-if="member.photoURL"
                                        :src="member.photoURL"
                                        alt="John">
                                        <img
                                        v-else
                                        :src="initalPhotoUrl"
                                        alt="John">
                                    </v-avatar>
                                </v-btn>
                        </v-flex>
                        <v-flex xs5 sm5 md4>
                              <h3 class="pt-4 hidden-xs-only">{{ member.userName }}</h3>
                              <p class="hidden-xs-only">{{ member.datetime | date}}</p>
                              <h3 class="pt-0 hidden-sm-and-up font-weight-bold body-2">{{ member.userName }}</h3>
                              <p class="hidden-sm-and-up caption mb-0">{{ member.datetime | date}}</p>
                        </v-flex>
                    </v-layout>
                  </v-container>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
              <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                    <v-container>
                        <v-layout row wrap>
                              <v-card-actions>
                                <v-btn 
                                @click="$router.go(-1)" 
                                text 
                                class="blue--text darken-1">
                                  <v-icon large>mdi-chevron-left</v-icon>
                                  戻る
                                </v-btn>
                              </v-card-actions>
                        </v-layout>
                    </v-container>
              </v-flex>
          </v-layout>
       </v-card>
    </v-container>
</template>

<script>
  export default {
    computed: {
      // filterAttendance(){
      //   return this.$store.getters.filterAttendance(this.$route.params.id)
      // },
      filterAttendance(){
        return this.$store.getters.attendance.filter((data) =>{
          return data.freetalkId === this.$route.params.id
        })
      }
    }
  }
</script>