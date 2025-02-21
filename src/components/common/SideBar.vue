<template>
  <div id="side-bar">
    <h3>Menu</h3>
    <div class="search-form-input">
      <!-- v-model로 mmsi와 바인딩 -->
      <input id="input-default" type="text" v-model="mmsi" v-on:keyup.enter="searchresultshow">
    </div>
    <div class="search-form-button">
      <button @click="searchresultshow">
        검색
      </button>
    </div>
    <h4>선박 수</h4>
    {{count}}
  </div>
</template>

<script>
export default {
  props:{
    count:{
      type: Number,
      required: true
    },
    markers:{
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      mmsi:'',
    }
  },
  methods:{
    searchresultshow() {

      if (this.mmsi) {

        console.log(`"${this.mmsi}" 검색`);
        const marker = this.markers[this.mmsi];
        if(marker) {
          const coordinates = marker.getGeometry().getCoordinates();


          this.map.getView().setCenter(coordinates);

          this.map.getView().setZoom(15);





        } else {
          console.log("정보를 찾을 수 없음");
        }
      } else {
        console.log('MMSI를 입력하세요');
      }
    }
  }
}
</script>

<style scoped>
#side-bar {
  width: 250px; /* 사이드바의 고정 너비 */
  background: #2c3e50; /* 사이드바 배경색 */
  color: white; /* 텍스트 색상 */
  height: 100vh; /* 전체 높이 사용 */
  float: left; /* 사이드바를 왼쪽에 배치 */
}
</style>
