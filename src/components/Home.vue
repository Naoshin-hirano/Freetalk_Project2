<template>
    <div>
    <v-container
    class="pt-0 pl-0 pr-0 mt-10"
    v-show="!user">
        <v-layout row>
           <v-flex>
                 <h3 class="hidden-xs-only">FREETALK！は、ボランティアの語学研修を開催するためのアプリです！</h3>
                 <h4 class="hidden-sm-and-up ml-2">FREETALK！は<br>ボランティアの語学研修を開催するためのアプリです！</h4>
           </v-flex>
       </v-layout>
    </v-container>
    <v-container>
       <v-layout mt-5 row wrap v-if="user">
           <v-flex>
               <v-btn x-large to="/freetalks" class="mb-3" width="300" dark color="pink darken-1">FREETALKを検索してみる</v-btn>
           </v-flex>
           <v-flex>
               <v-btn x-large to="/freetalk/new" width="300" dark color="pink darken-1">FREETALKを投稿してみる</v-btn>
           </v-flex>
       </v-layout>
       <v-layout mt-5 row wrap v-else>
           <v-flex>
              <v-btn x-large to="/login" dark color="pink darken-1">ログインしてFREETALKを楽しもう！</v-btn> 
           </v-flex>
       </v-layout>
        <v-layout class="text-center">
            <v-flex xs5 sm4 md3>
                <v-progress-circular
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
    user(){
      return this.$store.getters.user
    },
    freetalks(){
      return this.$store.getters.featuredFreeTalk
    },
    loading(){
       return this.$store.getters.loading
     }
  },
  methods: {
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