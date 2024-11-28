<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <div ref="map" class="map"></div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      map: null,
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initMap(); // 모달이 열릴 때 지도 초기화
        });
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    initMap() {
        this.map = new Map({
          target: this.$refs.map,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: [0, 0], // 초기 중심 좌표
            zoom: 2, // 초기 줌 레벨
          }),
        });
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  background-color: white;
  margin: auto;
  padding: 20px;
  width: 80%;
}
.map {
  width: 100%;
  height: 400px; /* 원하는 높이로 설정 */
}
</style>