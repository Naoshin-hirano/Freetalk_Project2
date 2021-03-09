<template>
    <v-container class="container">
       <v-layout mt-5 row wrap v-if="$store.state.user">
           <v-flex >
               <v-btn x-large to="/freetalks" class="mb-3" width="300" dark color="red darken-2">FREETALKを検索してみる</v-btn>
           </v-flex>
           <v-flex >
               <v-btn x-large to="/freetalk/new" width="300" dark color="red darken-2">FREETALKを投稿してみる</v-btn>
           </v-flex>
       </v-layout>
       <v-layout mt-5 row wrap v-else>
           <v-flex>
              <v-btn x-large to="/login" dark color="red darken-2">ログインしてFREETALKを楽しもう！</v-btn> 
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
       <v-layout row wrap mt-5  v-if="!loading">
           <v-flex >
               <v-card max-width="1000" class="mx-auto">
                   <v-carousel>
                        <v-carousel-item
                        v-for="freetalk in freetalks"
                        :key="freetalk.id"
                        :src="freetalk.imageUrl"
                        @click="loadFreeTalk(freetalk.id)">
                        <div class="title">{{ freetalk.title }}</div>
                        </v-carousel-item>     
                    </v-carousel>
                </v-card>
           </v-flex>
       </v-layout>
       <v-layout row wrap mt-3>
           <v-flex style="text">
               <v-card max-width="1000" class="mx-auto pt-5 pb-5">
                 <h2 class="hidden-xs-only">FreeTalk みんなで無料語学研修を投稿・メンバー募集・開催しよう！</h2>
                 <h5 class="hidden-sm-and-up ">FreeTalk is ...  みんなで無料語学研修を投稿・メンバー募集・開催しよう！</h5>
               </v-card>
           </v-flex>
       </v-layout>
    </v-container>
</template>

<script>
export default {
  computed:{
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