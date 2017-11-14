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
                type: 'column'
            },
            title: {
                text: 'Biểu Đồ KPI D-TAG Việt Nam'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Trung Bình Card làm mỗi tuần'
                }

            },
            series: [{
                name: 'Trung Bình',
                colorByPoint: true,
                data: _getDataInput()
            }]
        });
    }, 0);
    
    function _getDataInput() {
        var data = [];

        angular.forEach(jsonFromFile, function (value, username) {
            var startDate = value[0]['"Done Date"'];
            var endDate   = value[value.length - 1]['"Done Date"'];

            var dates2 = startDate.split('/');
            var dates = endDate.split('/');

            var seconds = (Date.UTC(dates[2], dates[0], dates[1]) - Date.UTC(dates2[2], dates2[0], dates2[1])) / 1000;

            var totalDate = Math.round(seconds / (24 * 60 * 60 * 365));

            var medium7Day = (totalDate / (value.length)) * 7;

          data.push({
              name: username,
              y: medium7Day
          })
        });

        return data
    }
});