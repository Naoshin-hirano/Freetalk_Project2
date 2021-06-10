<template>
  <v-container >
    <v-layout v-show="!loadedFreetalk.length">
       <v-flex class="text-center">
         <p>{{$t('no_like_post')}}</p>
       </v-flex>
    </v-layout>
     <v-layout v-for="freetalk in loadedFreetalk" :key="freetalk.index" mb-3>
         <v-flex xs12 sm12 md12>
           <v-hover v-slot="{ hover }">
             <v-card :to="'/freetalks/' + freetalk.id" :class="{ 'on-hover': hover }" :elevation="hover ? 12 : 2">
                 <v-container fluid>
                     <v-layout>
                         <v-flex xs4 sm4 md3 >
                             <v-img
                                class="hidden-xs-only"
                                height="130"
                                :src="freetalk.imageUrl"
                            ></v-img>
                            <v-img
                                class="hidden-sm-and-up" 
                                height="70"
                                :src="freetalk.imageUrl"
                            ></v-img>
                         </v-flex>
                         <v-flex xs8 sm8 md8>
                             <v-card-text class="hidden-xs-only pt-0">
                                    <p class="mb-0 subtitle-1">{{ freetalk.date | date }}</p>
                                    <h2 class="mb-2">{{ freetalk.title }}</h2>
                                    <p class="subtitle-1">{{$t('language')}} ：{{ freetalk.language }}</p>
                            </v-card-text>
                            <v-card-text class="hidden-sm-and-up pt-0 pb-0">
                                    <p class="caption mb-0">{{ freetalk.date | date }}</p>
                                    <h3>{{ freetalk.title }}</h3>
                                     <p class="caption mb-0">{{$t('language')}} ：{{ freetalk.language }}</p>
                            </v-card-text>
                         </v-flex>
                     </v-layout>
                 </v-container>
             </v-card>
           </v-hover>
         </v-flex>
     </v-layout>
  </v-container>
</template>

<script>
export default {
  computed:{
    //ユーザー情報
    user(){
      return this.$store.getters.user
    },
    //ユーザーのお気に入り情報を取得
    myfavs(){
      let favs = this.$store.getters.favs
      return favs.filter((fav)=>{
        return fav.uid.match(this.user.id)
         })
      },
    //お気に入り登録したFREETALKを取得
    loadedFreetalk(){
      let favsArray = this.myfavs
      let freetalks = []
      this.$store.getters.loadedFreeTalks.forEach(element =>{
          function checkFavs(arr, id){
            return arr.some(function(value){
                return id === value.freetalkId
            })
         }
         if(checkFavs(favsArray, element.id)){
            freetalks.push(element)
         }
      })
      return freetalks
    },
    //ローディング
    loading(){
       return this.$store.getters.loading
     }
   }
 }
</script>
