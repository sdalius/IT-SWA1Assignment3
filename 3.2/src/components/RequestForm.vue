<template>
<div>
    <label>Choose value:</label>
    <input type="number" v-model="measurement.value" placeholder="input value"/>
    <label>Choose Type:</label>
    <select v-model="measurement.type">
      <option>temperature</option>
      <option>precipitation</option>
      <option>wind speed</option>
      <option>cloud coverage</option>
    </select>
    <label>Choose unit:</label>
    <select v-model="measurement.unit">
      <option>C</option>
      <option>F</option>
    </select>
    <label>Choose Place:</label>
    <select v-model="measurement.place">
      <option>Horsens</option>
      <option>Aarhus</option>
      <option>Copenhagen</option>
    </select>
    <button v-on:click="addMeasurement()">submit2</button>
</div>
</template>
<script>
import {service} from "@/store/service";
export default {
  name: "RequestForm",
  data(){
    return {
      measurement : {
        value : "",
        type:"",
        unit:"",
        date:new Date(),
        place:""
      },
    }
  },
  methods : {
    addMeasurement(){
      service().sendRequestWithValue(this.measurement)
    }
  }

}
</script>

<style scoped>
form{
  margin: 10px;
}
</style>