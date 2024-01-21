// Assume this code is part of a function
let selectioncrop; // Declare selectioncrop

document.getElementById('Form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting and reloading the page

    // Get values from input and select
    const crop1 = document.querySelector('.crop-input').value;
    const crop2 = document.querySelector('.selection-btn').value;

    let nitrogen, phosphorus, potassium, pH, temperature;

    if (crop1 === "rice" || crop2 === "rice") {
        nitrogen = '120';
        phosphorus = '60';
        potassium = '60';
        pH = '6.6';
        temperature = '27';
    }

    
switch(crop){

    case "rice":
        if (nitrogen == 120 && phosphorus == 60 && potassium == 60 && temperature == 27 && pH == 6.5)
        {
            selectioncrop = ` Discover the ideal conditions for rice cultivation with Telinso. Our soil analysis reveals optimum nitrogen, phosphorus, potassium, pH, and temperature levels. Tailored recommendations ensure your rice crops thrive, maximizing yield. Trust Telinso to guide you, 
            making each cultivation decision a step towards a successful and abundant harvest.`;
        }
        else if (nitrogen > 120 && phosphorus > 60 && potassium > 60 && temperature > 27 && pH > 6.5)
        {
            selectioncrop = `Telinso's thorough soil analysis indicates elevated levels of nitrogen, phosphorus, potassium, pH, and temperature—beyond optimal ranges for rice cultivation. We advise against rice 
            cultivation based on these findings, ensuring informed decisions for sustainable and successful farming practices.`;
        }
        else if (nitrogen > 120 && phosphorus > 60 && potassium > 60 && temperature > 27 && pH > 6.5)
        {
            selectioncrop = `Telinso's meticulous soil analysis reveals that nitrogen, phosphorus, potassium, pH, and temperature levels are below
             the optimal range for successful rice cultivation. Based on these findings, we recommend against rice cultivation to ensure informed 
             decisions aligned with your soil's current conditions.`;
        }
        else{
            selectioncrop =`While some parameters meet ideal values for rice cultivation, others fall short. This suggests potential productivity,
             but we recommend further analysis using Telinso's analytics feature. Explore additional insights to make informed decisions and optimize 
             the conditions for a more successful rice cultivation.`;
        }
        break;

    case "wheat" :
        break;
    case "sugarcane":
        break
}


    // Update the DOM with the result
    document.querySelector('.data').innerHTML = `
    <h3> Crop Selection</h3>
    <div class="data">
    <p>${selectioncrop}</p>
    </div>`;

    var xValues = ["nitrogen", "phosphorus", "potassium", "pH", "temperature"];
    var yValues = [nitrogen, phosphorus, potassium, pH, temperature];
    var barColors = ["red", "green", "blue", "orange", "brown"];

    new Chart("barChart", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Visualization of Soil Sample - Bar Graph"
            }
        });
});



