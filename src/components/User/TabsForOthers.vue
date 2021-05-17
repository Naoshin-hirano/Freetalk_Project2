<template>
  <v-card>
    <v-toolbar
      color="indigo accent-3"
      dark
      height="20"
      class="mt-3"
    >
      <template v-slot:extension>
        <v-tabs
          v-model="tabs"
          fixed-tabs
          icons-and-text>
          <v-tab>
                <div>
                    <h4 class="mt-1"></h4>{{$t('like')}} 
                </div>
                <v-icon>mdi-cards-heart</v-icon>
          </v-tab>
          <v-tab>
              <div>
                  <h4 class="mt-1">{{$t('registration')}} </h4>
              </div>
              <v-icon>mdi-account-plus</v-icon>
          </v-tab>
          <v-tab>
              <div>
                   <h4 class="mt-1">{{$t('your_post')}} </h4>
              </div>
              <v-icon>mdi-google-maps</v-icon>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

     <v-tabs-items v-model="tabs">
      <v-tab-item>
          <likesListForOthers/>
      </v-tab-item>
      <v-tab-item>
          <attendListForOthers/>
      </v-tab-item>
       <v-tab-item>
          <freetalkListForOthers/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
    import likesListForOthers from '../Freetalk/LikesListForOthers.vue'
    import attendListForOthers from '../Freetalk/AttendListForOthers.vue'
    import freetalkListForOthers from '../Freetalk/FreetalkListForOthers.vue'
    export default {
    components: { likesListForOthers, attendListForOthers, freetalkListForOthers },
    data () {
    return {
        tabs: null
      }
    },
  }
</script>