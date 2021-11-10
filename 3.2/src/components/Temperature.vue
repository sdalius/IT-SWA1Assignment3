<template>
<div> {{measurements}}</div>
</template>

<script>
import {service} from "@/store/service";

export default {
  name: "Temperature",
  data(){
    return{
      measurements: 0
    }
  },
  props: ['city','minOrMax','dateFrom','dateTo'],
  computed:{
    changeData(){
      return[this.city,this.dateFrom,this.dateTo]
    }
  },
  watch:{
    changeData: {
      handler: function() {
        this.getMeasurementOfTemperature()
      },
    },

  },
  methods :{
     getMeasurementOfTemperature() {
      let promise
      if (this.city)
        promise = service().getMinOrMaxTemp(this.city,this.minOrMax,new Date(this.dateFrom), new Date(this.dateTo))
       promise.then(result => {
         this.measurements = result
       })
    }
  }
}
</script>

<style scoped>

</style>