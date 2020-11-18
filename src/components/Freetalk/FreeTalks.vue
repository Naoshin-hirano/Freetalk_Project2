<template>
  <v-container >
      <v-layout mb-5>
          <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
               <v-card>
                    <v-card-title>
                        <v-text-field
                            append-icon="mdi-magnify"
                            label="search title"
                            single-line
                            hide-details
                            v-model="search"
                        ></v-text-field>
                    </v-card-title>
                </v-card>
                <v-card>
                     <v-layout>
                         <v-flex>
                              <v-pagination
                                    v-model="currentPage"
                                    :length="getPageCount"
                                    :initial-page="4"
                                    :page-range="3"
                                    dark color="red darken-2"
                                    >
                                </v-pagination>
                         </v-flex>
                     </v-layout>
              </v-card>
          </v-flex>
      </v-layout>
     <v-layout v-for="freetalk in getLists" :key="freetalk.index" mb-3>
         <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
             <v-card class="lime accent-4">
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
                         <v-flex v-if="!loading" xs5 sm4 md3 >
                             <v-img
                                height="130"
                                :src="freetalk.imageUrl"
                            ></v-img>
                         </v-flex>
                         <v-flex xs8 sm6 md4>
                             <v-card-text>
                                <div>
                                    <h3>{{ freetalk.title }}</h3>
                                    <p>{{ freetalk.date | date }}</p>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                 <v-btn text :to="'/freetalks/' + freetalk.id">
                                     <v-icon left>mdi-arrow-right</v-icon>
                                     Check FreeTalk
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
              <v-card>
                 <v-container>
                     <v-layout>
                         <v-flex>
                              <v-pagination
                                    v-model="currentPage"
                                    :length="getPageCount"
                                    :initial-page="4"
                                    :page-range="3"
                                    dark color="red darken-2">
                                </v-pagination>
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
  data(){
    return {
       search: "",
       parPage:3,
       currentPage:1
    }
  },
  computed:{
    freetalks(){
      const talks = this.$store.getters.loadedFreeTalks
      return talks.filter((talk)=>{
        return talk.title.match(this.search)
      })
    },
    getLists(){
      let current = this.currentPage * this.parPage//freetalkの合計数
      let start = current - this.parPage//1ページ目の３つのfreetalkが最初
      return this.freetalks.slice(start, current)//現存する全てのfreetalkを取り出す
     },
     getPageCount(){
         //引数として与えた数以上の最小の整数を返します。
       return Math.ceil(this.freetalks.length / this.parPage)
     },
     loading(){
       return this.$store.getters.loading
     }
   },
   watch:{
     search(){//フィルターしたいフレーズは1ページ目から表記する
       this.currentPage = 1
     }
   }
 }
</script>
