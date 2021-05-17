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
                <v-card-title class="hidden-xs-only">{{$t('login_and_check')}} </v-card-title>
                <v-card-text class="hidden-sm-and-up">{{$t('login_and_check')}} </v-card-text>
             </v-layout>
              <v-layout>
                  <v-flex>
                      <v-btn @click="loginWithGestUser" large color="lime" style="width:100%;" >
                          {{$t('guest_user')}} 
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

<style scoped>
   .title{
     position: absolute;
     text-align: center;
     left: 0;
     right: 0;
     margin: auto;
     bottom: 50px;
     background-color:rgba(0, 0, 0, 0.5);
     color:white;
     font-size: 2rem;
   }
   .container{
       text-align: center;
   }
</style>