<template>
    <v-container mt-5>
        <v-layout v-if="error">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <h1 class="mb-5">新規登録</h1>
                            <div class="mb-5">
                                <router-link text class="blue--text" to="/login" tag="span" style="cursor: pointer">ログインはこちら</router-link>
                            </div>
                            <v-divider class="mb-5"></v-divider>
                            <form @submit.prevent="onSignup">
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
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="confirmPassword"
                                      label="ConfirmPassword"
                                      id="confirmPassword"
                                      v-model="confirmPassword"
                                      type="confirmPassword"
                                      required
                                      :rules="[comparePassword]"></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex class="mt-3">
                                        <v-btn x-large type="submit" dark color="pink darken-1" style="width:100%;">
                                            続ける
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data(){
      return{
      email: "",
      password: "",
      confirmPassword: ""
    }
  },
  computed: {
    comparePassword(){
      return this.password !== this.confirmPassword ? "Password do no match" : ""
    },
    user(){
      return this.$store.getters.user
    },
    error(){
      return this.$store.getters.error
    }
  },
  watch: {
    user(value){//signup成功したらホーム画面へ
      if(value !== null && value !== undefined){
        this.$route.push("/")
      }
    }
  },
  methods: {
    onSignup(){  
      this.$store.dispatch("signUserUp", {email: this.email, password: this.password})
    },
    onDismissed(){
      console.log("Dismissed Alert !")
      this.$store.dispatch("clearError")
    }
  }
}
</script>

