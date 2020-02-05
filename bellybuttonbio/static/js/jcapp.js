console.log("hello app!");

var snames = [];
var smetadata = [];
var samples = [];

// build select options
function buildSelect() {
    console.log("buldSelect()")
    var select = d3.select("#selDataset");
    // console.log("snames: ", snames);
    snames.forEach(name => {
        // console.log(name);
        var option = select.append("option").text(name);
        option.attr("value", name);

    })

}

// Select onchange element handler
// https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_onchange
function optionChanged() {
    // Prevent the page from refreshing
    //d3.event.preventDefault();
  
    // Select the input value from the form
    var subject = d3.select("#selDataset").property("value")
    console.log("selected subject: ", subject);
    
    // Build the plots with the new subject id selection
    buildPlots(subject);
}

function buildPlots(subject) {
    console.log("buildPlots")
    buildDemographics(subject);
    buildOTU_BarPlot(subject);
    buildBubblePlot(subject);
    buildWashGuage(subject);
}

function buildDemographics(id) {
    console.log("buildDemographics()");

    // filter meta data by subject id
    console.log("id: ", id);
    var filtered = smetadata.filter(subject => parseInt(subject.id) === parseInt(id));
    
    console.log("filtered: ", filtered);
    // var filtered = smetadata.filter(subject => {
    //     console.log(`id: [${id}], subject id: [${subject.id}]`);
    //     console.log(parseInt(subject.id) === parseInt(id));
    //     return (parseInt(subject.id) === parseInt(id));
    // });

    // select and fill the metadata panel with demographics
    var panel = d3.select("#sample-metadata")
    // clear the body of the panel
    panel.html("");
    // fill the body of the panel with meta-data for the subject id
    Object.entries(filtered[0]).forEach(([key, value]) => {
        console.log(`${key}: ${value}`)
        panel.append("p").text(`${key}: ${value}`);
    });

}

function buildOTU_BarPlot(id) {
    console.log("buildOTUBar()");

    // filter by the subject id
    console.log("id: ", id);
    var filtered = samples.filter(subject => parseInt(subject.id) === parseInt(id));
    var otuSamples = []
    // assume that the sample data is sorted by vlaues
    // otherwise build otu object array by combining 3 arrays from fitlered sample 
    otus = filtered[0];
    console.log("OTU Object", otus);
    for(i=0; i < otus.otu_ids.length; i++) {
        var otuObj =  
            {
                "otu_id" : otus.otu_ids[i], 
                "sample" : otus.sample_values[i],
                "label" : otus.otu_labels[i] 
            }
        otuSamples.push(otuObj);
    };
    console.log("otuSamples: ", otuSamples);

    // sort otu objet array
    otuSamples.sort((a,b) => b.sample - a.sample);
    console.log("sorted otuSamples: ", otuSamples);

    // slice first 10 otu object array
    slicedData = otuSamples.slice(0, 10);
    console.log("sliced otu's: ", slicedData);
    // Reverse the array to accommodate Plotly's defaults
    reversedData = slicedData.reverse();

    // creat otu box-h trace
    var trace1 = {
        x: reversedData.map(otu => otu.sample),
        y: reversedData.map(otu => `OTU ${otu.otu_id}`),
        text: reversedData.map(otu => otu.label),
        name: "OTU",
        type: "bar",
        orientation: "h"
    };

    // data
    var data = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
        title: `Top 10 OTU Samples for Subject: ${id}`,
        // margin: {
        //     l: 100,
        //     r: 100,
        //     t: 100,
        //     b: 100
        // }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", data, layout);
}

function buildBubblePlot(id) {
    console.log("buildBubblePlot()");
}

function buildWashGuage(id) {
    console.log("buildWashGuage()");  
}

//read json data
d3.json("data/samples.json").then((sdata) => {
    console.log("Reading samples.json");
    console.log(sdata);

    // parse json data into parts
    // parse names and build the select options
    snames = sdata.names;
    console.log("names: ", snames);
    buildSelect();
 
    // parse metadata
    smetadata = sdata.metadata;
    console.log("metadata: ", smetadata);

    // parse sample 
    samples = sdata.samples;
    console.log("samples: ", samples);



    //  Create the Traces

});





console.log("goodbye app!")