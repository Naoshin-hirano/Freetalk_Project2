<template>
  <v-row>
    <v-dialog persistent width="350px" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
        <div class="hidden-xs-only">
            <v-btn
            v-if="!userIsRegistered"
            dark color="pink darken-1"
            v-bind="attrs"
            v-on="on">
            <v-icon>mdi-account-plus</v-icon>
            参加する
            </v-btn>
            <v-btn
            v-else
            dark color="cyan darken-1"
            v-bind="attrs"
            v-on="on">
            <v-icon>mdi-account-minus</v-icon>
            参加を解除
            </v-btn>
        </div>
        <div class="hidden-sm-and-up">
            <v-btn
            v-if="!userIsRegistered"
            dark color="pink darken-1"
            v-bind="attrs"
            v-on="on"
            width="85">
            <v-icon small>mdi-account-plus</v-icon>
            <span class="caption">参加する</span>
            </v-btn>
            <v-btn
            v-else
            dark color="cyan darken-1"
            v-bind="attrs"
            v-on="on"
            width="100">
            <v-icon small>mdi-account-minus</v-icon>
            <span class="caption">参加を解除</span>
            </v-btn>
        </div>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title v-if="userIsRegistered">このFREETALKの参加を解除しますか?</v-card-title>
                <v-card-title v-else>このFREETALKに参加しますか?</v-card-title>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="cyan--text darken-1"
                        text
                        @click="registerDialog = false">
                        <h3>キャンセル</h3>
                        </v-btn>
                        <v-btn
                        class="cyan--text darken-1"
                        text
                        @click="onAgree">
                        <h3>はい</h3>
                        </v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ["freetalkId"],//id
    data(){
      return {
        registerDialog: false
      }
    },
    computed: {
      userIsRegistered(){
        return this.$store.getters.user.registeredFreetalks.findIndex(freetalkId=>{
            return freetalkId === this.freetalkId
        }) >= 0
      },
      submittableDateTime(){
      const date = new Date()
      const str = date.getFullYear()
      + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
      + '/' + ('0' + date.getDate()).slice(-2)
      + ' ' + ('0' + date.getHours()).slice(-2)
      + ':' + ('0' + date.getMinutes()).slice(-2)
      return str
      },
      user(){
         return this.$store.getters.user
       },
       userName(){
         return this.$store.getters.userName
       },
       photoURL(){
         return this.$store.getters.photoURL
       },
       attendance(){
         return this.$store.state.attendance.attendanceId
       },
       getAttendance(){
        const attendance = this.$store.getters.attendance
        return attendance.filter((attend) =>{
          return attend.freetalkId.match(this.freetalkId)
          && attend.uid.match(this.user.id)
        })
      },
      getKey(){
        return this.getAttendance.map(obj =>obj.attendKey)
      },
    },
    methods: {
      onAgree(){
        const userData = {
          uid : this.user.id,
          userName: this.userName,
          photoURL: this.photoURL,
          freetalkId: this.freetalkId,
          datetime: this.submittableDateTime
        }
        if(this.userIsRegistered){
          this.$store.dispatch("unregisterUserFromFreetalk", this.freetalkId)
          this.$store.dispatch("removeAttendance", {
            uid : this.user.id,
            userName: this.userName,
            photoURL: this.photoURL,
            freetalkId: this.freetalkId,
            datetime: this.submittableDateTime,
            attendKey: this.getKey
          })
          this.registerDialog=false
        }else{
          this.$store.dispatch("registerUserForFreetalk", this.freetalkId)
          this.$store.dispatch("registerAttendance", userData)
          this.registerDialog=false
        }
      }
    }
  }
</script>