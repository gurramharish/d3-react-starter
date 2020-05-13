import moment from 'moment';
import Chart from "chart.js";

Chart.defaults.NegativeTransparentLine = Chart.helpers.clone(Chart.defaults.line);
Chart.controllers.NegativeTransparentLine = Chart.controllers.line.extend({
    update: function () {
        var min = Math.min.apply(null, this.chart.data.datasets[0].data);
        var max = Math.max.apply(null, this.chart.data.datasets[0].data);
        var yScale = this.getScaleForId(this.getDataset().yAxisID);
        var top = yScale.getPixelForValue(max);
        var zero = yScale.getPixelForValue(0);
        var bottom = yScale.getPixelForValue(min);
        var ctx = this.chart.chart.ctx;
        var gradient = ctx.createLinearGradient(0, top, 0, bottom);
        var ratio = Math.min((zero - top) / (bottom - top), 1);
        if (ratio > 0 && ratio < 1) {
            gradient.addColorStop(0, 'rgb(4, 201, 4, 0.8)');
            gradient.addColorStop(ratio, 'rgb(4, 201, 4, 0.8)');
            gradient.addColorStop(ratio, 'rgb(227, 5, 5, 0.8)');
            gradient.addColorStop(1, 'rgb(227, 5, 5, 0.8)');
            this.chart.data.datasets[0].backgroundColor = gradient;
        } else if (ratio < 0) {
            this.chart.data.datasets[0].backgroundColor = 'rgb(227, 5, 5, 0.8)';
        } else if (ratio >= 1) {
            this.chart.data.datasets[0].backgroundColor = 'rgb(4, 201, 4, 0.8)';
        }
        return Chart.controllers.line.prototype.update.apply(this, arguments);
    }
});

const options = {
    legend: {
        display: false
    },
    maintainAspectRatio: false,
    spanGaps: false,
    elements: {
        line: {
            tension: 0.000001
        }
    },
    plugins: {
        filler: {
            propagate: false
        }
    },
    scales: {
        xAxes: [{
            ticks: {
                autoSkip: false,
                maxRotation: 0
            }
        }],
        yAxes: [{
            ticks: {
                callback: function (value, index, values) {
                    return value.toLocaleString();
                }
            }
        }]
    },
    tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                var label = tooltipItem.yLabel > 0 ? 'Long' : 'Short';

                if (label) {
                    label += ': ';
                }
                label += tooltipItem.yLabel.toLocaleString();
                return label;
            }
        }
    }
};

function round(number, nearestToNext) {
    const round = Math.round(number / nearestToNext) * nearestToNext;
    if (number <= round) {
        return round;
    } else {
        return round + nearestToNext;
    }
}

function roundToNearest(number) {
    let numText = number + '';
    const length = numText.length;
    let rounded = 0;
    if (length < 2) {
        return 100;
    }
    switch (length) {
        case 3:
            rounded = 1000;
            break;
        case 4:
            rounded = round(number, 1000);
            break;
        case 5:
            rounded = round(number, 10000);
            break;
        case 6:
            rounded = round(number, 50000);
            if (rounded > 250000) {
                rounded = round(number, 100000);
            }
            break;
        case 7:
            rounded = round(number, 1000000);
            break;
        case 8:
            rounded = round(number, 10000000);
            break;
        default:
            rounded = 100000000;
    }
    return rounded;
}

function getMinAndMaxValues(quantities) {
    let max = Math.max(...quantities);
    let min = Math.min(...quantities);
    min = min < 0 ? -min : min;
    max = max < 0 ? -max : max;
    let value = 0;
    if (min <= max) {
        value = roundToNearest(max);
    } else {
        value = roundToNearest(min);
    }

    return [-value, value];
}

export function compareByTime(t1, t2) {
    let t1date = new Date(t1.timeStamp);
    let t1Time = moment(t1date).utcOffset("0500").toDate();
    let t2date = new Date(t2.timeStamp);
    let t2Time = moment(t2date).utcOffset("0500").toDate();
    if (t1Time < t2Time) {
        return -1;
    } else if (t1Time > t2Time) {
        return 1;
    } else {
        return 0;
    }
}

export function generateChart(chartRef, trades, userName) {
    if (trades && trades.length > 0) {
        let currentDate = new Date();
        let currentTime = moment(currentDate).utcOffset("0500").toDate();
        const tradesChartRef = chartRef.current.getContext("2d");
        let filteredTrades = trades.filter(trade => {
            let t1date = new Date(trade.timeStamp);
            let t1Time = moment(t1date).utcOffset("0500").toDate();
            return t1Time <= currentTime;
        });

        filteredTrades.sort(compareByTime);
        const data = filteredTrades.map(trade => {
            if (trade.seller === userName) {
                return -trade.shareQty;
            } else {
                return trade.shareQty;
            }
        });

        const labels = filteredTrades.map(trade => {
            let date = new Date(trade.timeStamp);
            let estTime = moment(date).utcOffset("0500").toDate();
            return estTime;
        });

        let actualData = [];
        let actualLabels = [];
        let min = -100000;
        let max = 100000;
        let dateStr = currentDate.toISOString().split('T').shift();
        const d1 = new Date(dateStr + "T" + "12:00:00.000Z");
        const d2 = new Date(dateStr + "T" + "22:00:00.000Z");
        const minTime = moment(d1).utcOffset("0500").toDate();
        const maxTime = moment(d2).utcOffset("0500").toDate();
        const dateObj = filteredTrades[0] && filteredTrades[0].timeStamp;
        if (dateObj) {
            dateStr = dateObj.split('T').shift();
            let dummyLabels = [];
            let i = 12;
            let dummyDate;
            let dDT;
            for (let x = 15; x <= 60;) {
                if (x == 60) {
                    i++;
                    x = "00";
                }
                let dStr = `${dateStr}T${i}:${x}:00.000Z`;
                dummyDate = new Date(dStr);
                dDT = moment(dummyDate).utcOffset("0500").toDate();
                dummyLabels.push(dDT);
                x = +x + 15;
                if (i == 22) {
                    break;
                }
            }
            let actualIndex = 0;
            let n = 0;
            for (let j = 0; j < dummyLabels.length; j++) {
                let net = 0;
                let dataExists = false;
                while (dummyLabels[j] > labels[n]) {
                    net += +data[n];
                    n++;
                    dataExists = true;
                }
                if (dataExists) {
                    actualData[actualIndex] = net;
                    actualLabels[actualIndex] = dummyLabels[j];
                    actualIndex++;
                }
            }
            const minMax = getMinAndMaxValues(actualData);
            min = minMax[0];
            max = minMax[1];
        }
        new Chart(tradesChartRef, {
            type: actualData.length > 0 ? 'NegativeTransparentLine' : 'line',
            data: {
                labels: actualLabels,
                datasets: [
                    {
                        yAxisID: 'y-axis-0',
                        label: "Quantity",
                        data: actualData
                    }
                ]
            },
            options: Chart.helpers.merge(options, {
                elements: {
                    point: {
                        radius: 1
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: min,
                            max: max
                        }
                    }],
                    xAxes: [{
                        type: "time",
                        time: {
                            unit: 'hour',
                            unitStepSize: 0.5,
                            round: 'millisecond',
                            tooltipFormat: "h:mm:ss A",
                            displayFormats: {
                                hour: 'h:mm A'
                            },
                            min: minTime,
                            max: maxTime
                        }
                    }]
                }
            })
        });
    }

}