<template>
  <v-row>
    <v-dialog persistent width="380" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        text
        v-bind="attrs"
        v-on="on">
         <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title class="hidden-xs-only">{{$t('delete_comment')}}</v-card-title>
                <v-card-text class="hidden-sm-and-up">{{$t('delete_comment')}}</v-card-text>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="red--text darken-1"
                        text
                        @click="registerDialog = false">
                        <h3 class="hidden-xs-only">{{$t('close')}}</h3>
                        <span class="hidden-sm-and-up">{{$t('close')}}</span>
                        </v-btn>
                        <v-btn
                        class="green--text darken-1"
                        text
                        @click="deleteComment"
                        >
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
    props: ["commentId"],
    data(){
      return {
        //ダイアログ
        registerDialog: false
      }
    },
    methods: {
      //コメント削除
      deleteComment(){
        this.$store.dispatch("deleteComment", this.commentId)
        this.registerDialog = false
        }
      }
    }
</script>