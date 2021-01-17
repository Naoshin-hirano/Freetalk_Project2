<template>
    <v-container>
      <v-card>
          <v-layout row wrap class="mb-5 pt-5">
              <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                    <v-container>
                        <v-layout row wrap>
                            <h3>出席者リスト</h3>
                        </v-layout>
                    </v-container>
              </v-flex>
          </v-layout>
          <v-layout row wrap v-for="member in filterAttendance" :key="member.userName" mb-1>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card class="grey lighten-3">
                  <v-container>
                    <v-layout>
                        <v-flex xs4 sm3 md3>
                              <v-avatar size="80" class="ml-8">
                                <profile-for-attendace :member="member"></profile-for-attendace>
                              </v-avatar>
                        </v-flex>
                        <v-flex xs5 sm5 md4>
                              <h3 class="pt-4">{{ member.userName }}</h3>
                              <p>{{ member.datetime | date}}</p>
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