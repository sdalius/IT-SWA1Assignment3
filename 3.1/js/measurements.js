export default window  => {
const latest_measurements_body = document.getElementById('latestMeasurementdata')
const five_Days_Min_Temp_Table = document.getElementById('fivedaysTempBody')
const five_Days_Max_Temp_Table = document.getElementById('fivedayMaxTempBody')
const five_Days_Total_Precipitation = document.getElementById('fivedayTotalPrecipitationBody')
const five_Days_Avg_Wind_Speed = document.getElementById('avgWindSpeedBody')
const prediction_for_24hours = document.getElementById('predictionfor24hoursBody')
const getSelectedDateForHistory = document.getElementById('dateforHistory')
const getSelectedDateForPredictions = document.getElementById('dateForPredictions')
const getSelectedCity = document.getElementById('city')
const getMeasurementUnit = document.getElementById('measurementUnit')

//Post stuff
const valuePost = document.getElementById('value')
const typePost = document.getElementById('type')
const datePost = document.getElementById('date')
const timePost = document.getElementById('time')
const placePost = document.getElementById('place')
const precipitationtypePost = document.getElementById('precipitationType')
const directionPost = document.getElementById('direction')

const getCurrentDateForPredictionsAndHistory = () => {
    getSelectedDateForHistory.value = new Date().toISOString().slice(0, 10);
    getSelectedDateForPredictions.value = new Date().toISOString().slice(0, 10);
}

const getMeasurementData = () => {
        const request = new XMLHttpRequest()
        request.open('GET', 'http://localhost:8080/data/' + getSelectedCity.value)
        request.send()
        request.onerror = () => {displayError(request.responseText)}
        if (request.status != 200) {
            displayError(request.responseText)
        }
        request.onload = () => {
            clearlatestMeasurements()
        const measurementData = JSON.parse(request.responseText)
        const getLatestMeasurementDate = () => measurementData.reduce((oldest, measurementData) => ( Date.parse(measurementData.time) > Date.parse(oldest.time)) ? oldest = measurementData : oldest)
        const latestMeaurements = () => measurementData.filter(measurementData => Date.parse(measurementData.time) >= Date.parse(getLatestMeasurementDate().time))
        addMeasurements(latestMeaurements())
        updateHistoryFields(getSelectedDateForHistory.value)
        predictions24hours(getSelectedDateForPredictions.value)
    }
}
// Post request to API
const postData = () => {
    var dateAndTime = new Date(datePost.value + " " + timePost.value)
    var json;
    const request = new XMLHttpRequest()
    request.onload = () => {
        // print JSON response
        if (request.status >= 200 && request.status < 300) {
            // parse JSON
            const response = JSON.parse(request.responseText);
            console.log(response);
        }
    };
    
    if (typePost.value === 'temperature' )
    {
        json = {"value": valuePost.value, "type": typePost.value, "unit":'C', "time": dateAndTime, "place": placePost.value}
    }
    else if (typePost.value === 'cloud coverage')
    {
        json = {"value": valuePost.value, "type": typePost.value, "unit":'%', "time": dateAndTime, "place": placePost.value}
    }
    else if (typePost.value === 'wind speed')
    {
        json = {"value": valuePost.value, "direction": directionPost.value, "type": typePost.value, "unit":'m/s', "time": dateAndTime, "place": placePost.value}

    }
    else
    {
        json = {"value": valuePost.value, "precipitation_type":precipitationtypePost.value, "type": typePost.value, "unit":'mm', "time": dateAndTime, "place": placePost.value}
    }
    // open request
    request.open('POST', 'http://localhost:8080/data/', true);

    // set `Content-Type` header
    request.setRequestHeader('Content-Type', 'application/json');
    
    // send rquest with JSON payload
    request.send(JSON.stringify(json));
}

const disableFieldsAccordingToType = () => {
    if (typePost.value === 'temperature')
    {
        getMeasurementUnit.textContent = 'C'
        precipitationtypePost.disabled = true
        directionPost.disabled = true
    }
    else if(typePost.value === 'cloud coverage')
    {
        getMeasurementUnit.textContent = '%'
        precipitationtypePost.disabled = true
        directionPost.disabled = true
    }
    else if(typePost.value === 'wind speed')
    {
        getMeasurementUnit.textContent = 'M/S'
        precipitationtypePost.disabled = true
        directionPost.disabled = false
    }
    else
    {
        getMeasurementUnit.textContent = 'MM'
        precipitationtypePost.disabled = false
        directionPost.disabled = true
    }
}


const refreshAllData = () => {
    getMeasurementData()
    getCurrentDateForPredictionsAndHistory()
}

const updateHistoryFields = () => {
    var convertToProperDate = new Date(getSelectedDateForHistory.value)
    minTempFiveDays(convertToProperDate)
    maxTempFiveDays(convertToProperDate)
    totalPrecipitaion(convertToProperDate)
    avgWindSpeed(convertToProperDate)
}

const clearlatestMeasurements = () =>{
    while(latest_measurements_body.firstChild) latest_measurements_body.removeChild(latest_measurements_body.firstChild)
}

const clearMinTempTable = () =>{
    while(five_Days_Min_Temp_Table.firstChild) five_Days_Min_Temp_Table.removeChild(five_Days_Min_Temp_Table.firstChild)
}

const clearMaxTempTable = () =>{
    while(five_Days_Max_Temp_Table.firstChild) five_Days_Max_Temp_Table.removeChild(five_Days_Max_Temp_Table.firstChild)
}

const clearTotalPrecipitation = () =>{
    while(five_Days_Total_Precipitation.firstChild) five_Days_Total_Precipitation.removeChild(five_Days_Total_Precipitation.firstChild)
}

const clearAvgWindSpeedTable = () =>{
    while(five_Days_Avg_Wind_Speed.firstChild) five_Days_Avg_Wind_Speed.removeChild(five_Days_Avg_Wind_Speed.firstChild)
}

const clearPredictionTable = () => {
    while(prediction_for_24hours.firstChild) prediction_for_24hours.removeChild(prediction_for_24hours.firstChild)
}

const addMeasurements = (p) => {
    const tr = latest_measurements_body.appendChild(document.createElement('tr'))
    tr.insertCell().appendChild(document.createTextNode(p[0].place))

    for(let i = 0; i < p.length; i++)
    {
        if(p[i].type === 'temperature')
        {
            tr.insertCell().appendChild(document.createTextNode(p[i].value + " " + p[i].unit))
        }
        else if (p[i].type === 'precipitation')
        {
            tr.insertCell().appendChild(document.createTextNode(p[i].value + " " + p[i].unit + " " + p[i].precipitation_type))
        }
        else if (p[i].type === 'wind speed'){
            tr.insertCell().appendChild(document.createTextNode(p[i].value + " " + p[i].unit + " " + p[i].direction))
        }
        else if (p[i].type === 'cloud coverage')
        {
            tr.insertCell().appendChild(document.createTextNode(p[i].value + " " + p[i].unit))
        }
    }
}

const minTempFiveDays = (date) => {
        var place = getSelectedCity.value
        const request = new XMLHttpRequest()
        request.open('GET', 'http://localhost:8080/data/' + place)
        request.send()
        request.onerror = () => {displayError(request.responseText)}
        if (request.status != 200) {
            displayError(request.responseText)
        }
        request.onload = () => {
            clearMinTempTable()
            const measurementData = JSON.parse(request.responseText)
            // Getting current date
            var currDate = new Date(date)
            var fiveDaysBefore = new Date(currDate)
            // Setting fiveDaysBefore 5 days before current date
            fiveDaysBefore.setDate( fiveDaysBefore.getDate() - 5)
            // Filtering data so that it would be in between current date and 5 days before current date, and then getting the minimum temperature out of those 5 days
            const getLatestMeasurementDate = () => measurementData.filter(data => Date.parse(data.time) <= Date.parse(currDate) && Date.parse(data.time) >= Date.parse(fiveDaysBefore) && data.type === 'temperature').reduce((minimumTemperature, currValue) => ( currValue.value < minimumTemperature.value) ? minimumTemperature = currValue : minimumTemperature)
            // Adding it to the Minimum temperature table
            const tr = five_Days_Min_Temp_Table.appendChild(document.createElement('tr'))
            tr.insertCell().appendChild(document.createTextNode(getLatestMeasurementDate().place))
            tr.insertCell().appendChild(document.createTextNode(getLatestMeasurementDate().value + " " + getLatestMeasurementDate().unit))
        }
}

const maxTempFiveDays = (date) => {
    var place = getSelectedCity.value
    const request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:8080/data/' + place)
    request.send()
    request.onerror = () => {displayError(request.responseText)}
    if (request.status != 200) {
        displayError(request.responseText)
    }
    request.onload = () => {
        clearMaxTempTable()
        const measurementData = JSON.parse(request.responseText)
         // Getting current date
         var currDate = new Date(date)
        var fiveDaysBefore = new Date(currDate)
        // Setting fiveDaysBefore 5 days before current date
        fiveDaysBefore.setDate( fiveDaysBefore.getDate() - 5)
        // Filtering data so that it would be in between current date and 5 days before current date, and then getting the maximum temperature out of those 5 days
        const getLatestMeasurementDate = () => measurementData.filter(data => Date.parse(data.time) <= Date.parse(currDate) && Date.parse(data.time) >= Date.parse(fiveDaysBefore) && data.type === 'temperature').reduce((minimumTemperature, currValue) => ( currValue.value > minimumTemperature.value) ? minimumTemperature = currValue : minimumTemperature)
        // Adding it to the Maximum temperature table
        const tr = five_Days_Max_Temp_Table.appendChild(document.createElement('tr'))
        tr.insertCell().appendChild(document.createTextNode(getLatestMeasurementDate().place))
        tr.insertCell().appendChild(document.createTextNode(getLatestMeasurementDate().value + " " + getLatestMeasurementDate().unit))
    }
}

const totalPrecipitaion = (date) => { 
    const request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:8080/data/' + getSelectedCity.value)
    request.send()
    request.onerror = () => {displayError(request.responseText)}
    if (request.status != 200) {
        displayError(request.responseText)
    }
    request.onload = () => {
        clearTotalPrecipitation()
        const measurementData = JSON.parse(request.responseText)
        // Getting current date
        var currDate = new Date(date)
        var fiveDaysBefore = new Date(currDate)
        // Setting fiveDaysBefore 5 days before current date
        fiveDaysBefore.setDate( fiveDaysBefore.getDate() - 5)
        // Filtering data so that it would be in between current date and 5 days before current date
        const getLatestMeasurementDate = () => measurementData.filter(data => Date.parse(data.time) <= Date.parse(currDate) && Date.parse(data.time) >= Date.parse(fiveDaysBefore) && data.type === 'precipitation')
        // Summing all of the preticipation out of those 5 days
        const sumOfPrecipitation = () => getLatestMeasurementDate().map(data => data.value).reduce((sum, currValue) => currValue + sum, 0)
        // Adding it to the Total precipitation table
        const tr = five_Days_Total_Precipitation.appendChild(document.createElement('tr'))
        tr.insertCell().appendChild(document.createTextNode(getLatestMeasurementDate()[0].place))
        tr.insertCell().appendChild(document.createTextNode(Number(sumOfPrecipitation()).toFixed(2) + " " + getLatestMeasurementDate()[0].unit))
    }
}

const avgWindSpeed = (date) => {
    var place = getSelectedCity.value
    const request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:8080/data/' + place)
    request.send()
    request.onerror = () => {displayError(request.responseText)}
    if (request.status != 200) {
        displayError(request.responseText)
    }
    request.onload = () => {
        clearAvgWindSpeedTable()
        const measurementData = JSON.parse(request.responseText)
        // Getting current date
        var currDate = new Date(date)
        var fiveDaysBefore = new Date(currDate)
        // Setting fiveDaysBefore 5 days before current date
        fiveDaysBefore.setDate( fiveDaysBefore.getDate() - 5)
        // Filtering data so that it would be in between current date and 5 days before current date
        const getLatestMeasurementDate = () => measurementData.filter(data => Date.parse(data.time) <= Date.parse(currDate) && Date.parse(data.time) >= Date.parse(fiveDaysBefore) && data.type === 'wind speed')
        // Getting average wind speed out of those 5 days
        const avgOfWindSpeed = () => getLatestMeasurementDate().map(data => data.value).reduce((sum, currValue) => sum + currValue, 0) / getLatestMeasurementDate().length
        // Adding it to the Average wind speed table
        const tr = five_Days_Avg_Wind_Speed.appendChild(document.createElement('tr'))
        tr.insertCell().appendChild(document.createTextNode(getLatestMeasurementDate()[0].place))
        tr.insertCell().appendChild(document.createTextNode(Number(avgOfWindSpeed()).toFixed(2) + " " + getLatestMeasurementDate()[0].unit))
    }
}

const predictions24hours = () => {
    var convertToProperDate = new Date(getSelectedDateForPredictions.value)
    var forTracking
    var precipitations = ''
    const currDate = new Date(convertToProperDate)
    currDate.setHours(0,0,0,0)
    const next24hours = new Date(currDate)
    const request = new XMLHttpRequest()
    next24hours.setHours(next24hours.getUTCHours() + 24)
    request.open('GET', 'http://localhost:8080/forecast/' + getSelectedCity.value)
    request.send()
    request.onerror = () => {displayError(request.responseText)}
    request.onload = () => {
    if (request.status != 200) {
        displayError(request.responseText)
    }
    const measurementData = JSON.parse(request.responseText)
    clearPredictionTable()
    const getLatestPredictions = () => measurementData.filter(data => Date.parse(data.time) >= Date.parse(currDate) && Date.parse(data.time) <= Date.parse(next24hours))
    let tr = prediction_for_24hours.appendChild(document.createElement('tr'))
    tr.insertCell().appendChild(document.createTextNode(getLatestPredictions()[0].place))
    tr.insertCell().appendChild(document.createTextNode(new Date(getLatestPredictions()[0].time).toLocaleString('da-DK')))
        for(let i = 0; i < getLatestPredictions().length; i++)
        {   
            if(getLatestPredictions()[i].type === 'temperature')
            {        
                forTracking = getLatestPredictions()[i]

                if ( forTracking.type === getLatestPredictions()[i].type && i > 0)
                {
                    tr = prediction_for_24hours.appendChild(document.createElement('tr'))
                    tr.insertCell().appendChild(document.createTextNode(getLatestPredictions()[i].place))
                    tr.insertCell().appendChild(document.createTextNode(new Date(getLatestPredictions()[i].time).toLocaleString('da-DK')))
                }
                tr.insertCell().appendChild(document.createTextNode('From: ' + getLatestPredictions()[i].from + getLatestPredictions()[i].unit + " " + 'To: ' + getLatestPredictions()[i].to + getLatestPredictions()[i].unit))
            }
            else if (getLatestPredictions()[i].type === 'precipitation')
            {
                tr.insertCell().appendChild(document.createTextNode('From: ' + getLatestPredictions()[i].from + getLatestPredictions()[i].unit + " " + 'To: ' + getLatestPredictions()[i].to + getLatestPredictions()[i].unit))
                getLatestPredictions()[i].precipitation_types.forEach(element => precipitations += element + ", ");
                if (precipitations.length > 0){
                    tr.insertCell().appendChild(document.createTextNode(precipitations.slice(0, -2)))
                    precipitations = ''
                }
                else{
                    tr.insertCell().appendChild(document.createTextNode('none'))
                    precipitations = ''
                }
            }
            else if (getLatestPredictions()[i].type === 'wind speed'){
                tr.insertCell().appendChild(document.createTextNode('From: ' + getLatestPredictions()[i].from + getLatestPredictions()[i].unit + " " + 'To: ' + getLatestPredictions()[i].to + getLatestPredictions()[i].unit))
                getLatestPredictions()[i].directions.forEach(element => precipitations += element + ", ");
                tr.insertCell().appendChild(document.createTextNode(precipitations.slice(0, -2)))
                precipitations = ''
            }
            else if (getLatestPredictions()[i].type === 'cloud coverage')
            {
                tr.insertCell().appendChild(document.createTextNode('From: ' + getLatestPredictions()[i].from + getLatestPredictions()[i].unit + " " + 'To: ' + getLatestPredictions()[i].to + getLatestPredictions()[i].unit))
            }
        }
    }
}

function displayError(e) {
    console.log(e)
}
return { getCurrentDateForPredictionsAndHistory, getMeasurementData, minTempFiveDays, updateHistoryFields, refreshAllData, predictions24hours, postData, disableFieldsAccordingToType}
}