<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs4 sm3 md3 v-for="member in showThreeAttendees" :key="member.userName">
                <v-card class="grey lighten-3 ma-2" width="150" height="150">
                    <v-layout class="text-center">
                        <v-flex>
                            <v-btn
                            text
                            height="80px"
                            fab accent
                            :to="'/profileforothers/' + member.uid">
                                <v-avatar size="70" >
                                    <v-img
                                    v-if="member.photoURL"
                                    :src="member.photoURL"
                                    alt="John">
                                    </v-img>
                                    <v-img
                                    v-else
                                    :src="initalPhotoUrl"
                                    alt="John">
                                    </v-img>
                                </v-avatar>
                            </v-btn>
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
    computed: {
      filterAttendance(){
        return this.$store.getters.attendance.filter((data) =>{
          return data.freetalkId === this.$route.params.id
        })
      },
      showThreeAttendees(){
        return this.filterAttendance.slice(0, 3)
      },
      initalPhotoUrl(){
         return "https://cdn.icon-icons.com/icons2/1997/PNG/512/account_avatar_people_profile_user_icon_123297.png"
       },
    }
  }
</script>