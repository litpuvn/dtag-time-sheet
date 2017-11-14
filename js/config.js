var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    var filesPath = ['data/xuatluoi_sep.csv'];
    var jsonFromFile = [];

    angular.forEach(filesPath, function (file) {
        jsonFromFile = jsonFromFile.concat(readTextFile(file))
    });

    $scope.users = [];

    angular.forEach(angular.copy(jsonFromFile), function (item) {
        if(!!item['Mã N.Viên'] && $scope.users.indexOf(item['Mã N.Viên']) == -1 && item['Mã N.Viên'] != '') {
            $scope.users.push(item['Mã N.Viên']);
        }
    });

    $scope.getName = function (user) {
        for(var i in jsonFromFile) {
            var item = jsonFromFile[i];

            if(!!item['Mã N.Viên'] && item['Mã N.Viên'] == user) {
                return item['Tên nhân viên']
            }
        }
    };

    setTimeout(function () {
        angular.forEach($scope.users, function (item) {
            var dataInput = _getDataInput(item);
            var dataOutput = _getDataOutput(item);

            Highcharts.chart(item, {
                chart: {
                    type: 'spline'
                },
                title: {
                    text: 'Biểu Đồ Chấm công D-TAG Việt Nam'
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Ngày'
                    }
                },
                yAxis: {
                    type: 'datetime',
                    tickInterval: 3600*500,
                    title: {
                        text: 'Giờ (H)'
                    },
                    min: 18200000
                },
                series: [{
                    name: 'Giờ vào',
                    color: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#0066FF']
                        ]
                    },
                    dataLabels: {
                        enabled: true,
                        formatter:function() {
                            return Highcharts.dateFormat('%H:%M',this.y);
                        },
                        style:{color:"black"}
                    },
                    data: dataInput
                }, {
                    name: 'Giờ ra',
                    color: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, 'red']
                        ]
                    },
                    dataLabels: {
                        enabled: true,
                        formatter:function() {
                            return Highcharts.dateFormat('%H:%M',this.y);
                        },
                        style:{color:"black"}
                    },
                    data: dataOutput
                }]
            });
        });
    }, 0);
    
    function _getDataInput(userID) {
        var data = [];
        
        angular.forEach(jsonFromFile, function (item) {
            if(!!item['Mã N.Viên'] && item['Mã N.Viên'] == userID && item['Mã N.Viên'] != '') {
                var hours = item['Vào 1'].split(':');
                var hour = ((hours[0] * 60 * 60) + (hours[1] * 60)) * 1000;

                var dates = item['Ngày'].split('/');

                if(hour > 0) {
                    data.push([Date.UTC(dates[2], dates[0], dates[1]), hour]);
                }
            }
        });

        return data
    }
    
    function _getDataOutput(userID) {
        var data = [];

        angular.forEach(jsonFromFile, function (item) {
            if(!!item['Mã N.Viên'] && item['Mã N.Viên'] == userID && item['Mã N.Viên'] != '') {
                var hours = item['Ra 1'].split(':');
                var hour = ((hours[0] * 60 * 60) + (hours[1] * 60)) * 1000;

                var dates = item['Ngày'].split('/');

                if(hour > 0) {
                    data.push([Date.UTC(dates[2], dates[0], dates[1]), hour]);
                }
            }
        });

        return data
    }
});