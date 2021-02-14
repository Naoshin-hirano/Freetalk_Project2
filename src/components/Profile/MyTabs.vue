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
                    <h4 class="mt-1">いいね</h4>
                </div>
                <v-icon>mdi-cards-heart</v-icon>
          </v-tab>
          <v-tab>
              <div>
                  <h4 class="mt-1">出席登録</h4>
              </div>
              <v-icon>mdi-account-plus</v-icon>
          </v-tab>
          <v-tab>
              <div>
                   <h4 class="mt-1">My投稿</h4>
              </div>
              <v-icon>mdi-google-maps</v-icon>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

     <v-tabs-items v-model="tabs">
      <v-tab-item>
          <myLikesList/>
      </v-tab-item>
      <v-tab-item>
          <myAttendList/>
      </v-tab-item>
       <v-tab-item>
          <myFreetalkList/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
    import myLikesList from '../Freetalk/MyLikesList.vue'
    import myAttendList from '../Freetalk/MyAttendList.vue'
    import myFreetalkList from '../Freetalk/MyFreetalkList.vue'
    export default {
    components: { myLikesList, myAttendList, myFreetalkList},
    data () {
    return {
        tabs: null
      }
    },
  }
</script>