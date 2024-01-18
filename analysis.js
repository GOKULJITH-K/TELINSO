const testsoil = require("../src/index");

const NitrogenValue = testsoil.nitrogenValue;


const  nitrogen1 = NitrogenValue.map(value => parseInt(value, 10));

console.log(nitrogen1);

// find most repeated value of nitrogen using single Hashmap:
     const frequencyMap = {};

    for (const value of nitrogen1) {
        
        if (frequencyMap.hasOwnProperty(value)) {
            frequencyMap[value] = frequencyMap[value] + 1;
        } else {
            frequencyMap[value] = 1;
        }
    }

    
    let maxFrequency = 0;
    let nitrogenValue = null;

    
    for (const [nitrogenVal, frequency] of Object.entries(frequencyMap)) {
        
        if (frequency > maxFrequency) {
            maxFrequency = frequency;
            nitrogenValue = nitrogenVal;
        }
    }

    let nitrogenmsg;
    if (nitrogenValue > 300) {
        nitrogenmsg = `Value is higher than optimum value.`;
    } else if (nitrogenValue < 101) {
        nitrogenmsg = `value is low for field crop and vegetable crop`;
    } else if (nitrogenValue > '201' && nitrogenValue < '300' ) {
        nitrogenmsg = `Value is optimum for vegetable crop`;
    } else if (nitrogenValue > '101' && nitrogenValue < '150'){
        nitrogenmsg = `Value of field crop is optimum 1`;
    } else if(nitrogenValue > '150' && nitrogenValue < '101'){
       nitrogenmsg = `value is lower than optimum value 1.` ;
    } else{
      nitrogenmsg = `value is lower than optimum value 2.`
    }

    function updateSoilData(nitrogenmsg) {
        const dataDiv = document.querySelector('.data');
        
        // Update the content of the .savedata div
        dataDiv.innerHTML = `
            <h3> nitrogen</h3>
            <p>Nitrogen: ${nitrogenmsg}</p>
            
           
        `;
    }
    updateSoilData(nitrogenmsg);
    // Example usage (you should call this function with actual data)
    
    
    
// find most repeated value of phosphorus using single Hashmap:
    const frequencyMap2 = {};

    for (const value of phosphorus) {
        
        if (frequencyMap2.hasOwnProperty(value)) {
            frequencyMap2[value] = frequencyMap2[value] + 1;
        } else {
            frequencyMap2[value] = 1;
        }
    }

    
    let maxFrequency2 = 0;
    let phosphorusValue = null;

    
    for (const [phosphorusVal, frequency] of Object.entries(frequencyMap2)) {
        
        if (frequency > maxFrequency2) {
            maxFrequency2 = frequency;
            phosphorusValue = phosphorusVal;
        }
    }

// find most repeated value of potassium using single Hashmap:
    const frequencyMap3 = {};

    for (const value of potassium) {
        
        if (frequencyMap3.hasOwnProperty(value)) {
            frequencyMap3[value] = frequencyMap3[value] + 1;
        } else {
            frequencyMap3[value] = 1;
        }
    }

    
    let maxFrequency3 = 0;
    let potassiumValue = null;

    
    for (const [potassiumVal, frequency] of Object.entries(frequencyMap3)) {
        
        if (frequency > maxFrequency3) {
            maxFrequency3 = frequency;
            potassiumValue = potassiumVal;
        }
    }

// find most repeated value of ph using single Hashmap:
    const frequencyMap4 = {};

    for (const value of pH) {
        
        if (frequencyMap4.hasOwnProperty(value)) {
            frequencyMap4[value] = frequencyMap4[value] + 1;
        } else {
            frequencyMap4[value] = 1;
        }
    }

    
    let maxFrequency4 = 0;
    let phValue = null;

    
    for (const [phVal, frequency] of Object.entries(frequencyMap4)) {
        
        if (frequency > maxFrequency4) {
            maxFrequency4 = frequency;
            phValue = phVal;
        }
    }

// find most repeated value of temperature using single Hashmap:
    const frequencyMap5 = {};

    for (const value of temperature) {
        
        if (frequencyMap5.hasOwnProperty(value)) {
            frequencyMap5[value] = frequencyMap5[value] + 1;
        } else {
            frequencyMap5[value] = 1;
        }
    }

    
    let maxFrequency5 = 0;
    let temperatureValue = null;

    
    for (const [temperatureVal, frequency] of Object.entries(frequencyMap)) {
        
        if (frequency > maxFrequency5) {
            maxFrequency5 = frequency;
            temperatureValue = temperatureVal;
        }
    }

