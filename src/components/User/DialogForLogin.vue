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
      <v-card>
         <v-container class="text-right mb-0 pb-0">
           <v-icon
              @click="dialog = false">mdi-close-circle
           </v-icon>
         </v-container>
         <v-container class="text-center mt-0 pt-0">
             <v-layout class="mb-3">
                <v-card-title class="hidden-xs-only">ログインするとFREETALK詳細を見れます</v-card-title>
                <v-card-text class="hidden-sm-and-up">ログインするとFREETALK詳細を見れます</v-card-text>
             </v-layout>
              <v-layout>
                  <v-flex>
                      <v-btn @click="loginWithGestUser" large color="lime" style="width:100%;" >
                          ゲストユーザーとしてログイン
                      </v-btn>
                  </v-flex>
              </v-layout>
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
    },
    methods: {
      //ゲストユーザーでログイン
      loginWithGestUser(){
        this.$store.dispatch("loginWithGestUser", {email: "guest@example.com", password: "guests"})
      }
    }
  }
</script>