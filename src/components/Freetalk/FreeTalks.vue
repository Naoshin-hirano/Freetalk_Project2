<template>
  <v-container >
      <v-layout mb-5>
          <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
               <v-card>
                    <v-card-title>
                        <v-text-field
                            prepend-inner-icon="mdi-magnify"
                            label="言語・タイトル・年月日で検索する"
                            single-line
                            hide-details
                            v-model="search"
                            color="indigo accent-3">
                        </v-text-field>
                    </v-card-title>
                </v-card>
                <v-pagination
                      v-model="currentPage"
                      :length="getPageCount"
                      dark color="indigo accent-3"
                      class="mt-4"
                      >
                </v-pagination>
          </v-flex>
      </v-layout>
     <v-layout v-for="freetalk in getLists" :key="freetalk.index" mb-3>
         <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
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
     <v-layout>
          <v-flex xs12 sm10 md8 offset-sm1 offset-md2 mt-5>
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
