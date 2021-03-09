<template>
  <v-row>
    <v-dialog persistent width="350px" v-model="deleteDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab accent
               v-bind="attrs"
               v-on="on" 
               text>
            <v-icon class="hidden-xs-only">mdi-delete-forever</v-icon>
            <v-icon class="hidden-sm-and-up" small>mdi-delete-forever</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title >このユーザーアカウントを削除すると、このアカウントが作成したFREETALKも全て削除されますがよろしいでしょうか。</v-card-title>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="deleteDialog = false">やめる</v-btn>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="deleteConfirm">削除します</v-btn>
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
    methods: {
      deleteConfirm(){
         this.$store.dispatch("deleteUserAccount")
         this.$router.push({name: 'FreeTalks'})
      }
    }
  }
</script>