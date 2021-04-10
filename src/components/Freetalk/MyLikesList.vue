<template>
  <v-container >
    <v-layout v-show="!loadedFreetalk.length">
       <v-flex class="text-center">
         <p>いいね済みの投稿はありません</p>
       </v-flex>
    </v-layout>
     <v-layout v-for="freetalk in loadedFreetalk" :key="freetalk.index" mb-3>
         <v-flex xs12 sm10 md10 offset-sm1 offset-md1>
             <v-card>
                 <v-container fluid>
                     <v-layout>
                         <v-flex v-if="loading" class="text-center" >
                             <v-progress-circular
                                indeterminate
                                color="purple"
                                :width="4"
                                :size="40"
                            ></v-progress-circular>
                         </v-flex>
                         <v-flex v-if="!loading" xs4 sm4 md3 >
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
                             <v-card-text class="hidden-xs-only">
                                    <h3 >【{{ freetalk.language }}】{{ freetalk.title }}</h3>
                                    <p>{{ freetalk.date | date }}</p>
                            </v-card-text>
                            <v-card-text class="hidden-sm-and-up">
                                    <h4>【{{ freetalk.language }}】{{ freetalk.title }}</h4>
                                    <p class="caption mb-0">{{ freetalk.date | date }}</p>
                            </v-card-text>
                            <v-card-actions class="pb-0 pt-0">
                                 <v-btn :to="'/freetalks/' + freetalk.id" 
                                        text
                                        color="blue"
                                        class="hidden-xs-only">
                                     <v-icon left>mdi-arrow-right</v-icon>
                                     詳細を見る
                                 </v-btn>
                                 <v-btn :to="'/freetalks/' + freetalk.id" 
                                        text
                                        color="blue"
                                        class="hidden-sm-and-up">
                                     <v-icon left>mdi-arrow-right</v-icon>
                                     <span class="caption">詳細を見る</span>
                                 </v-btn>
                             </v-card-actions>
                         </v-flex>
                     </v-layout>
                 </v-container>
             </v-card>
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
