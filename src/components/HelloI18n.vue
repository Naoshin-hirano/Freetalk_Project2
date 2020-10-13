<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'HelloI18n'
}
</script>

<i18n>
{
  "en": {
    "hello": "Hello i18n in SFC!",
    "welcome": "Welcome!",
    "yes-button": "Yes",
    "no-button": "No!"
  },
  "de": {
    "hello": "Hallo i18n in SFC!",
    "welcome": "Willkommen!",
    "yes-button": "Ja",
    "no-button": "Nein!"
  }
}
</i18n>
