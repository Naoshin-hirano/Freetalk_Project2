<template>
  <v-row>
    <v-dialog persistent width="350" v-model="editDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        text
        v-bind="attrs"
        v-on="on">
          <v-icon class="hidden-xs-only" large>mdi-calendar-range</v-icon>
          <v-icon class="hidden-sm-and-up" >mdi-calendar-range</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-title>日にちを編集</v-card-title>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-text>
                    <v-date-picker 
                    color="blue darken-1" 
                    v-model="editableDate"
                    elevation="15"
                    style="width :100%">
                    <template>
                        <v-btn
                        class="red--text darken-1"
                        text
                        @click.native="editDialog = false">閉じる</v-btn>
                        <v-btn
                        class="green--text darken-1"
                        text
                        @click.native="onSaveChanges">保存する</v-btn>
                    </template>
                    </v-date-picker>
                 </v-card-text>
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
        //編集前の時間の初期値
        editableDate: undefined,
        //編集画面のダイアログ
        editDialog: false
      }
    },
    //編集前の日付
    created(){
         this.editableDate = new Date(this.freetalk.date).toISOString().substr(0, 10)
      },
    methods: {
      //編集した日付に変更更新
      onSaveChanges(){
        const newDate = new Date(this.freetalk.date)
        const newDay = new Date(this.editableDate).getUTCDate()
        const newMonth = new Date(this.editableDate).getUTCMonth()
        const newYear = new Date(this.editableDate).getUTCFullYear()
        newDate.setUTCDate(newDay)
        newDate.setUTCMonth(newMonth)
        newDate.setUTCFullYear(newYear)
        this.$store.dispatch("updateFreetalkData", {
          id: this.freetalk.id,
          date: newDate
        })
        this.editDialog = false
      }
    }
  }
</script>