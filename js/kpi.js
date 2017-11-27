var app = angular.module('myApp', []);
app.controller('kpiCtrl', function($scope) {
    var filesPath = {
        'Trần Trung Hiếu': 'kpi/Dtag_HieuTT_KPI_2017 - Aug.csv'
    };

    var jsonFromFile = {};

    angular.forEach(filesPath, function (value, uesrName) {
        jsonFromFile[uesrName] = readTextFile(value)
    });

    $scope.users = Object.keys(jsonFromFile);

    setTimeout(function () {
        Highcharts.chart('chart', {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Biểu Đồ KPI D-TAG Việt Nam'
            },
            xAxis: {
                title: {
                    text: 'Tuần'
                },
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Số Card'
                }

            },
            series: _getDataInput()
        });
    }, 0);
    
    function _getDataInput() {
        var data = [];

        angular.forEach(jsonFromFile, function (value, username) {
            var uName = {
                name: username,
                data: []
            };

            angular.forEach(value, function (card) {
                var date = card['"Done Date"'].split('/');
                var newDate = new Date('20'+date[0], date[1], date[2]);

                var getWeek = _getWeek(newDate);

                if(uName.data.length == 0) {
                    uName.data.push([getWeek, 1]);
                } else {
                    if(_hasWeek(uName.data, getWeek)) {
                        angular.forEach(uName.data, function (item) {
                            if(item[0] == getWeek) {
                                item[1] = item[1] + 1
                            }
                        });
                    } else {
                        uName.data.push([getWeek, 1]);
                    }
                }
            });

            console.log(uName);

            data.push(uName);
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