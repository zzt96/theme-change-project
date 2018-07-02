<template>
  <div id="rotate">
    <div class="pointer"></div>
    <div class="core">
      <div class="logo">
        <img src="../../static/fangxinqian.png" alt="logo">
      </div>
    </div>
    <div v-for="(cycle,index) in cycles" :key="index" :class="'cycle-'+ cycle ">
        <div class="dot-contain" v-for="(item,index) in items" v-if="item.cycle === cycle" :key="index" :style="{'left':item.left+'px','top':item.top+'px'}">
          <div class="dot-hint">
            <div class="dot-title"> {{ item.name }}</div>
            <div class="detail-btn">
              查看详情
            </div>
          </div>
          <div class="trans-dot">
            <div class="core-dot"></div>
            <div class="mid-dot"></div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        cycles: [1, 2, 3, 4],
        items: [
          {
            name: "旅游行业",
            cycle: 1,
            position: 1,
            left: 0,
            top: 0,
          },
          {
            name: "游戏行业",
            cycle: 2,
            position: 3,
            left: 0,
            top: 0,
          },
          {
            name: "电商行业",
            cycle: 3,
            position: 4,
            left: 0,
            top: 0,
          },
          {
            name: "事业单位",
            cycle: 3,
            position: 5,
            left: 0,
            top: 0,
          },
          {
            name: "金融行业",
            cycle: 3,
            position: 6,
            left: 0,
            top: 0,
          },
          {
            name: "教育行业",
            cycle: 4,
            position: 7,
            left: 0,
            top: 0,
          },
          {
            name: "商务服务行业",
            cycle: 4,
            position: 1,
            left: 0,
            top: 0,
          },
        ],
        theta: [0, Math.PI/4, Math.PI/2, 3*(Math.PI/4), Math.PI, 5*(Math.PI/4), 3*(Math.PI/2), 7*(Math.PI/4)] // set 8 points on cycle
      }
    },
    created() {
      this.dotposition()
    },
    methods: {
      dotposition: function() {
        let count = this.items.length
        for (let i=0; i <= count; i++) {
          let cycle = this.items[i].cycle
          let radius = 200 +  cycle * 75
          let x = radius * Math.cos(this.theta[this.items[i].position])
          let y = radius * Math.sin(this.theta[this.items[i].position])
          let left = x + radius - 70
          let top = radius - y -70
          this.items[i].left = left
          this.items[i].top = top
        }
        console.log(this.items)
      }
    }

  }
</script>

<style scoped lang="less">
  @core-diameter: 400px;
  @theme-color: #FFFFFF;
  @z-index: 999;
  @increase: 150;

  @dot-diameter: 41px;
  @mid-dot: 35px;
  @core-dot: 7px;
  // flex
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // cycle
  .basic-cycle {
    position: absolute;
    border: 1px dashed @theme-color;
    border-radius: 50%;
  }

  // animation for all browser
  .z-animation(@animation) {
    animation: @animation; // other browser
    -webkit-animation: @animation; // chrome and safari
  }

  // keyframes for all browser
  #rotate {
    .flex-center;
    width: 1200px;
    height: 1200px;
    margin: 50px auto;
    background: url("../../static/backgd.png");
    // core cycle
    .core {
      width: @core-diameter;
      height: @core-diameter;
      .flex-center;
      .basic-cycle;
      z-index: @z-index;
      .logo {
        .flex-center;
        width: 226px;
        height: 87px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.4);
        img {
          width: 80%;
          height: 80%;
        }
      }
    }
    // generate cycles
    .generate-cycle(@n, @i: 1) when (@i =< @n) { // using the loop feature in the less
      .cycle-@{i} {
        .basic-cycle; // mixin feature
        z-index: @z-index - @i*10;
        width: @core-diameter + @i*@increase;
        height: @core-diameter + @i*@increase;
      }
      .generate-cycle(@n, (@i + 1)) //next iteration
    }
    .generate-cycle(4);

    // pointer with rotate
    .pointer {
      z-index: 10;
      background: url('../../static/pointer.png') no-repeat;
      width: 1016px;
      height: 1016px;
      .z-animation(loop 6s linear 0s infinite)
    }

    //dot container
    @contain-size: 140px;
    @contain-half-size: @contain-size/2;
    .dot-contain {
      z-index: 1000;
      // margin-left: 61px -  @contain-half-size;
      // margin-top: 101px -  @contain-half-size;
      position: absolute;
      .flex-center;
      flex-direction: column;
      width: @contain-size;
      height: @contain-size;
      .dot-hint {
        .flex-center;
        flex-direction: column;
        margin-top: -90px;
        .dot-title {
          font-size: 16px;
          font-family: Adobe Heiti Std R;
          color: #ffffff;
        }
        .detail-btn {
          visibility: hidden;
          margin-top: 5px;
          .flex-center;
          width: 66px;
          height: 26px;
          border: 1px solid #ffffff;
          border-radius: 4px;
          font-size: 14px;
          color: #ffffff;
          cursor: pointer;
        }
      }
      &:hover {
        .dot-hint {
          margin-top: -110px;
        }
        .detail-btn {
          visibility: visible;
        }
      }
    }
    // dot basic
    .dot-cycle {
      .flex-center;
      position: absolute;
      border: 1px solid @theme-color;
      border-radius: 50%;
    }
    .dot (@diameter:41px) {
      width: @diameter;
      height: @diameter;
      .dot-cycle;
    }
    // dot styles
    .trans-dot {
      .dot;
      .z-animation(out-dot 3s linear infinite);
    }
    .mid-dot {
      .dot(35px);
      .z-animation(mid-dot 3s linear infinite);
      background: rgba(255, 255, 255, 0.2);
    }
    .core-dot {
      .dot(5px);
      .z-animation (core-dot 3s linear infinite);
      background: #ffffff;
    }
    // dot animation
    @-webkit-keyframes out-dot {
      from {
        .dot(10px)
      }
      to {
        .dot(41px)
      }
    }
    @-webkit-keyframes mid-dot {
      from {
        .dot(4px)
      }
      to {
        .dot(35px)
      }
    }
    @-webkit-keyframes core-dot {
      from {
        .dot(1px)
      }
      to {
        .dot(5px)
      }
    }
    // definite the start and end state of loop
    @-webkit-keyframes loop {
      from {
        -webkit-transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
      }
    }
  }
</style>
