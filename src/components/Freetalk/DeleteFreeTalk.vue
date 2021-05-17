<template>
  <v-row class="ml-15">
    <v-dialog persistent width="380" v-model="deleteDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab accent
               v-bind="attrs"
               v-on="on" 
               text>
            <v-icon class="hidden-xs-only" large>mdi-delete-forever</v-icon>
            <v-icon class="hidden-sm-and-up">mdi-delete-forever</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title class="hidden-xs-only">{{$t('delete_freetalk')}}</v-card-title>
                <v-card-text class="hidden-sm-and-up">{{$t('delete_freetalk')}}</v-card-text>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="red--text darken-1"
                        text
                        @click="deleteDialog = false">
                          <h3 class="hidden-xs-only">{{$t('close')}}</h3>
                          <span class="hidden-sm-and-up">{{$t('close')}}</span>
                        </v-btn>
                        <v-btn
                        class="green--text darken-1"
                        text
                        @click="deleteConfirm">
                          <h3 class="hidden-xs-only">{{$t('delete')}}</h3>
                          <span class="hidden-sm-and-up">{{$t('delete')}}</span>
                        </v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ["freetalk"],
    data(){
      return {
      //削除してよいかのダイアログ
        deleteDialog: false
      }
    },
    methods: {
      //FREETALKを削除
      deleteConfirm(){
         this.$store.dispatch("deleteTalk", this.freetalk)
         this.$router.push({name: 'Home'})
      }
    }
  }
</script>