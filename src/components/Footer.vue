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
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4"
          dark
          icon>
          <v-icon class="hidden-xs-only" size="24px">
            {{ icon }}
          </v-icon>
          <v-icon class="hidden-sm-and-up" size="15px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="indigo accent-3 text-center" dark>
        © {{ new Date().getFullYear() }} — <strong>freetalk-community All Rights Reserved.</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-instagram',
      ],
    }),
  }
</script>