<template>
  <div>{{average}}</div>
</template>

<script>
import {service} from "@/store/service";

export default {
  name: "AverageWindSpeed",
  data(){
    return{
      average : []
    }
  },
  props: ['city','dateFrom','dateTo'],
  computed:{
    changeData(){
      return[this.city,this.dateFrom,this.dateTo]
    }
  },
  watch:{
    changeData:{
      handler(){
        this.getAverageWindSpeed()
      }
    }
  },
  methods:{
    getAverageWindSpeed(){
      let promise
      if(this.city)
        promise = service().getWindSpeed(this.city,new Date(this.dateFrom),new Date(this.dateTo))
      promise.then(result => {
        this.average = result
      })
    }
  }
}
</script>

<style scoped>

</style>