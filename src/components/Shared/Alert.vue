<template>
    <v-alert type="error" dismissible @input="onClose" :value="true">
      {{ text }}
    </v-alert>
</template>

<script>
export default {
    props: ["text"],
    methods: {
        //アラート画面を閉じるのmethodsを親要素へ送る
        onClose(){
          this.$emit("dismissed")
        }
    }
}
</script>