 <template>
  <v-row>
    <v-dialog persistent width="450px" v-model="dialog">
      <template v-slot:activator="{ on, attrs }">
        <v-carousel>
            <v-carousel-item
            v-for="freetalk in freetalks"
            :key="freetalk.id"
            :src="freetalk.imageUrl"
            v-bind="attrs"
            v-on="on">
            <div class="title">{{ freetalk.title }}</div>
            </v-carousel-item>
        </v-carousel>
      </template>
      <v-card class="text-center">
         <v-container>
             <v-layout>
                <v-card-title class="hidden-xs-only">ログインするとFREETALK詳細を見れます</v-card-title>
                <v-card-text class="hidden-sm-and-up">ログインするとFREETALK詳細を見れます</v-card-text>
             </v-layout>
             <v-divider></v-divider>
                <v-btn
                class="cyan--text darken-1 text-center"
                text
                @click="dialog = false">
                <h3 class="hidden-xs-only">閉じる</h3>
                <span class="hidden-sm-and-up">閉じる</span>
                </v-btn>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ["freetalks"],
    data(){
      return {
        dialog: false
      }
    }
  }
</script>