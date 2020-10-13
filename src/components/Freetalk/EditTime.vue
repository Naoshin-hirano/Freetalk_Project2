<template>
  <v-row>
    <v-dialog persistent width="350px" v-model="editDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        v-bind="attrs"
        v-on="on">
        Edit Time
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-title>Edit Freetalk Time</v-card-title>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-text>
                    <v-time-picker v-model="editableTime" style="..." actions format="24hr">
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
                    </v-time-picker>
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
        editableTime: null,
        editDialog: false
      }
    },
    methods: {
      onSaveChanges(){
        const newDate = new Date(this.freetalk.date)
        const hours = this.editableTime.match(/^(\d+)/)[1]
        const minutes = this.editableTime.match(/:(\d+)/)[1]
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        this.$store.dispatch("updateFreetalkData", {
          id: this.freetalk.id,
          date: newDate
        })
      },
     created(){
      this.editableTime = new Date(this.freetalk.date).toTimeString()
      }
    }
  }
</script>