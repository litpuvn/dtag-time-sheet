var app = angular.module('myApp', []);
app.controller('kpiCtrl', function($scope, $filter) {
    var filesPath = {
        'Trần Trung Hiếu': 'kpi/Dtag_HieuTT_KPI_2017 - Aug.csv'
    };

    var jsonFromFile = {};
    $scope.totalCard = 0;
    $scope.totalDoneCard = 0;
    $scope.totalOverCard = 0;

    angular.forEach(filesPath, function (value, uesrName) {
        jsonFromFile[uesrName] = readTextFile(value);
        $scope.totalCard = jsonFromFile[uesrName].length;
        $scope.totalDoneCard = $filter('filter')(jsonFromFile[uesrName], function (item) {
            return item['"Status"'] != 'OVER'
        }).length;

        $scope.totalOverCard = $filter('filter')(jsonFromFile[uesrName], function (item) {
            return item['"Status"'] == 'OVER'
        }).length;
    });

    $scope.users = Object.keys(jsonFromFile);

    setTimeout(function () {
        Highcharts.chart('chart', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Biểu Đồ KPI D-TAG Việt Nam'
            },
            xAxis: {
                title: {
                    text: 'Tuần'
                },
                categories: _getCategories()
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Tổng số card'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: _getDataInput()
        });
    }, 0);

    function _getCategories() {
        var data = [];

        angular.forEach(jsonFromFile, function (value, username) {
            angular.forEach(value, function (card) {
                var date = card['"Done Date"'].split('/');
                var newDate = new Date('20'+date[0], date[1], date[2]);

                var getWeek = _getWeek(newDate);

                if(data.indexOf(getWeek) == -1) {
                    data.push(getWeek);
                }
            });
        });

        return data
    }

    function _getDataInput() {
        var data = [];

        angular.forEach(jsonFromFile, function (value, username) {
            var done = {
                name: 'DONE',
                data: [],
                color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, 'green']
                    ]
                }
            };

            var over = {
                name: 'OVER',
                data: [],
                color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, 'red']
                    ]
                }
            };

            angular.forEach(_getCategories(), function (week) {
                done.data.push(0);
                over.data.push(0)
            });

            angular.forEach(value, function (card) {
                var date = card['"Done Date"'].split('/');
                var newDate = new Date('20'+date[0], date[1], date[2]);
                var getWeek = _getWeek(newDate);

                var status = card['"Status"'];

                if(status == 'OVER') {
                    over.data[_getCategories().indexOf(getWeek)] = over.data[_getCategories().indexOf(getWeek)] + 1
                } else {
                    done.data[_getCategories().indexOf(getWeek)] = done.data[_getCategories().indexOf(getWeek)] + 1
                }

            });

            data.push(done, over);
        });

        return data
    }

    function _hasWeek(data, week) {
        for(var i in data) {
            var item = data[i];

            if(item[0] == week) {
                return true
            }
        }

        return false
    }

    function _getWeek(target) {
        var dayNr = (target.getDay() + 6) % 7;
        var firstThursday = target.valueOf();

        target.setDate(target.getDate() - dayNr + 3);
        target.setMonth(0, 1);

        if (target.getDay() != 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }

        return 1 + Math.ceil((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
    }
});