const request = require('request')
const dataServer = process.env.DATA_SERVER_URL || "http://localhost:5000";

module.exports.getTests = function(req, res){
    request({
        url: `${dataServer}/tests`,
        method: "GET",
    }, function (err, hrx, body) {
        if (err) {
            console.log("err: ", err)
        }

        let data = JSON.parse(body);
        data.serverUrl = dataServer;

        return res.render("tests", data);
    })
}

module.exports.getSingleNeuronResult = function (req, res) {
    const { testId, layerId, neuronId } = req.params;

    request({
        url: `${dataServer}/tests/${testId}/result/layers/${layerId}/neurons/${neuronId}`,
        method: "GET",
    }, function (err, hrx, body) {
        if (err) {
            console.log("err: ", err)
        }

        let data = JSON.parse(body);

        return res.render("neuronDetail", {
            ...data,
            getColorForPercentage
        });
    })
}

module.exports.getTestResult = function (req, res) {
    const { testId } = req.params;
    request({
        url: `${dataServer}/tests/${testId}`,
        method: "GET",
    }, function (err, hrx, testBody) {
        if (err){

        }
        let test = JSON.parse(testBody);

        request({
            url: `${dataServer}/tests/${testId}/result`,
            method: "GET",
        }, function (err, hrx, resultBody) {
            if (err){
    
            }
            let result = JSON.parse(resultBody);

            request({
                url: `${dataServer}/tests/${testId}/result/layers?type=INPUT`,
                method: "GET",
            }, function (err, hrx, inputLayerBody) {
                if (err){

                }

                let inputLayer = JSON.parse(inputLayerBody).data[0];

                request({
                    url: `${dataServer}/tests/${testId}/result/layers?type=OUTPUT`,
                    method: "GET",
                }, function (err, hrx, outputLayerBody) {
                    if (err){
            
                    }
                    let outputLayer = JSON.parse(outputLayerBody).data[0];
                    
                    request({
                        url: `${dataServer}/tests/${testId}/result/layers`,
                        method: "GET",
                    }, function (err, hrx, layersBody) {
                        if (err){
                
                        }
                        let layers = JSON.parse(layersBody).data;
                        let neuronCount = 0;

                        layers.map(function(l){
                            neuronCount += l.data.nodeCount
                        })


                        let data = {
                            test,
                            result,
                            inputLayer,
                            outputLayer,
                            serverUrl: dataServer,
                            testId,
                            layerCount: layers.length,
                            neuronCount: neuronCount
                        }
                
                        return res.render("testResult", data);
                    })
                })
            }) 
        }) 
    })
}

module.exports.getDatasets = function(req, res){
    request({
        url: `${dataServer}/datasets`,
        method: "GET",
    }, function (err, hrx, datasetBody) {
        if (err){

        }
        let datasets = JSON.parse(datasetBody)
        

        const data = {
            datasets: datasets.data,
            serverUrl: dataServer
        }
            
        return res.render("datasets", data);
    })
}

module.exports.getDataset = function(req, res){
    request({
        url: `${dataServer}/datasets/${req.params.datasetId}`,
        method: "GET",
    }, function (err, hrx, datasetBody) {
        if (err){

        }
        let dataset = JSON.parse(datasetBody)
        

        request({
            url: `${dataServer}/datasets/${req.params.datasetId}/items`,
            method: "GET",
        }, function (err, hrx, datasetItemsBody) {
            if (err){
    
            }
            let datasetItems = JSON.parse(datasetItemsBody)

            const data = {
                dataset: dataset,
                items: datasetItems,
                serverUrl: dataServer
            }
                
            return res.render("datasetDetails", data);
        })
    })
}

module.exports.getLayer = function(req, res){
    const { layerId, testId } = req.params;
    request({
        url: `${dataServer}/tests/${testId}/result/layers/${layerId}`,
        method: "GET",
    }, function (err, hrx, body) {
        if (err){

        }
        let data = JSON.parse(body)
            
        return res.render("layerDetail", {
            ...data,
            serverUrl: dataServer,
            testId
        });
    })
}

var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
};