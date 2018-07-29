/*

  MACD - DJM 31/12/2013

  (updated a couple of times since, check git history)

 */

// helpers
var _ = require('lodash');
var log = require('../core/log.js');
var math = require('mathjs');
// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function() {
  this.trend = {
    direction: 'none',
    duration: 0,
    persisted: false,
    adviced: false
  };
  this.addIndicator('sma_7', 'SMA', 7);
  this.addIndicator('sma_25', 'SMA', 25);
}

// what happens on every new candle?
method.update = function(candle) {
  // nothing!
}

// for debugging purposes: log the last calculated
// EMAs and diff.
method.log = function() {
  var sma_7 = this.indicators.sma_7;
  var sma_25 = this.indicators.sma_25;

  // console.log('calculated SMA properties for candle:');
  // console.log("sma_7", sma_7.result)
  // console.log("prices", sma_7.prices)
  // console.log("prices", sma_7.diff)
  // console.log("sma_25", sma_25.result)
}

method.check = function() {
  var sma_7 = this.indicators.sma_7,
      diff = sma_7.diff.map(function(e){ return e.diff }),
      last_index = sma_7.diff.length - 1;

  if(this.trend.direction !== 'up'){
    this.trend = {
        duration: 0,
        persisted: false,
        direction: 'up',
        adviced: false
      };
    this.trend.duration++;
    if(diff[last_index] < 0 && last_index - 1 >= 0 && (diff[last_index] - diff[last_index - 1]) < 0){
      let point = math.abs(diff[last_index] - diff[last_index - 1]) / math.abs(diff[last_index - 1]) * 100;
      if(point > 100){
        this.advice("long");
      }else{
        this.advice();
      }
    }else{
      this.advice();
    }
  }else if(this.trend.direction !== 'down'){
    this.trend = {
        duration: 0,
        persisted: false,
        direction: 'down',
        adviced: false
      };
    this.trend.duration++;
    if(diff[last_index] > 0 && last_index - 1 >= 0 && (diff[last_index] - diff[last_index - 1]) < 0){
      let point = math.abs(diff[last_index] - diff[last_index - 1]) / math.abs(diff[last_index -1]) * 100;
      if(point > 50){
        this.advice("short");
      }else{
        this.advice();
      }
    }else{
      this.advice();
    }
  }else{
    this.advice();
  }
}

module.exports = method;
