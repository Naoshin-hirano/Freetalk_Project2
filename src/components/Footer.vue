<template>
  <v-footer
    color="indigo accent-3"
    dark>
    <v-card
      class="flex"
      flat
      tile>
      <v-card-title class="indigo accent-3" dark>
        <strong class="subheading">FREE TALK !</strong>
        <v-spacer></v-spacer>
        <v-btn to="/overview" text>
          <h3>FREE TALK ! の使い方</h3>
        </v-btn>
      </v-card-title>
      <v-card-text class="indigo accent-3 text-center" dark>
        © {{ new Date().getFullYear() }} — <strong>freetalk-community All Rights Reserved.</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>
