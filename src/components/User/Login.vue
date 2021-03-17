<template>
    <v-container mt-5>
         <v-layout v-if="error">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert><!-- textはAlert内での呼び名 -->
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-card-text>
                        <v-container><!-- これないとくくりの中で中央寄せにならない -->
                            <h1 class="mb-5">ログイン画面</h1>
                            <div class="mb-5">
                                <router-link text class="blue--text" to="/signup" tag="span" style="cursor: pointer">新規登録はこちら</router-link>
                            </div>
                            <v-divider class="mb-5"></v-divider>
                            <!-- <v-layout>
                                <v-flex>
                                    <v-btn @click="signInAnonymously" x-large dark style="width:100%;" >
                                        匿名としてログイン
                                    </v-btn>
                                </v-flex>
                            </v-layout> -->
                             <v-layout>
                                <v-flex>
                                    <v-btn @click="loginWithGestUser" x-large dark color="pink darken-1" style="width:100%;" >
                                        ゲストユーザーとしてログイン
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                             <v-divider class="mb-5"></v-divider>
                            <form @submit.prevent="onSigninWithEmail">
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="email"
                                      label="Mail"
                                      id="email"
                                      v-model="email"
                                      type="email"
                                      required></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="password"
                                      label="Password"
                                      id="password"
                                      v-model="password"
                                      type="password"
                                      required></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout class="mb-2">
                                    <v-flex>
                                        <v-btn type="submit" style="width:100%;">
                                            <v-icon left>mdi-email</v-icon>
                                            メールでログイン
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </form>
                        </v-container>
                        <v-divider class="mb-2"></v-divider>
                        <v-container>
                            <v-layout>
                                <v-card style="background: #CCCCFF; width:100%;">
                                    <v-flex>
                                        <v-card-actions>
                                            <v-btn @click="loginWithFacebook"
                                                style="
                                                    cursor:pointer;
                                                    background: #4267b2;
                                                    border-radius: 5px;
                                                    color: white;
                                                    height: 40px;
                                                    line-height:40px;
                                                    text-align: center;
                                                    width: 100%;
                                                    margin-top:12px;">
                                                        <v-icon left>mdi-facebook</v-icon>
                                                Facebookでログイン
                                                <div
                                                class="fb-login-button"
                                                data-max-rows="1"
                                                data-size="large"
                                                data-button-type="continue_with"
                                                data-use-continue-as="true"
                                                ></div>
                                            </v-btn>
                                        </v-card-actions>
                                    </v-flex>
                                    <v-flex>
                                        <v-card-actions>
                                            <v-btn
                                                @click="loginWithGoogle"
                                                style="
                                                    cursor:pointer;
                                                    background: #ffff;
                                                    border-radius: 5px;
                                                    color: gray;
                                                    height: 40px;
                                                    line-height:40px;
                                                    text-align: center;
                                                    width: 100%;
                                                    margin-bottom:12px;">
                                                <v-icon left>mdi-google</v-icon>
                                                Googleでログイン
                                            </v-btn>
                                        </v-card-actions>
                                    </v-flex>
                                </v-card>
                            </v-layout>
                       </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex>
              <v-overlay v-show="loading">
                <v-progress-circular
                  indeterminate
                  size="64"
                ></v-progress-circular>
              </v-overlay>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
// import firebase from "firebase"
export default {
  data(){
      return{
      email: "",
      password: ""
    }
  },
  computed: {
    user(){
      return this.$store.getters.user
    },
    error(){
      return this.$store.getters.error
    },
    loading(){
       return this.$store.getters.loading
     }
  },
  watch: {
    user(value){//signin成功したらホーム画面へ
      if(value !== null && value !== undefined){
        this.$route.push("/")
      }
    }
  },
  methods: {
  //   signInAnonymously(){
  //     firebase.auth().signInAnonymously()
  //     .then(() => {
  //       // Signed in..
  //       console.log("匿名ログイン成功")
  //     })
  //     .catch((error) => {
  //       console.log("匿名ログイン失敗")
  //       console.log(error)
  //       // ...
  // })
    // },
    loginWithGestUser(){
      this.$store.dispatch("loginWithGestUser", {email: "guest@example.com", password: "guests"})
    },
    onSigninWithEmail(){  
      this.$store.dispatch("signUserInWithEmail", {email: this.email, password: this.password})
    },
    loginWithGoogle(){
      this.$store.dispatch("loginWithGoogle")
  },
    loginWithFacebook(){
      this.$store.dispatch("loginWithFacebook")
    },
    onDismissed(){
      console.log("Dismissed Alert !")
      this.$store.dispatch("clearError")
    }
  }
}
</script>

