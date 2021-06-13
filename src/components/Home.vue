<template>
    <div>
    <v-container
    class="pt-0 pl-0 pr-0 mt-10">
        <v-layout row>
           <v-flex>
                 <h2 class="hidden-xs-only">{{$t('title_message')}}</h2>
                 <h4 class="hidden-sm-and-up ml-2">{{$t('title_message')}}</h4>
           </v-flex>
       </v-layout>
    </v-container>
    <v-container>
       <v-layout mt-5 row wrap v-if="user">
           <v-flex>
               <v-btn large to="/freetalks" class="mb-3" width="300" dark color="pink darken-1">{{$t('check_freetalk')}}</v-btn>
           </v-flex>
           <v-flex>
               <v-btn large to="/freetalk/new" width="300" dark color="pink darken-1">{{$t('post_freetalk')}}</v-btn>
           </v-flex>
       </v-layout>
       <v-layout mt-5 row wrap v-else>
           <v-flex>
              <v-btn large to="/login" class="mb-3" width="300" dark color="pink darken-1">{{$t('enjoy_freetalk')}}</v-btn> 
           </v-flex>
           <v-flex>
              <v-btn large to="/Overview" dark width="300" color="blue darken-1">{{$t('whats_freetalk')}}</v-btn> 
           </v-flex>
       </v-layout>
        <v-layout>
            <v-flex>
                <v-progress-circular
                    class="text-center"
                    indeterminate
                    color="purple"
                    :width="7"
                    :size="70"
                    v-if="loading"
                ></v-progress-circular>
            </v-flex>
        </v-layout>
       <v-layout row wrap mt-5 v-if="!loading">
           <v-flex>
               <v-card max-width="1000" class="mx-auto">
                   <v-carousel v-show="user"> 
                        <v-carousel-item
                        v-for="freetalk in freetalks"
                        :key="freetalk.id"
                        :src="freetalk.imageUrl"
                        @click="loadFreeTalk(freetalk.id)">
                        <div class="title">{{ freetalk.title }}</div>
                        </v-carousel-item>     
                    </v-carousel>
                    <dialogForLogin v-show="!user" :freetalks="freetalks"/>
                </v-card>
           </v-flex>
       </v-layout>
    </v-container>
    </div>
</template>

<script>
import dialogForLogin from './User/DialogForLogin.vue'
export default {
  components: { dialogForLogin },
  computed:{
    //ログインユーザー情報を取得
    user(){
      return this.$store.getters.user
    },
    //投稿されているFREETALK情報を取得
    freetalks(){
      return this.$store.getters.featuredFreeTalk
    },
    //ローディング
    loading(){
       return this.$store.getters.loading
     }
  },
  methods: {
    //カルーセルの画像のFREETALK画面に移動
    loadFreeTalk(id){
        this.$router.push("/freetalks/" + id)
    }
  }
}
</script>

<style scoped>
   .title{
     position: absolute;
     text-align: center;
     left: 0;
     right: 0;
     margin: auto;
     bottom: 50px;
     background-color:rgba(0, 0, 0, 0.5);
     color:white;
     font-size: 2rem;
   }
   .container{
       text-align: center;
   }
</style>