function buildPage() {
  d3.json("./data/samples.json").then(function(data) {
    console.log(data);

    //Set dropdown values for "Test Subject ID No"
    var names = data.names.map(name => name);
    console.log(names)
    
    names.forEach(function(AddOption) {
    var select = d3.select("#selDataset")
    select
      .append("option")
      .text(AddOption)
      .property("value", AddOption)
    });


    //Demographic Info
    var firstDemographic = data.metadata[0];
      console.log(firstDemographic)

      Object.entries(firstDemographic).forEach(function ([key, value]) {
        var Demographics = d3.select("#sample-metadata");
        Demographics.append("p").text(`${key}: ${value}`)
      })
  
    
    //Initial Bar Chart
    var sample_valuesTop10 = data.samples[0].sample_values.slice(0, 10);
    var otu_idsTop10 = data.samples[0].otu_ids.slice(0, 10);
    var otu_idsTop10string = otu_idsTop10.map(function(id){return "OTU" + " " + id});
    var otu_labelsTop10 = data.samples[0].otu_labels.slice(0, 10);

    console.log(sample_valuesTop10);
    console.log(otu_idsTop10string);
    console.log(otu_labelsTop10);

    var bardata = [{
      x: sample_valuesTop10,
      y: otu_idsTop10string,
      text: otu_labelsTop10,
      type: "bar",
      orientation:'h'
    }];

    Plotly.newPlot("bar", bardata);


    //Initial Guage chart
    var wfreq = data.metadata[0].wfreq

    var gaugedata = [{
		  value: wfreq,
		  title: { text: "Belly Button Washing Frequency" },
		  type: "indicator",
		  mode: "gauge+number"
    }];
    
    Plotly.newPlot('gauge', gaugedata);


    //Initial Bubble Chart
    var sample_values = data.samples[0].sample_values;
    var otu_ids = data.samples[0].otu_ids;
    var otu_labels = data.samples[0].otu_labels;

    console.log(sample_values);
    console.log(otu_ids);
    console.log(otu_labels);

    var bubbledata = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {size: sample_values, 
        color: otu_ids},
      text: otu_ids,
      type: 'scatter'
      
    }]; 

    Plotly.newPlot("bubble", bubbledata);


    //Change charts when new test subject ID is selected
    d3.select("#selDataset").on("change", optionChanged);

    function optionChanged() {
      var dropdownMenu = d3.select("#selDataset").node();
      var dropdownValue = dropdownMenu.value;
      
      console.log(dropdownValue)

      var sampleData = data.samples.map(sample => sample);
      console.log(sampleData)

      Object.entries(sampleData).forEach(function ([key, value]) {
        var id = value.id;

        var x = [];
        var y= [];
        var text= [];
        var values= [];

        if (dropdownValue == id) {

          var otu_ids = value.otu_ids;
          var otu_labels = value.otu_labels;
          var sample_valuesTop10 = value.sample_values.slice(0, 10);
          var otu_idsTop10 = value.otu_ids.slice(0, 10);
          var otu_idsTop10string = otu_idsTop10.map(function(id){return "OTU" + " " + id});
          var otu_labelsTop10 = value.otu_labels.slice(0, 10);
      
          console.log(otu_ids);
          console.log(otu_labels);
          console.log(sample_valuesTop10);
          console.log(otu_idsTop10string);
          console.log(otu_labelsTop10);
          

          //New Demographic info
          var Demographics = d3.select("#sample-metadata");
          Demographics.html("");

          data.metadata.map((demo) => {
            var demoId = demo.id

            console.log(demoId)
            console.log(dropdownValue)
            
            if (dropdownValue == demoId) {
              Object.entries(demo).forEach(function ([key, value]) {
                Demographics.append("p").text(`${key}: ${value}`)
                if (key == "wfreq") {

                  //New Guage chart info
                  const wfreq = value
                  console.log(wfreq)
                  values= wfreq;
                  Plotly.restyle("gauge", "value", [values]);

                }
              })
            }
        })
          

          //New bar chart info
          x = sample_valuesTop10;
          y = otu_idsTop10string;
          text= otu_labelsTop10;
      
          Plotly.restyle("bar", "x", [x]);
          Plotly.restyle("bar", "y", [y]);
          Plotly.restyle("bar", "text", [text]);


          //New bubble chart info
          x= otu_ids;
          y= sample_values;
          size= sample_values;
          text= otu_labels
    
          Plotly.restyle("bubble", "x", [x]);
          Plotly.restyle("bubble", "y", [y]);
          Plotly.restyle("bubble", "size", [size]);
          Plotly.restyle("bubble", "text", [text]);   
        }    
   })
      
  }
});
};

buildPage();

