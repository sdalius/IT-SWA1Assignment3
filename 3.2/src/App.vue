<template>
  <div id="app">
    <label> Select your city </label>
    <select v-model="selectedCity">
      <option v-for="(item) in cities" :key="item.id" >{{item}}</option>
    </select>
    <label>Start date:</label>
    <date-pick v-model="dateFrom" :pickTime="true"
               :format="'YYYY-MM-DD HH:mm'"></date-pick>

    <label>End date:</label>
    <date-pick v-model="dateTo" :pickTime="true"
               :format="'YYYY-MM-DD HH:mm'"></date-pick>
    <h3>Latest Measurement</h3>
    <LatestMeasurement :city="selectedCity"/>
    <h3>Max Temperature</h3>
    <Temperature :city="selectedCity" min-or-max="max" :date-from="dateFrom" :date-to="dateTo"/>
    <h3>Min Temperature</h3>
    <Temperature :city="selectedCity" min-or-max="min" :date-from="dateFrom" :date-to="dateTo"/>
    <h3>Total Precipitation</h3>
    <TotalPrecipitation :city="selectedCity" :date-from="dateFrom" :date-to="dateTo"/>
    <h3>Average Wind Speed</h3>
    <AverageWindSpeed :city="selectedCity" :date-from="dateFrom" :date-to="dateTo"/>
    <label>Start date:</label>
    <date-pick
        v-model="predictiveDateFrom" :pickTime="true"
        :format="'YYYY-MM-DD HH:mm'"
        :isDateDisabled="isPastDate"
    ></date-pick>
    <label>End date:</label>
    <date-pick
        v-model="predictiveDateTo" :pickTime="true"
        :format="'YYYY-MM-DD HH:mm'"
        :isDateDisabled="isPastDate"
    ></date-pick>
    <Prediction :city="selectedCity" :date-from="predictiveDateFrom" :date-to="predictiveDateTo" />
    <RequestForm/>
  </div>
</template>

<script>

import LatestMeasurement from "@/components/LatestMeasurement";
import Temperature from "@/components/Temperature";
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';
import TotalPrecipitation from "@/components/TotalPrecipitation";
import AverageWindSpeed from "@/components/AverageWindSpeed";
import Prediction from "@/components/Prediction";
import RequestForm from "@/components/RequestForm";
export default {
  name: 'App',
  components: {
    RequestForm,
    Prediction,
    AverageWindSpeed,
    TotalPrecipitation,
    Temperature,
    LatestMeasurement,
    DatePick
  },
  data: function (){
    return {
      selectedCity: '',
      cities : ["Horsens","Aarhus","Copenhagen"],
    }
  },
  props : ['dateFrom','dateTo','predictiveDateFrom','predictiveDateTo'],
  methods:{
    isPastDate(date){
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate()-1)
      return date < currentDate;
    }
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
