<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <div ref="map" class="map"></div>
      <div class="datepicker-container">

        날짜<input type="date" min="2024-01-01" v-model="shipDate"/>
        <label for="start-time">Start Time:</label>
        <TimePicker v-model="startTime" format="HH" :is24="true" />
        <label for="end-time">End Time:</label>
        <TimePicker v-model="endTime" format="HH" :is24="true" />
      </div>
      <button class="play-button" @click="fetchData">재생</button>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import axios from "axios";
import TimePicker from "vue3-timepicker";
import {Fill, Stroke, Text} from "ol/style";

export default {
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      map: null,
      startTime: '',
      endTime: '',
      shipDate: '',
      items:[],
      coordinates: [],
      mmsi: []
    };
  },

  components:{
    TimePicker,
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
    //api 호출
    async fetchData() {
      try {
        const response = await axios.get(`http://localhost:8888/api/ShipRoute?shipDate=${this.shipDate}&startTime=${this.startTime}&endTime=${this.endTime}`);

        //json 가공
        const cleanedData = response.data
            .split('\n')
            .filter(line => line.trim().startsWith('data:'))
            .map(line => JSON.parse(line.replace(/^data:/, '').trim()));

        this.items = cleanedData; // 가공된 데이터를 저장

        // 위도와 경도만 추출
        this.coordinates = cleanedData.map(item => ({
          latitude: item.data[0].latitude,
          longitude: item.data[0].longitude
        }));

        // mmsi 추출
        this.mmsi = cleanedData.map(item => ({
          mmsi: item.data[0].mmsi,
        }));

        this.updateMarkers(); // 좌표를 바탕으로 마커 업데이트

        console.log("좌표 데이터:", this.coordinates); // 디버깅 로그
      } catch (error) {
        console.error("API ERROR:", error);
      }
    },

    //마커 추가
    updateMarkers() {
      if (!this.map) return;

      const vectorSource = new VectorSource();

      // 기존의 마커를 관리할 객체
      const existingFeatures = {};

      const addMarker = (index) => {
        if (index < this.coordinates.length) {
          const coord = this.coordinates[index];
          const mmsiValue = this.mmsi[index].mmsi; // 현재 MMSI 값 가져오기

          // 기존에 같은 MMSI가 있는 경우 해당 마커 삭제
          if (existingFeatures[mmsiValue]) {
            vectorSource.removeFeature(existingFeatures[mmsiValue]);
          }

          const feature = new Feature({
            geometry: new Point(fromLonLat([coord.longitude, coord.latitude]))
          });

          feature.setStyle(new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: 'marker.png',
              scale: 0.05
            }),
            text: new Text({
              text: mmsiValue, // MMSI 값을 텍스트로 추가
              offsetY: -25,
              scale: 1.5,
              fill: new Fill({ color: '#000' }),
              stroke: new Stroke({ color: '#fff', width: 2 }),
            }),
          }));

          // 새로운 마커 추가
          vectorSource.addFeature(feature);
          existingFeatures[mmsiValue] = feature; // 새로운 마커를 기존 마커 관리 객체에 추가

          // 다음 마커를 추가하기 위해 재귀 호출
          setTimeout(() => addMarker(index + 1), 500); // 500ms 간격으로 마커 추가
        }
      };

      // 기존 레이어 제거
      if (this.vectorLayer) {
        this.map.removeLayer(this.vectorLayer);
      }

      // 새로운 벡터 레이어 추가
      this.vectorLayer = new VectorLayer({
        source: vectorSource
      });

      this.map.addLayer(this.vectorLayer);

      // 첫 번째 마커 추가 시작
      addMarker(0);
    },


    //지도 초기화
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

    closeModal() {
      this.$emit('close');
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