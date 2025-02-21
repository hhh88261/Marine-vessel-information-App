<template>
  <AisMap />
</template>

<script>
import AisMap from './components/AisMap.vue'

export default {
  name: 'App',
  components: {
    AisMap,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
