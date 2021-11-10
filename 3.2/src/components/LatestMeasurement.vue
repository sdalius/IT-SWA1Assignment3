<template>
  <div>{{latestMeasurementsVal}}</div>
</template>

<script>
import {service} from "@/store/service";

export default {
  name: "LatestMeasurement",
  data: function () {
    return {
      latestMeasurementsVal : []
    }
  },
  props : ['city'],
  watch:{
    city: {
      handler() {
       this.getLatestMeasurement()
      }
    }
  },
  methods : {
      getLatestMeasurement(){
        if(this.city)
        this.latestMeasurementsVal = service().getLatestMeasurementData(this.city)
      }
  }
}
</script>

<style scoped>

</style>