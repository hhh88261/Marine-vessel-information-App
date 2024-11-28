<template>
  <SideBar :markers="markers" :map="map" :count="count" />
  <div id="map" ref="mapContainer" class="map"></div>
  <div id="popup" ref="popup" class="ol-popup">
    <a href="#" id="popup-closer" ref="popupCloser" class="ol-popup-closer"></a>
    <div id="popup-content" ref="popupContent"></div>
  </div>
  <div class="datepicker-container">

    날짜<input type="date" min="2024-01-01" v-model="shipDate"/>
    <label for="start-time">Start Time:</label>
    <TimePicker v-model="startTime" format="HH" :is24="true" />

    <label for="end-time">End Time:</label>
    <TimePicker v-model="endTime" format="HH" :is24="true" />
    <button @click="handleTimeSelect" >Replay</button>
    <OldMapModal :isOpen="isModalOpen" @close="closeModal" />
    <div v-if="startTime && endTime">
      <p>선택된 시간: {{ startTime }} ~ {{ endTime }}</p>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import { Overlay } from 'ol';
import { Text, Style, Icon, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import SideBar from './common/SideBar.vue';
import TimePicker from 'vue3-timepicker';
import OldMapModal from './Modal/OldMapModal.vue';

export default {
  name: 'OpenLayersMap',
  data() {
    return {
      ws: null,
      markers: {},
      map: null,
      overlay: null,
      vectorSource: new VectorSource(), // 벡터 소스 초기화
      routes: {},
      count: 0,
      startTime: '',
      endTime: '',
      shipDate: '',
      isModalOpen: false
    };
  },
  components:{
    TimePicker,
    SideBar,
    OldMapModal
  },
  created() {
    this.connectWebSocket();
  },
  mounted() {
    this.initMap();
  },

  methods: {
    handleTimeSelect() {
      if(this.startTime > this.endTime && this.endTime != '' && this.startTime != '') {
        console.log("시작 시간보다 끝나는 시간이 더 커야합니다.",this.startTime, this.endTime);
      } else if(this.startTime == '' || this.endTime == '') {
        console.log("시간이 null입니다.")
      } else {
        this.ws.send(`p,${this.shipDate},${this.startTime},${this.endTime}`);
        this.isModalOpen = true;
      }
    },

    closeModal(){
      this.isModalOpen = false;
    },

    connectWebSocket() {
      this.ws = new WebSocket("ws://localhost:7777/websocket/websocket");

      this.ws.onmessage = (event) => {
        const data = event.data;
        console.log(data);
        if (data.length > 1) {
          this.updateMarker(data);
        }
      };

      this.ws.onopen = () => {
        console.log("WebSocket 연결 성공");
      };

      this.ws.onclose = () => {
        console.log("WebSocket 연결 닫힘");
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket 에러: ", error);
      };
    },

    initMap() {
      const initialCoordinates = [128.0652, 35.79261];
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({ source: this.vectorSource }), // 벡터 레이어 추가
        ],
        view: new View({
          center: fromLonLat(initialCoordinates),
          zoom: 6.5,
        }),
      });

      this.overlay = new Overlay({
        element: this.$refs.popup,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      this.map.addOverlay(this.overlay);

      this.$refs.popupCloser.onclick = () => {
        this.overlay.setPosition(undefined);
        this.$refs.popupCloser.blur();
        return false;
      };

      this.map.on('click', this.handleMapClick);
    },

    handleMapClick(event) {
      this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const coordinates = feature.getGeometry().getCoordinates();
        const mmsi = feature.get('mmsi');
        const shipInfo = feature.get('shipInfo');

        this.overlay.setPosition(coordinates);
        if (shipInfo) {
          const {
            shipCallSign,
            shipName,
            ShipCountry,
            ShipWeight,
            ShipOperationType,
            lat,
            lon,
            trueHead,
            sog,
            newLat,
            newLon,
            cog
          } = shipInfo;

          this.$refs.popupContent.innerHTML = `<p>MMSI: ${mmsi}</p>
            <p>Call Sign: ${shipCallSign}</p>
            <p>Ship Name: ${shipName}</p>
            <p>Country: ${ShipCountry}</p>
            <p>Weight(Ton): ${ShipWeight}</p>
            <p>Operation Type: ${ShipOperationType}</p>
            <p>Ship Lat(°): ${lat}</p>
            <p>Ship Lon(°): ${lon}</p>
            <p>Ship Head Location(°): ${trueHead}</p>
            <p>Ship Speed(Knot): ${sog}</p>
            <p>New Latitude(°): ${newLat}</p>
            <p>New Longitude(°): ${newLon}</p>
            <p>Course Over Ground(°):${cog}</p>`;
        } else {
          this.$refs.popupContent.innerHTML = `<p>MMSI: ${mmsi}</p>`;
        }
      });
    },

    updateMarker(data) {
      let parsedData;
      let coordinates;

      console.log(parsedData);

      //선박의 제원정보가 조회되었을 때
      if (data.startsWith('*')) {
        const shipImformation = data.split(',');
        const [infoType, mmsi, shipCallSign, shipName, ShipCountry, ShipWeight, ShipOperationType] = shipImformation;
        if (infoType && mmsi && this.markers[mmsi]) {
          this.markers[mmsi].getStyle().getText().setText(shipName);
          this.markers[mmsi].set('shipInfo', {
            shipCallSign,
            shipName,
            ShipCountry,
            ShipWeight,
            ShipOperationType,
          });
        }
        //메시지 타입이 5일 때
      } else if (data.startsWith('5')) {
        parsedData = data.split(',');
        const [msgId, mmsi, shipName] = parsedData;
        if (msgId && this.markers[mmsi]) {
          this.markers[mmsi].getStyle().getText().setText(shipName);
        }
        //메시지 타입이 1일 때
      } else {
        parsedData = data.split(',');
        const [msgId, lat, lon, mmsi, trueHead, sog, newLat, newLon, cog] = parsedData;
        coordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);


        //메시지 타입이 1이고 지도에 추가된 mmsi가 있을 때
        if (msgId && this.markers[mmsi] && trueHead) {
          this.markers[mmsi].setGeometry(new Point(coordinates));
          this.markers[mmsi].set('shipInfo', {
            lat,
            lon,
            trueHead,
            sog,
            newLat,
            newLon,
            cog
          });

          // 현재 위치와 10분 후 위치
          const currentPosition = [parseFloat(lon), parseFloat(lat)];
          const futurePosition = [parseFloat(newLon), parseFloat(newLat)];

          // LineString 생성
          const route = new LineString([
            fromLonLat(currentPosition),
            fromLonLat(futurePosition),
          ]);

          //이미 그려진 경로가 있다면 제거
          if(this.routes[mmsi]) {
            this.map.removeLayer(this.routes[mmsi]);
          }

          const routeFeature = new Feature(route);
          const routeLayer = new VectorLayer({
            source: new VectorSource({
              features: [routeFeature],
            }),
            style: new Style({
              stroke: new Stroke({
                color: 'blue',
                width: 4,
              }),
            }),
          });

          // 새로운 경로 레이어를 지도에 추가
          this.map.addLayer(routeLayer);
          this.routes[mmsi] = routeLayer; // 새로운 경로 레이어를 저장

          //지도에 없고 새로운 mmsi일 때 지도에 마커를 추가
        } else {
          const marker = new Feature({
            geometry: new Point(coordinates),
            mmsi,
          });

          // 마커 개수 업데이트
          this.count = Object.keys(this.markers).length;

          //마커 스타일
          const iconStyle = new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: 'marker.png',
              scale: 0.050,
              rotation: trueHead * Math.PI / 180,
            }),
            text: new Text({
              text: mmsi,
              offsetY: -25,
              scale: 1.5,
              fill: new Fill({color: '#000'}),
              stroke: new Stroke({color: '#fff', width: 2}),
            }),
          });

          marker.setStyle(iconStyle);

          const vectorSource = new VectorSource({
            features: [marker],
          });

          const vectorLayer = new VectorLayer({
            source: vectorSource,
          });

          this.map.addLayer(vectorLayer);

          this.vectorSource.addFeature(marker); // 벡터 소스에 마커 추가
          this.markers[mmsi] = marker; // 마커 저장
        }
      }
    },
  },
};
</script>

<style scoped>
.map {
  width: calc(100% - 250px); /* 사이드바의 너비를 고려 */
  height: 100vh;
  position: relative;
  float: right; /* 오른쪽에 위치 */
}

#side-bar {
  width: 250px; /* 사이드바 고정 너비 */
  height: 100vh; /* 전체 높이 사용 */
  float: left; /* 왼쪽에 위치 */
  background: #2c3e50; /* 사이드바 배경색 */
  color: white; /* 텍스트 색상 */
}

.ol-popup {
  position: absolute;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid black;
  bottom: 12px;
  left: -50px;
  min-width: 200px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.datepicker-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.ol-popup-closer:after {
  content: "✖";
}
</style>
