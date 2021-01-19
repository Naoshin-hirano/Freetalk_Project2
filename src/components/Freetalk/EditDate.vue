<template>
  <v-row>
    <v-dialog persistent width="350" v-model="editDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        text
        v-bind="attrs"
        v-on="on">
          <v-icon large>mdi-calendar-range</v-icon>
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
                    color="cyan darken-1" 
                    v-model="editableDate"
                    elevation="15"
                    style="width :100%">
                    <template>
                        <v-btn
                        class="cyan--text darken-1"
                        text
                        @click.native="editDialog = false">Close</v-btn>
                        <v-btn
                        class="cyan--text darken-1"
                        text
                        @click.native="onSaveChanges">Save</v-btn>
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
        editableDate: undefined,
        editDialog: false
      }
    },
    created(){
         this.editableDate = new Date(this.freetalk.date).toISOString().substr(0, 10)
      },
    methods: {
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
      }
    }
  }
</script>