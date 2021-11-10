<template>
  <div> {{predictions}}</div>
</template>

<script>
import {service} from "@/store/service";

export default {
  name: "Prediction",
  data(){
    return{
      predictions: []
    }
  },
  props: ['city','dateFrom','dateTo'],
  computed:{
    changeData(){
      return[this.city,this.dateFrom,this.dateTo]
    }
  },
  watch:{
    changeData: {
      handler: function() {
        this.getPrediction()
      },
    },

  },
  methods :{
    getPrediction() {
      let promise
      if (this.city)
        promise = service().getHourlyPredictionForNext24Hours(this.city,new Date(this.dateFrom), new Date(this.dateTo))
        promise.then(result => {
        this.predictions = result
      })
    }
  }
}
</script>

<style scoped>

</style>