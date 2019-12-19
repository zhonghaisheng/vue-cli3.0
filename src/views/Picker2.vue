<template>
  <div class="container">
    <span @click="pickShowOrHide">展示/隐藏</span>
    <span class="fr">{{chooseValueData}}</span>
    <div class="nut-actionsheet" v-show="pickerShow">
      <div class="nut-actionsheet-mask"></div>
      <div class="inner">
        <div class="title-box">
          <span class="cancel fl" @click="cancel">取消</span>
          <span class="sure fr" @click="confirm">确定</span>
        </div>
        <div class="main-box">
          <template v-for="(item, index) of listData">
            <nutpickerslot
              :ref="`picer-slot-${(index)}`"
              :default-value="chooseValueData&&chooseValueData[index]"
              :is-update="isUpdate"
              :is-date="index==2?isDate:null"
              :is-dateindex="isDateindex"
              :list-data="item"
              @chooseItem="chooseItem"
              :key="index"
              :key-index="index"
            ></nutpickerslot>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import nutpickerslot from "@/components/picker-slot";
import { CITYSDATA } from '@/utils/citydata'

import axios from "axios";
export default {
  data() {
    return {
      listData: [[],[],[]],
      defaultValueData: ['2012', '2'],
      chooseValueData: [],
      cacheValueData: [],
      isUpdate:false,
      isDate:false,
      isDateindex:27,
      pickerShow:false,
      defaultData:[]
    };
  },
  components: {
    nutpickerslot
  },
  created() {
    var _beginYear = 2010
    var _endYear = 2090
    this.listData = [[],[],[]]
    //年列表
    for(var i=_beginYear;i<=_endYear;i++){
        this.listData[0].push(i.toString())
    }
    //月列表
    for(var j=1;j<=12;j++){
        this.listData[1].push(j.toString())
    }
    //日列表
    for(var k=1;k<=31;k++){
        this.listData[2].push(k.toString())
    }
    this.defaultData = [_beginYear,'1','1']
  },
  watch: {
    defaultValueData: function() {
      this.chooseValueData = [...this.defaultValueData];
      this.cacheValueData = [...this.defaultValueData];
    }
  },
  methods: {
    pickShowOrHide(){
      this.pickerShow = !this.pickerShow
    },
    chooseItem(value, index) {
      if (this.cacheValueData[index] !== value) {
        this.cacheValueData[index] = value;
        console.log(value,index)
        if(index==0 || index==1){
            //判断是平年还是闰年
            var _year = this.cacheValueData[0],
            _month = this.cacheValueData[1];
            var a1=_year%4==0;
            var a2=_year%100!=0;
            var a3=_year%400==0;
            var　result=(a1&&a2)||a3?1:2;//三目运算符
            var _dateindex = 27
            //选择月份需要判断是否是闰年或者平年
            if(_month==2){
                this.listData[2] = []
                if(result==1){
                    //闰年
                    for(var m = 1;m<=29;m++){
                        this.listData[2].push(m.toString())
                    }
                    _dateindex = 28
                }else{
                    //平年
                    for(var m = 1;m<=28;m++){
                        this.listData[2].push(m.toString())
                    }
                    _dateindex = 27
                }
            }else{
              //选择月份需要判断大月和小月
              if(index==1){
                this.listData[2] = []
                if(_month == 1 || _month == 3 || _month == 5 || _month == 7 || _month == 8 || _month == 10 || _month == 12){
                  for(var m = 1;m<=31;m++){
                      this.listData[2].push(m.toString())
                  }
                  _dateindex = 30
                }else if(_month == 4 || _month == 6 || _month == 9 || _month == 11){
                  for(var m = 1;m<=30;m++){
                      this.listData[2].push(m.toString())
                  }
                  _dateindex = 29
                }
              }
            }
            this.$forceUpdate();
            //如果当前选中日期大于接下来要展示的最大的日列表的值，那么强制刷新日列表
            if(this.cacheValueData[2]>=(_dateindex+1)){
              this.isDate = !this.isDate
              this.isDateindex = _dateindex
              this.cacheValueData[2] = (_dateindex+1).toString()
            }
        }
      }
    },
    cancel(){
      this.isUpdate = !this.isUpdate
      this.cacheValueData = [...this.defaultData]
      this.pickerShow  = !this.pickerShow
    },
    confirm(){// 确定
      this.chooseValueData = [...this.cacheValueData]
      this.pickerShow = !this.pickShowOrHide
    }
  },

  mounted() {
  },
  beforeDestroy() {}
};
</script>
<style lang="less">
.container{
  width:100%;
}
.nut-actionsheet{
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height: 100%;
  z-index:9999;
  .nut-actionsheet-mask{
    background: rgba(0,0,0,0.7);
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
  }
  .inner{
    background:#fff;
    position: fixed;
    left:0;
    bottom:0;
    z-index:9999;
    width:100%;
  }
}
.title-box{
  line-height:42px;
  width:100%;
  overflow: hidden;
}
.cancel,.sure{
  padding:0 10px;
}
.cancel{
  color:#f30;
}
.sure{
  color:green;
}
.main-box {
  display: flex;
}
.fl{
  float:left;
}
.fr{
  float:right;
}
</style>