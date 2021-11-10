import {request} from "./baseFunction.js";

export function service() {

    const getLatestMeasurementData = (city) => {
        const path = `data/${city}`
        let tempVal = []

        request(path,(response) => {

            let temp = ["temperature","precipitation","cloud coverage","wind speed"].
            map(type => response.filter(data => data.type === type)
                .sort((a,b) => new Date(b.time) - new Date(a.time))
                .slice(0,1))


            temp.forEach((item)=>{tempVal.push(JSON.stringify(item[0]))})
        })
        return tempVal
    }

    const getMinOrMaxTemp =  async (city,minOrMax, dateFrom, dateTo) => {
        const path = `data/${city}`
        let tempVal = 0

        await request(path, (response) => {
            let temp = response.filter(data => data.type == "temperature")
                .sort((a, b) => new Date(b.time) - new Date(a.time))

            console.log(temp)

            tempVal = temp
                .filter(a => new Date(a.time) >= dateFrom)
                .filter(a => new Date(a.time) <= dateTo)
                .reduce((accumulator,currVal)=> minOrMax === "min" ? Math.min(accumulator,currVal.value) : Math.max(accumulator,currVal.value),[])
        })

        return tempVal
    }

    const getTotalPrecipitation = async(city,dateFrom,dateTo) =>{
        const path = `data/${city}`
        let tempVal = []

        await request(path,(response)=>{
            let temp = response.filter(data => data.type == "precipitation")
                .sort((a,b) => new Date(b.time) - new Date(a.time))


            tempVal = temp
                .filter(a => new Date(a.time) >= dateFrom)
                .filter(a => new Date(a.time) <= dateTo)
                .reduce((accumulator,currVal) => accumulator + currVal.value,0)

            console.log(tempVal)
        })

        return tempVal
    }

    const getWindSpeed = async(city,dateFrom,dateTo) =>{
        const path = `data/${city}`
        let tempVal = 0

       await request(path,(response)=>{
            let temp = response.filter(data => data.type == "wind speed")
                .sort((a,b) => new Date(b.time) - new Date(a.time))

            temp = temp
                .filter(a => new Date(a.time) >= dateFrom)
                .filter(a => new Date(a.time) <= dateTo)
            let length = temp.length
             tempVal = temp.reduce((a, b) => (a + b.value),0) / length
        })
        return tempVal
    }

    const getHourlyPredictionForNext24Hours = async(city,dateFrom,dateTo) => {
        const path = `forecast/${city}`
        let tempVal = []

        await request(path,(response)=>{
            let temp = response
                .sort((a,b) => new Date(b.time) - new Date(a.time))

            temp = temp
                .filter(a => new Date(a.time) >= dateFrom)
                .filter(a => new Date(a.time) <= dateTo)

             tempVal = temp.map((item) => JSON.stringify(item))
        })
        return tempVal
    }

    const sendRequestWithValue = (measurement) =>{

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: "POST",
            body: JSON.stringify(measurement),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
    }


    return{
        getLatestMeasurementData,
        getMinOrMaxTemp,
        getTotalPrecipitation,
        getWindSpeed,
        getHourlyPredictionForNext24Hours,
        sendRequestWithValue
    }
}








