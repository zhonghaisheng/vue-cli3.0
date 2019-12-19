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
              :is-city="index==1?isCity:null"
              :is-area="index==2?isArea:null"
              :is-update="isUpdate"
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
      listData: [["上海", "黑龙江", "北京", "重庆", "江西", "内蒙古"]],
      data: {
        北京: ["北京"],
        黑龙江: [
          "哈尔滨",
          "绥化",
          "漠河",
          "大兴安岭",
          "牡丹江",
          "佳木斯",
          "齐齐哈尔",
          "大庆",
          "五大连池"
        ],
        江西: ["九江", "南昌", "赣州"],
        上海: ["上海"],
        重庆: ["重庆"],
        内蒙古: [
          "呼和浩特",
          "呼和浩特1",
          "呼和浩特2",
          "呼和浩特3",
          "呼和浩特4",
          "呼和浩特5",
          "呼和浩特6",
          "呼和浩特7"
        ]
      },
      dataSub: {
        上海: ["测试1", "测试2"],
        北京: ["西城区", "东城区", "大兴区", "朝阳区", "海淀区"],
        南昌: ["青山湖区", "西湖区", "宏都中路", "梦时代", "八一广场"],
        绥化: ["明水", "拜泉"],
        哈尔滨: ["道里区", "道外区"]
      },
      defaultValueData: {
        type: Array,
        default: () => []
      },
      chooseValueData: [],
      cacheValueData: [],
      isUpdate: false,
      isCity:false,
      isCityindex:0,
      isArea:false,
      isAreaindex:0,
      pickerShow:false,
      defaultData:[],
      _self:null
    };
  },
  components: {
    nutpickerslot
  },
  created() {
    console.log(CITYSDATA)
    this.listData = [[]]
    this.data = {}
    this.dataSub = {}
    CITYSDATA.forEach((item,index)=>{
      this.listData[0].push(item.value)
      this.data[item.value] = []
      if(item.children && item.children.length>0){
        item.children.forEach((citem,cindex)=>{
          this.data[item.value].push(citem.value)
          this.dataSub[citem.value] = []
          if(citem.children && citem.children.length>0){
            citem.children.forEach((ccitem,ccindex)=>{
              this.dataSub[citem.value].push(ccitem.value)
            })
          }
        })
      }
    })
    this.listData = [
      ...[this.listData[0]],
      this.data[this.listData[0][0]],
      this.dataSub[this.data[this.listData[0][0]]]
    ];
    if (this.defaultValueData && this.defaultValueData.length) {
      this.chooseValueData = [...this.defaultValueData];
    } else {
      let defaultValueData = [];
      this.listData.map(item => {
        defaultValueData.push(item[0]);
      });
      this.chooseValueData = [...defaultValueData];
    }
    console.log('defalut')
    this.defaultData = this.chooseValueData

    this.getHomeData()
  },
  watch: {
    defaultValueData: function() {
      this.chooseValueData = [...this.defaultValueData];
      this.cacheValueData = [...this.defaultValueData];
    }
  },
  methods: {
    getHomeData() {
      axios.get("/news/index").then(res => {
        console.log(res)
      })
    },
    pickShowOrHide(){
      this.pickerShow = !this.pickerShow
    },
    chooseItem(value, index) {
      if (this.cacheValueData[index] !== value) {
        this.cacheValueData[index] = value;
        switch(index){
          case 0:
            //选择省份
            this.listData[1] = this.data[value]
            this.listData[2] = this.dataSub[this.listData[1][0]]
            this.isCity = !this.isCity
            this.isArea = !this.isArea
          break;
          case 1:
            //选择城市
            this.listData[2] = this.dataSub[value]
            this.isArea = !this.isArea
            break;
          case 2:
            //选择区（县）
            break;
        }
        this.$forceUpdate();
      }
    },
    cancel(){
      this.isUpdate = !this.isUpdate
      this.cacheValueData = [...this.defaultData]
      this.pickerShow  = !this.pickerShow
    },
    confirm(){// 地区选择器
      console.log(this.chooseValueData)
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