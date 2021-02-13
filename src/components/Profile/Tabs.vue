<template>
  <v-card>
    <v-toolbar
      color="indigo accent-3"
      dark
      flat
      height="10"
      class="mt-3"
    >
      <template v-slot:extension>
        <v-tabs
          v-model="tabs"
          fixed-tabs>
          <v-tab>
            いいね
          </v-tab>
          <v-tab>
            出席登録
          </v-tab>
          <v-tab>
            My投稿
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

     <v-tabs-items v-model="tabs">
      <v-tab-item>
          <likesList/>
      </v-tab-item>
      <v-tab-item>
          <attendList/>
      </v-tab-item>
       <v-tab-item>
          <myFreetalkList/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
    import likesList from '../Freetalk/LikesList.vue'
    import attendList from '../Freetalk/AttendList.vue'
    import myFreetalkList from '../Freetalk/MyFreetalkList.vue'
    export default {
    components: { likesList, attendList, myFreetalkList},
    data () {
    return {
        tabs: null
      }
    },
  }
</script>