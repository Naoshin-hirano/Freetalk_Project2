<template>
    <v-dialog persistent width="450px" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
        <div>
            <v-btn
            v-if="following"
            dark color="light-blue"
            v-bind="attrs"
            v-on="on">
            <strong>{{$t('following')}}</strong>
            </v-btn>
            <v-btn
            v-else
            color="light-blue--text"
            v-bind="attrs"
            v-on="on">
            <strong>{{$t('doFollow')}}</strong>
            </v-btn>
        </div>
      </template>
      <v-card>
         <v-container>
             <v-layout class="hidden-xs-only">
                <v-card-title v-if="following">{{$t('unfollow?')}}</v-card-title>
                <v-card-title v-else>{{$t('follow?')}}</v-card-title>
             </v-layout>
             <v-layout class="hidden-sm-and-up">
                <v-card-text v-if="following">{{$t('unfollow?')}}</v-card-text>
                <v-card-text v-else>{{$t('follow?')}}</v-card-text>
             </v-layout>
             <v-divider></v-divider>
             <v-layout>
                 <v-card-actions>
                        <v-btn
                        class="red--text darken-1"
                        text
                        @click="registerDialog = false">
                        <h3 class="hidden-xs-only">{{$t('close')}}</h3>
                        <span class="hidden-sm-and-up">{{$t('close')}}</span>
                        </v-btn>
                        <v-btn
                        class="green--text darken-1"
                        text
                        @click="onAgree">
                        <h3 class="hidden-xs-only">{{$t('yes')}}</h3>
                        <span class="hidden-sm-and-up">{{$t('yes')}}</span>
                        </v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
</template>

<script>
  export default {
    data(){
      return {
        //ダイアロク
        registerDialog: false,
        //URLを取得
        id: location.href.split("/")
      }
    },
    computed: {
      //ログインユーザー情報を取得
      user(){
        return this.$store.getters.user
      },
      //ログインユーザーが画面上ユーザーをフォローしているかどうか
      following(){
            return this.user ? this.user.following.findIndex(uid =>{
              return uid === this.id[this.id.length - 1]
            }) >= 0 : null
          }
  },
    methods: {
        onAgree(){
            if(this.following){
                this.$store.dispatch("deleteFollowing", this.id[this.id.length - 1])
                this.$store.dispatch("deleteFollowers", this.id[this.id.length - 1])
                this.registerDialog = false
            }else{
                this.$store.dispatch("getFollowing", this.id[this.id.length - 1])
                this.$store.dispatch("getFollowers", this.id[this.id.length - 1])
                this.registerDialog = false
            }
        }
    }    
  }
</script>