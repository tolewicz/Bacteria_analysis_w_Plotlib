function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })};

//function for updating the web
function optionChanged(newSample) { //"this.value" form HTML is "newSample" in optionChanged()
    // console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);

  }

//function for extracting the data from the array, filtering based on outcome (sample) from fn inint()
// and supplying that data to built panel w. key an values of the sample array
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => { //entire dataset is pulled from json and referred as 'data'
      var metadata = data.metadata; //prase metadata (part of the dataset, "data" )
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample); //filtering meta data based on "id", metadata has it, we get array
      // console.log(`this is the sample array: ${resultArray}`)
      // console.log(resultArray)
      var result = resultArray[0]; //taking 1st returned array from metadata (only one left since id's are unique)
      var PANEL = d3.select("#sample-metadata"); //peasing PANEL variable as HTML id: sample-metadata
      PANEL.html(""); //clearing pannel in html before putting data
     
     //Filling  panel w. data (key and value)
    Object.entries(result).forEach(([key,value]) => { 
    PANEL.append("h6").text(`${key} : ${value}`)
    });
      })};

function buildCharts(sample){ 
    
    // console.log(`this is sample: ${sample}`)
    d3.json("samples.json").then((data) => {
        
        var samples = data.samples;
        var filterSamples = samples.filter(kupaObj => kupaObj.id == sample);
        // console.log(`this are samples: ${filterSamples}`)
        otuIds = filterSamples[0].otu_ids
        otuValues = filterSamples[0].sample_values
        otuLabels = filterSamples[0].otu_labels
        //otuValues = otuValues.sort(function(a, b) {return b - a});

        // console.log(otuIds)
        // console.log(otuValues)     
        // console.log(otuLabels) 
      
        
        //arranging bacterias into key value pair, no need
        var bacteriaList = []
        var bacteriaLabel = []

        otuIds.forEach((item,index) => {
          //console.log(`otu index and id ${index} , ${item} `)
          //console.log(`otu value ${otuValues[index]}`)
          //console.log(`otu value ${otuLabels[index]}`)
          bacteriaList[index] = {name: item, count: otuValues[index], label: otuLabels[index] }
          
        
        })
        
        bacteriaListCopy = bacteriaList.slice()

        console.log(`unsorted list:`)
        console.log(bacteriaList[0])
        console.log(`unsorted bacteria set:`)
        console.log(bacteriaLabel[0])

        var sortedBacterialList = bacteriaListCopy.sort(function(a,b) {
          return parseFloat(b.count) - parseFloat(a.count)
        });

        var sortedBacterialList = sortedBacterialList.slice(0,10)

        // console.log(`sorted list:`)
        // console.log(sortedBacterialList)

        var trace = {
          y: sortedBacterialList.map(row => `OTU  ${row.name}`).reverse(),
          x: sortedBacterialList.map(row => `${row.count}`).reverse(),
          text: sortedBacterialList.map(row => `${row.label}`).reverse(), //here i will put information on bacteria
          name: "Bar_Chart",
          type: "bar",
          orientation: "h"
        };

        var sortedBacterialList = [trace]

        console.log(sortedBacterialList)

        var layout = {
          title: "Bacterial count",
           margin: {
             l: 100,
             r: 100,
             t: 100,
             b: 100
           }
        };

      Plotly.newPlot("Bar_Chart", sortedBacterialList,layout);

      //buble cahrt
      
      var xvalues = []
      var yvalues = []
      var labels = []
      bacteriaListCopy.forEach(function(row){
        xvalues.push(row.name)
        yvalues.push(row.count)
        labels.push(row.label)
      });
            
      //bacteriaListCopy.forEach(row => xvalues.push(row.name))
      // console.log(`values: x[${xvalues}]`)
      // console.log(`values: y[${yvalues}]`)
      console.log(labels)

      
        
      var trace1 = {
        x: xvalues,
        y: yvalues,
        text: labels,
        mode: 'markers',
        marker: {
          size: yvalues,
          color: xvalues,
          colorscale: 'Earth',
          sizeref: 3
        
          
          // colorbar={title='Colorbar'},
           
        }
      };
      
      var data = [trace1];
      
      var layout1 = {
        title: 'Bacterial distribution',
        showlegend: false,
        height: 600,
        width: 1200,
        
      };
      
      Plotly.newPlot('plot', data, layout1);   

    });
};

init();

  //The JavaScript keyword "this" is used to access the object in question. 
  //In the context of an event, it refers to the HTML element that received the event. 
  //In this case, this refers to the dropdown menu.
  //to iterate over the key and values of the object we use Object.entries(), and we get the array of key,value 