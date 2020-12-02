<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 10vh">
        <q-icon name="sentiment_very_dissatisfied"></q-icon>
      </div>

      <div class="text-h4" style="opacity:.4">
        {{ $t("error.message") }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Domov"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
