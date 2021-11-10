<template>
<div>{{total}}</div>
</template>

<script>
import {service} from "@/store/service";
export default {
  name: "TotalPrecipitation",
  data(){
    return{
      total : []
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
        this.getTotalPrecipitation()
      }
    }
  },
  methods:{
    getTotalPrecipitation(){
      let promise
      if(this.city)
        promise = service().getTotalPrecipitation(this.city,new Date(this.dateFrom),new Date(this.dateTo))
        promise.then(result => {
        this.total = result
      })
    }
  }
}
</script>

<style scoped>

</style>