(function ($) {
    $.fn.extend( {
        yandexMetrikaChart: function() {
            var $chart = $(this);
            var ctx = $chart.get(0).getContext("2d");
            var $data = $chart.find('.chart-data');
            var $dataItems = $data.find('.chart-data-item');
            var labels = [];
            var data = [];

            $dataItems.each(function() {
                labels.push($(this).data('date'));
                data.push($(this).data('value'));
            });

            var chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Visitors',
                            data: data,
                            backgroundColor: $chart.find('.chart-fillColor').css('color'),
                            borderColor: $chart.find('.chart-strokeColor').css('color'),
                            pointBackgroundColor: $chart.find('.chart-pointColor').css('color'),
                            pointBorderColor: $chart.find('.chart-pointHighlightFill').css('color'),
                            pointHoverBackgroundColor: $chart.find('.chart-pointHighlightFill').css('color'),
                            pointHoverBorderColor: $chart.find('.chart-strokeColor').css('color'),
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: $chart.find('.chart-scaleGridLineColor').css('color')
                            },
                            ticks: {
                                color: $chart.find('.chart-scaleFontColor').css('color')
                            }
                        },
                        x: {
                            grid: {
                                color: $chart.find('.chart-scaleGridLineColor').css('color')
                            },
                            ticks: {
                                color: $chart.find('.chart-scaleFontColor').css('color')
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            var updateChartColors = function(chart) {
                // Update dataset colors
                chart.data.datasets.forEach(function(dataset) {
                    dataset.backgroundColor = $chart.find('.chart-fillColor').css('color');
                    dataset.borderColor = $chart.find('.chart-strokeColor').css('color');
                    dataset.pointBackgroundColor = $chart.find('.chart-pointColor').css('color');
                    dataset.pointBorderColor = $chart.find('.chart-pointHighlightFill').css('color');
                    dataset.pointHoverBackgroundColor = $chart.find('.chart-pointHighlightFill').css('color');
                    dataset.pointHoverBorderColor = $chart.find('.chart-strokeColor').css('color');
                });

                // Update scale colors
                var gridColor = $chart.find('.chart-scaleGridLineColor').css('color');
                var tickColor = $chart.find('.chart-scaleFontColor').css('color');
                
                chart.options.scales.y.grid.color = gridColor;
                chart.options.scales.y.ticks.color = tickColor;
                chart.options.scales.x.grid.color = gridColor;
                chart.options.scales.x.ticks.color = tickColor;

                chart.update();
            };

            $(document).on('theme:changed', function() {
                updateChartColors(chart);
            });
        }
    });
})(jet.jQuery);