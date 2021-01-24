<template>
  <v-row>
    <v-dialog persistent width="380" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        text
        color="red"
        v-bind="attrs"
        v-on="on">
        削除
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title>このコメントと返信を削除しますか?</v-card-title>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="cyan--text darken-1"
                        text
                        @click="registerDialog = false">
                        <h3>キャンセル</h3>
                        </v-btn>
                        <v-btn
                        class="cyan--text darken-1"
                        text
                        >
                        <h3 @click="deleteComment">削除</h3>
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
    props: ["paramsId"],//commentId
    data(){
      return {
        registerDialog: false
      }
    },
    methods: {
      deleteComment(){
        this.$store.dispatch("deleteComment", this.paramsId)
        this.$router.go(-1)
        }
      }
    }
</script>