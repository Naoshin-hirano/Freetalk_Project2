<template>
    <v-container>
        <v-layout xs12 sm10 md8>
            <v-flex>
                <v-card max-width="1000" class="mx-auto">
                    <v-card-title>
                        <div class="ml-10">
                          <profile-others  :freetalk="freetalk"></profile-others>
                        </div>
                        <h2 class="ml-15">{{ freetalk.title }}</h2>
                        <v-spacer></v-spacer>
                        <div class="mr-10">
                           <delete-free-talk :freetalk="freetalk"></delete-free-talk>
                        </div>
                        <div  class="mr-3"> 
                           <edit-free-talk :freetalk="freetalk"></edit-free-talk>
                        </div>
                    </v-card-title>
                    <v-img
                     :src="freetalk.imageUrl"
                     height="500"
                    ></v-img>
                    <v-card-text>
                        <p class="primary--text">{{ freetalk.date | date }} - {{ freetalk.location}}</p>
                        <v-chip-group column>
                           <div class="mr-10">
                               <edit-date
                                :freetalk="freetalk"
                                ></edit-date>
                            </div>
                            <div>
                                <edit-time
                                :freetalk="freetalk"
                                ></edit-time>
                            </div>
                        </v-chip-group>
                        <div>{{ freetalk.description }}</div>
                    </v-card-text>
                    <v-card-actions >
                        <v-spacer></v-spacer>
                        <v-btn class="mr-3">
                           <register-dialog  :freetalkId="freetalk.id"></register-dialog>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
   props: ["id"],
   computed: {
     freetalk(){
      return this.$store.getters.loadedFreeTalk(this.id) 
     },
     user(){
      return this.$store.getters.user
     }
   }
}
</script>