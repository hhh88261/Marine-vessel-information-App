# 실시간 선박 위치 추적 프로그램


## 프로젝트 설명
- 선박 추적 프로그램의 프론트엔드 서버입니다.

## 개발 도구
<img src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=Vue.js&logoColor=white"/>

## 시작 가이드
요구사항
- `npm 8.1.2`
- `node 16.13.2`
- `vue cli 5.0.8`
- `vue 3.5.6`

설치 방법
```
git clone www.naver.com  
cd Marine-vessel-imforamtion-App
```
```    
npm install
npm run serve
```

## 주요 기능
### 추적 기능
- 선박의 위치가 검은색 마커로 표시되며 파란색 선으로 선박의 10분뒤 위치를 알려줍니다.
- 새로운 위치 정보가 들어올 때 마다 마커의 위치가 변경됩니다.
![Image](https://github.com/user-attachments/assets/088d9dbf-1b16-4827-9f1d-6a69e13e3a95)

### 검색 기능
- 선박번호(MMSI)를 검색창에 입력 후 검색 버튼을 누르면 선박이 위치한 곳으로 화면을 이동시킵니다.
- 마커를 클릭하면 선박에 대한 상세정보를 볼 수 있습니다.
![Image](https://github.com/user-attachments/assets/186752a2-506e-426f-8f8b-899772e7682d)

### 리플레이 기능
- 날짜, 시간을 입력 후 재생 버튼을 눌러 과거의 선박 경로를 확인할 수 있습니다.
![Image](https://github.com/user-attachments/assets/03120119-992e-4074-a9aa-b8ab4cfb21a1)
