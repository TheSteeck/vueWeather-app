<template>
  <q-layout class="layout">
    <div class="title">
      <h1>Прогноз погоды</h1>
      <h2>Тренировочное приложение</h2>
    </div>
    <div class="weather-section">

      <div class="filter">
        <q-input ref="input" @focus="focused = true" @blur="hideDropDown" bottom-slots :color="colorInput" v-model="city" @input="getCitiesNames" label="Название" dense>
          <template v-slot:append>
            <q-icon :color="colorInput" name="close" @click="city = ''" class="cursor-pointer" />
          </template>
          <template v-if="errMsgShow" v-slot:hint>
            {{errMsg}}
          </template>
        </q-input>
        <div ref="dropDown" class="drop-down-items">
          <div v-for="(item, i) in filtredCities" :key="i" @click="city = item, getToday()" class="d-d-item">
            {{item}}
          </div>
        </div>
        <q-btn @click="getToday" size="lg" unelevated rounded icon="search" color="purple" label="Искать" />
      </div>

      <div class="output">
        <h3>{{today.name}}</h3>
        <div class="weather">
          <div class="today data">
            <p>Сегодня</p>
            <div>
              <img :src="imageToday" />
              <p>{{today.description}}</p>
            </div>
            <p>{{today.temp}}</p>
          </div>
          <div class="tommorow data">
            <p>Завтра</p>
            <div>
              <img :src="imageTomorrow" />
              <p>{{tomorrow.description}}</p>
            </div>
            <p>{{tomorrow.temp}}</p>
          </div>
          <div class="after-tommorow data">
            <p>Послезавтра</p>
            <div>
              <img :src="imageAfterTomorrow" />
              <p>{{tomorrow.description}}</p>
            </div>
            <p>{{tomorrow.temp}}</p>
          </div>
        </div>
      </div>

    </div>
  </q-layout>
</template>

<script>
import Axios from 'axios'
export default {
  name: 'MainLayout',
  data () {
    return {
      city: 'Москва',
      today: {
        temp: '',
        descriprion: '',
        name: ''
      },
      tomorrow: {
        temp: '',
        descriprion: ''
      },
      afterTomorrow: {
        temp: '',
        descriprion: ''
      },
      imageToday: '',
      imageTomorrow: '',
      imageAfterTomorrow: '',

      errMsg: 'Город не найден',
      errMsgShow: true,
      colorInput: '',

      citiesList: [],
      filtredCities: [],
      focused: false
    }
  },

  mounted () {
    this.getToday()
  },

  methods: {
    getToday () {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&lang=ru&units=metric&appid=148bc838f76399f290f7a818c1241656`
      this.getAfterToday()
      Axios
        .get(url)
        .then(response => {
          if (response.data.main.temp > 0) {
            this.today.temp = `+${Math.round(response.data.main.temp)}`
          } else {
            this.today.temp = Math.round(response.data.main.temp)
          }
          this.today.description = response.data.weather[0].description
          this.today.name = response.data.name
          this.imageToday = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`

          this.errMsgShow = false
          this.colorInput = 'primary'
        })
        .catch(err => {
          console.log(err)
          this.errMsgShow = true
          this.colorInput = 'red'
          this.$q.notify({
            message: 'Ошибка, город не найден.',
            color: 'red'
          })
        })
    },

    getAfterToday () {
      const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&lang=ru&units=metric&cnt=19&appid=148bc838f76399f290f7a818c1241656`
      Axios
        .get(url2)
        .then(response => {
          if (response.data.list[10].main.temp > 0) {
            this.tomorrow.temp = `+${Math.round(response.data.list[10].main.temp)}`
          } else {
            this.tomorrow.temp = Math.round(response.data.list[10].main.temp)
          }
          this.tomorrow.description = response.data.list[10].weather[0].description
          this.afterTomorrow.temp = Math.round(response.data.list[18].main.temp)
          this.afterTomorrow.description = response.data.list[18].weather[0].description
          this.imageTomorrow = `http://openweathermap.org/img/wn/${response.data.list[10].weather[0].icon}.png`
          this.imageAfterTomorrow = `http://openweathermap.org/img/wn/${response.data.list[18].weather[0].icon}.png`
        })
    },

    getCitiesNames () {
      Axios
        .get('russian-cities.json')
        .then(response => {
          response.data.map(city => {
            this.citiesList.push(city.name)
          })
        })
        .then(() => {
          this.filtredCities = [...new Set(this.citiesList.filter(name => { // [...new Set(...)] удаляет дубликаты в массиве
            return name.match(`^${this.city.charAt(0).toUpperCase() + this.city.slice(1)}`)
          }))]
          this.$refs.dropDown.style.height = '20vh'
        })
    },

    hideDropDown () {
      setTimeout(() => {
        this.$refs.dropDown.style.height = '0vh'
      }, 100)
    }

  }
}
</script>

<style lang="sass">
  $orange: #F44336
  $dark: #3C4858
  $purple: #9C27B0
  *
    padding: 0
    margin: 0
  .layout
    width: 100%
    height: 100vh
    position: relative
    background: url(~assets/bg.jpg) no-repeat center/cover
    z-index: 1
    display: grid
    grid-template-rows: 1fr 1fr
    justify-content: center
    align-items: center
    text-align: center
    &::after
      content: ''
      position: absolute
      top: 0
      left: 0
      background: rgba(125, 46, 185, 0.45)
      width: 100%
      height: 100%
      z-index: -1
    .title
      display: grid
      grid-template-rows: 0fr 0fr
      grid-gap: 3vw
      h1
        color: #fff
        font-family: 'Roboto', sans-serif
        font-weight: 600
        font-size: 64px
      h2
        font-size: 24px
        font-weight: 400
        color: #fff
    .weather-section
      position: absolute
      bottom: -10vh
      justify-self: center
      width: 98%
      height: 50vh
      background: #fff
      border-radius: 6px
      display: grid
      grid-template-columns: 20vw 50vw
      padding-top: 6vh
      align-items: top
      justify-content: center
      box-shadow: 0 0 1vh #111
      .filter
        display: grid
        grid-template-rows: 0fr 0fr 0fr
        // grid-gap: 1vh
        // position: relative
        .drop-down-items
          display: grid
          height: 0vh
          width: 100%
          overflow-y: scroll
          background-color: #f3f3f3
          transition: .3s, easy
          &::-webkit-scrollbar
            width: .5vw
          &::-webkit-scrollbar-thumb
            background: #ddd
            border-radius: 20px
          .d-d-item
            display: grid
            align-items: center
            height: 4vh
            cursor: pointer
            transition: .3s, easy
            &:hover
              background: #ddd

        button
          align-self: start
          justify-self: center
      .output
        display: grid
        grid-template-rows: 1fr 3fr
        justify-content: center
        text-align: left
        color: $dark
        h3
          font-size: 30px
        .weather
          display: grid
          grid-template-rows: repeat(3, 6vh)
          .data
            display: grid
            grid-template-columns: 50% 80% 20%
            font-size: 24px
            white-space: nowrap
            div
              display: grid
              grid-template-columns: 0fr 0fr
</style>
