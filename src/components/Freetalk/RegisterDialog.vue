<template>
  <v-row>
    <v-dialog persistent width="450px" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
        <div class="hidden-xs-only">
            <v-btn
            v-if="!attend_status"
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
            v-if="!attend_status"
            dark color="pink darken-1"
            v-bind="attrs"
            v-on="on"
            width="85">
            <v-icon small>mdi-account-plus</v-icon>
            <span class="subtitle-2">参加する</span>
            </v-btn>
            <v-btn
            v-else
            dark color="cyan darken-1"
            class="mr-2"
            v-bind="attrs"
            v-on="on"
            width="115">
            <v-icon small>mdi-account-minus</v-icon>
            <span class="subtitle-2">参加を解除</span>
            </v-btn>
        </div>
      </template>
      <v-card>
         <v-container>
             <v-layout class="hidden-xs-only">
                <v-card-title v-if="attend_status">このFREETALKの参加を解除しますか?</v-card-title>
                <v-card-title v-else>このFREETALKに参加しますか?</v-card-title>
             </v-layout>
             <v-layout class="hidden-sm-and-up">
                <v-card-text v-if="attend_status">このFREETALKの参加を解除しますか?</v-card-text>
                <v-card-text v-else>このFREETALKに参加しますか?</v-card-text>
             </v-layout>
             <v-divider></v-divider>
             <v-layout>
                 <v-card-actions>
                        <v-btn
                        class="red--text darken-1"
                        text
                        @click="registerDialog = false">
                        <h3 class="hidden-xs-only">キャンセル</h3>
                        <span class="hidden-sm-and-up">キャンセル</span>
                        </v-btn>
                        <v-btn
                        class="green--text darken-1"
                        text
                        @click="onAgree">
                        <h3 class="hidden-xs-only">はい</h3>
                        <span class="hidden-sm-and-up">はい</span>
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
    props: ["freetalkId"],
    data(){
      return {
        //ダイアロク
        registerDialog: false
      }
    },
    computed: {
      //参加登録した日付
      submittableDateTime(){
        const date = new Date()
        const str = date.getFullYear()
        + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
        + '/' + ('0' + date.getDate()).slice(-2)
        + ' ' + ('0' + date.getHours()).slice(-2)
        + ':' + ('0' + date.getMinutes()).slice(-2)
         return str
       },
      //ユーザー情報
      user(){
         return this.$store.getters.user
       },
       //ユーザーの名前
       userName(){
         return this.$store.getters.userName
       },
       //ユーザーのアイコン
       photoURL(){
         return this.$store.getters.photoURL
       },
       //出席しているかのtrue/false
       attend_status(){
        return this.$store.getters.attendance.findIndex(attend =>{
          return attend.freetalkId === this.freetalkId 
          && attend.uid === this.user.id
        })>= 0
       },
       //自分の出席登録情報を取得
       getAttendance(){
        const attendance = this.$store.getters.attendance
        return attendance.filter((attend) =>{
          return attend.freetalkId.match(this.freetalkId)
          && attend.uid.match(this.user.id)
        })
      },
      //自分の出席登録情報のキーを取得
      getKey(){
        return this.getAttendance.map(obj =>obj.attendKey)
      },
    },
    methods: {
      //出席＆欠席登録
      onAgree(){
        const userData = {
          uid : this.user.id,
          userName: this.userName,
          photoURL: this.photoURL,
          freetalkId: this.freetalkId,
          datetime: this.submittableDateTime
        }
        if(this.attend_status){
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
          this.$store.dispatch("registerAttendance", userData)
          this.registerDialog=false
        }
      }
    }
  }
</script>