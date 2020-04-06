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

  //state 0 when the page is open
  buildMetadata(940);
  buildCharts(940);

//function for updating the web
function optionChanged(newSample) { 
    buildMetadata(newSample);
    buildCharts(newSample);

  }

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {  
      var metadata = data.metadata;  
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);  
       
      var result = resultArray[0];  
      var PANEL = d3.select("#sample-metadata"); 
      PANEL.html(""); 
      
    Object.entries(result).forEach(([key,value]) => { 
    PANEL.append("h6").text(`${key} : ${value}`)
    });
      })};

// function for building the chart
function buildCharts(sample){ 
    
    
       d3.json("samples.json").then((data) => {
        
        //prase data from json file
        var samples = data.samples;
        var filterSamples = samples.filter(kupaObj => kupaObj.id == sample);
        
        //prasing the arrays otu_ids, sample_values, otu_labels
        otuIds = filterSamples[0].otu_ids
        otuValues = filterSamples[0].sample_values
        otuLabels = filterSamples[0].otu_labels
        
        //creating empty lists that will be filled with items from otu_ids, sample_values, otu_labels
        //[(key) name: otu_itd, (value) count: sample_values, (value) labels: otu_labels]   
        var bacteriaList = []
        var bacteriaLabel = []
        
        // forEach function used to extract items from otu_ids, sample_values, otu_labels and put them into empty lists 
        otuIds.forEach((item,index) => {
        bacteriaList[index] = {name: item, count: otuValues[index], label: otuLabels[index] }
        })
        
        bacteriaListCopy = bacteriaList.slice()
        
        //checkup console print
        console.log(`unsorted list:`)
        console.log(bacteriaList[0])
        console.log(`unsorted bacteria set:`)
        console.log(bacteriaLabel[0])
        
        //sorting the data in descending order
        var sortedBacterialList = bacteriaListCopy.sort(function(a,b) {
          return parseFloat(b.count) - parseFloat(a.count)
        });
        
        //selecting top 10 items
        var sortedBacterialList = sortedBacterialList.slice(0,10)
        
        //creating bar chart
        var trace = {
          y: sortedBacterialList.map(row => `OTU  ${row.name}`).reverse(),
          x: sortedBacterialList.map(row => `${row.count}`).reverse(),
          text: sortedBacterialList.map(row => `${row.label}`).reverse(), //here i will put information on bacteria
          name: "Bar_Chart",
          type: "bar",
          orientation: "h"
        };

        var sortedBacterialList = [trace]

        var layout = {
          title: "Bacterial count",
           margin: {
             l: 100,
             r: 100,
             t: 100,
             b: 100
           },
           xaxis: {
            title: {
              text: 'Bacteria Count',
              font: {
                family: 'Courier New, monospace',
                size: 14,
                color: '#7f7f7f'
              }
            }
          }
        };

      Plotly.newPlot("Bar_Chart", sortedBacterialList,layout);

      //creating buble cahrt
      
      var xvalues = []
      var yvalues = []
      var labels = []
      
      bacteriaListCopy.forEach(function(row){
        xvalues.push(row.name)
        yvalues.push(row.count)
        labels.push(row.label)
      });    
        
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
        }
        
      };
      
      var data = [trace1];
      
      var layout1 = {
        title: 'Bacterial distribution',
        showlegend: false,
        height: 500,
        width: 1100,
        plot_bgcolor:"pearl",
        paper_bgcolor:"pearl",
        xaxis: {
          title: {
            text: 'Bacteria ID',
            font: {
              family: 'Courier New, monospace',
              size: 14,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Bacteria Count',
            font: {
              family: 'Courier New, monospace',
              size: 14,
              color: '#7f7f7f'
            }
          }
        }
        
        
      };
      
      Plotly.newPlot('plot', data, layout1);   


    });
};

init();
