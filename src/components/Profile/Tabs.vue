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
         <v-card flat>
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </v-card-text>
        </v-card>
      </v-tab-item>
       <v-tab-item>
        <v-card flat>
          <v-card-title class="headline">
            An even better title
          </v-card-title>
          <v-card-text>
            <p>
              Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed hendrerit. Maecenas malesuada. Vestibulum ullamcorper mauris at ligula. Proin faucibus arcu quis ante.
            </p>
            <p class="mb-0">
              Etiam vitae tortor. Curabitur ullamcorper ultricies nisi. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. Aliquam lobortis. Suspendisse potenti.
            </p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
    import likesList from '../Freetalk/LikesList.vue'
    export default {
    components: { likesList },
    data () {
    return {
        tabs: null
      }
    },
  }
</script>