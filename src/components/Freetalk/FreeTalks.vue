<template>
  <v-container >
      <v-layout mb-5>
          <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    :label="$t('search')"
                    single-line
                    hide-details
                    v-model="search"
                    color="indigo accent-3">
                </v-text-field>
          </v-flex>
      </v-layout>
     <v-layout v-for="freetalk in getLists" :key="freetalk.index" mb-3>
         <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
            <v-hover v-slot="{ hover }">
             <v-card :to="'/freetalks/' + freetalk.id" :class="{ 'on-hover': hover }" :elevation="hover ? 12 : 2">
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
                             <v-card-text class="hidden-xs-only pt-0">
                                    <p class="mb-0 subtitle-1">{{ freetalk.date | date }}</p>
                                    <h2 class="mb-2">{{ freetalk.title }}</h2>
                                    <p class="subtitle-1">{{$t('language')}}：{{ freetalk.language }}</p>
                            </v-card-text>
                            <v-card-text class="hidden-sm-and-up pt-0 pb-0">
                                    <p class="caption mb-0">{{ freetalk.date | date }}</p>
                                    <h3>{{ freetalk.title }}</h3>
                                     <p class="caption mb-0">{{$t('language')}}：{{ freetalk.language }}</p>
                            </v-card-text>
                         </v-flex>
                     </v-layout>
                 </v-container>
             </v-card>
          </v-hover>
         </v-flex>
     </v-layout>
     <v-layout>
          <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3 mt-5>
              <v-pagination
                    v-model="currentPage"
                    :length="getPageCount"
                    :initial-page="4"
                    :page-range="3"
                    dark color="indigo accent-3">
              </v-pagination>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
       //リアルタイム検索フォーム
       search: "",
       //１ページに表示するFREETALKの数
       parPage:3,
       //現在いるページの初期値
       currentPage:1
    }
  },
  computed:{
    //FREETALKのリアルタイム検索
    freetalks(){
      const talks = this.$store.getters.loadedFreeTalks
      return talks.filter((talk)=>{
        return talk.title.match(this.search) || talk.date.match(this.search) || talk.language.match(this.search)
      })
    },
    //ページネーション
    getLists(){
      let current = this.currentPage * this.parPage//freetalkの合計数
      let start = current - this.parPage//1ページ目の３つのfreetalkが最初
      return this.freetalks.slice(start, current)//現存する全てのfreetalkを取り出す
     },
     //ページネーションのページ数を取得
     getPageCount(){
         //引数として与えた数以上の最小の整数を返します。
       return Math.ceil(this.freetalks.length / this.parPage)
     },
     //ローディング
     loading(){
       return this.$store.getters.loading
     }
   },
   watch:{
     //フィルターしたいフレーズは1ページ目から表記する
     search(){
       this.currentPage = 1
     }
   }
 }
</script>