<template>
  <v-row>
    <v-dialog persistent width="350px" v-model="editDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        v-bind="attrs"
        v-on="on">
        Edit Date
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-title>Edit Freetalk Date</v-card-title>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-text>
                    <v-date-picker v-model="editableDate" style="width :100%">
                    <template >
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click.native="editDialog = false">Close</v-btn>
                        <v-btn
                        class="blue--text darken-1"
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
        editableDate: null,
        editDialog: false
      }
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
      },
      created(){
         this.editableDate = new Date(this.freetalk.date)
      }
    }
  }
</script>