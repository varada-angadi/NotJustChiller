import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

const htmlContent = `
<!DOCTYPE html>
<html style="height: 100%;">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: visible;
        background: #fff;
      }
      #chart {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="chart"></div>
    <script>
      var chart = echarts.init(document.getElementById('chart'));
      var option = {
        title: {
          text: 'Total Expense\\n₹800',
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 16,
            fontFamily: 'Oxanium',
            color: '#1c2c21',
            align: 'center',
            lineHeight: 22
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: ₹{c} ({d}%)',
          backgroundColor: '#ffffff',
          textStyle: {
            fontSize: 16,
            fontFamily: 'Oxanium',
            color: '#1c2c21',
          },
          extraCssText: 'box-shadow: 0px 0px 10px rgba(0,0,0,0.15); padding: 8px; border-radius: 6px;'
        },
        series: [
          {
            type: 'pie',
            radius: ['38%', '60%'],
            minAngle: 5,
            avoidLabelOverlap: true,
            labelLayout: {
              hideOverlap: true,
              moveOverlap: 'shiftY'
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}',
              fontSize: 16,
              fontFamily: 'Oxanium',
              color: '#1c2c21'
            },
            labelLine: {
              show: true,
              length: 12,
              length2: 8
            },
            data: [
              { value: 360, name: 'Eats', itemStyle: { color: '#062734' } },
              { value: 250, name: 'Shopping', itemStyle: { color: '#2D618E' } },
              { value: 110, name: 'Transport', itemStyle: { color: '#F2CB08' } },
              { value: 80, name: 'Health', itemStyle: { color: '#EF476F' } }
            ]
          }
        ]
      };
      chart.setOption(option);
      window.addEventListener('resize', function () {
        chart.resize();
      });
    </script>
  </body>
</html>
`;

export default function DonutChartWithLabels() {
  return (
      <View style={{width: screenWidth, height: 350,backgroundColor:'#fff',borderTopLeftRadius:25,borderTopRightRadius:25,}}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={{width: '100%', height: '100%', backgroundColor: 'transparent',}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
        />
      </View>
  );
}

