
import React, { Component } from 'react'
import Chart from "chart.js";
import classes from "./LineGraph.module.css";
import moment from 'moment';

export default class LineGraph extends Component {


    chartRef = React.createRef();

    chartData = {
        "345370860": [
            {
                "tradeID": "1019",
                "buyer": " - ",
                "seller": "Alpha Financial Group",
                "cusip": "345370860",
                "shareQty": "10",
                "unitPrice": "10",
                "amount": "100",
                "timeStamp": "2020-05-04T07:50:35Z"
            }
        ],
        "037833100": [
            {
                "tradeID": "1016",
                "buyer": "Alpha Financial Group",
                "seller": " - ",
                "cusip": "037833100",
                "shareQty": "1000",
                "unitPrice": "50",
                "amount": "50000",
                "timeStamp": "2020-05-03T02:29:39Z"
            },
            {
                "tradeID": "1024",
                "buyer": " - ",
                "seller": "Alpha Financial Group",
                "cusip": "037833100",
                "shareQty": "20",
                "unitPrice": "10",
                "amount": "200",
                "timeStamp": "2020-05-04T14:17:41Z"
            },
            {
                "tradeID": "1025",
                "buyer": "Alpha Financial Group",
                "seller": " - ",
                "cusip": "037833100",
                "shareQty": "30",
                "unitPrice": "20",
                "amount": "600",
                "timeStamp": "2020-05-04T14:19:58Z"
            },
            {
                "tradeID": "1026",
                "buyer": "Alpha Financial Group",
                "seller": " - ",
                "cusip": "037833100",
                "shareQty": "30",
                "unitPrice": "20",
                "amount": "600",
                "timeStamp": "2020-05-04T14:20:32Z"
            }
        ],
        "027079K107": [
            {
                "tradeID": "1017",
                "buyer": " - ",
                "seller": "Alpha Financial Group",
                "cusip": "027079K107",
                "shareQty": "100",
                "unitPrice": "20",
                "amount": "2000",
                "timeStamp": "2020-05-04T02:43:41Z"
            },
            {
                "tradeID": "1020",
                "buyer": " - ",
                "seller": "Alpha Financial Group",
                "cusip": "027079K107",
                "shareQty": "20",
                "unitPrice": "10",
                "amount": "200",
                "timeStamp": "2020-05-04T13:30:49Z"
            },
            {
                "tradeID": "1021",
                "buyer": "Alpha Financial Group",
                "seller": " - ",
                "cusip": "027079K107",
                "shareQty": "10",
                "unitPrice": "10",
                "amount": "100",
                "timeStamp": "2020-05-04T13:44:20Z"
            },
            {
                "tradeID": "1021",
                "buyer": " - ",
                "seller": "Alpha Financial Group",
                "cusip": "027079K107",
                "shareQty": "10",
                "unitPrice": "10",
                "amount": "100",
                "timeStamp": "2020-05-04T13:44:20Z"
            },
            {
                "tradeID": "1022",
                "buyer": " - ",
                "seller": "Alpha Financial Group",
                "cusip": "027079K107",
                "shareQty": "10",
                "unitPrice": "10",
                "amount": "100",
                "timeStamp": "2020-05-04T13:45:20Z"
            },
            {
                "tradeID": "1023",
                "buyer": " - ",
                "seller": "Alpha Financial Group",
                "cusip": "027079K107",
                "shareQty": "10",
                "unitPrice": "10",
                "amount": "100",
                "timeStamp": "2020-05-04T14:00:59Z"
            },
            {
                "tradeID": "1027",
                "buyer": "Alpha Financial Group",
                "seller": " - ",
                "cusip": "027079K107",
                "shareQty": "30",
                "unitPrice": "10",
                "amount": "300",
                "timeStamp": "2020-05-04T15:16:42Z"
            },
            {
                "tradeID": "1028",
                "buyer": "Alpha Financial Group",
                "seller": " - ",
                "cusip": "027079K107",
                "shareQty": "200",
                "unitPrice": "12",
                "amount": "2400",
                "timeStamp": "2020-05-04T15:30:42Z"
            }
        ],
        "17275R102": [
            {
                "tradeID": "1018",
                "buyer": " - ",
                "seller": "Alpha Financial Group",
                "cusip": "17275R102",
                "shareQty": "10",
                "unitPrice": "20",
                "amount": "200",
                "timeStamp": "2020-05-04T07:49:39Z"
            }
        ]
    };

    options = {
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

    componentDidMount() {
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
        const myChartRef = this.chartRef.current.getContext("2d");
        const xLabels = [];
        for (let i = 0; i < 4; i++) {
            let date = new Date(`2020-05-11T0${i + 1}:30:08Z`);
            let estTime = moment(date).utcOffset("0500").toDate();
            xLabels.push(estTime);
        }
        new Chart(myChartRef, {
            type: "NegativeTransparentLine",
            data: {
                //Bring in data
                labels: xLabels,
                datasets: [
                    {
                        //borderColor: 'rgb(255, 99, 132)',
                        yAxisID: 'y-axis-0',
                        label: "Quantity",
                        data: [86, 67, 91, -100]
                    }
                ]
            },
            options: Chart.helpers.merge(this.options, {
                // title: {
                //     text: 'fill: origin',
                //     display: true
                // }
                scales: {
                    yAxes: [{
                        ticks: {
                            min: -200,
                            max: 200
                        }
                    }],
                    xAxes: [{
                        type: "time",
                        bounds: "ticks",
                        time: {
                            unit: 'hour',
                            unitStepSize: 1,
                            round: 'millisecond',
                            tooltipFormat: "h:mm:ss A",
                            displayFormats: {
                                hour: 'h:mm A'
                            }
                        }
                    }]
                }
            })
        });
    }
    render() {
        return (
            <div className={classes.graphContainer}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}