<template>
  <v-row>
    <v-dialog persistent width="350px" v-model="deleteDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab accent
               v-bind="attrs"
               v-on="on" >
            <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title >Really delete this User-Account ?</v-card-title>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="deleteDialog = false">Cancel</v-btn>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="deleteConfirm">Confirm</v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data(){
      return {
        deleteDialog: false
      }
    },
    // computed: {
    //   freetalks(){
    //     const talks = this.$store.getters.loadedFreeTalks
    //     return talks.filter((talk)=>{
    //       return talk.createrId.match(this.user.id)
    //     })
    //   }
    // },
    methods: {
      deleteConfirm(){
         this.$store.dispatch("deleteUserAccount")
         this.$router.push({name: 'FreeTalks'})
      }
    }
  }
</script>