<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs4 sm3 md3 v-for="member in showThreeAttendees" :key="member.userName">
                <v-card class="grey lighten-3 ma-2" width="150" height="150">
                    <v-layout class="text-center">
                        <v-flex>
                            <v-avatar size="70">
                            <profile-for-attendace :member="member"></profile-for-attendace>
                            </v-avatar>
                        </v-flex>
                    </v-layout>
                    <v-layout class="text-center">
                        <v-flex>
                            <h4>{{ member.userName }}</h4>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-show="!filterAttendance.length">
            <v-flex xs8 sm8 md8>
                <v-card class="grey lighten-3 ma-2">
                    <v-card-text>出席者はいません</v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    created(){
      console.log(this.$store.getters.attendance)
    },
    computed: {
      filterAttendance(){
        return this.$store.getters.attendance.filter((data) =>{
          return data.freetalkId === this.$route.params.id
        })
      },
      showThreeAttendees(){
        return this.filterAttendance.slice(0, 3)
      }
    }
  }
</script>