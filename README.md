# theme-change-project
## 使用less转换主题颜色DEMO

### using

- vue
- iview
- less

# 业务旋转
## 实现效果
在vue的组件中，
仿照360浏览器：https://browser.360.cn/se/
的扫描仪界面：有多层圆形虚线；围绕其中心实现指针转动效果，除此之外，有可点击的圆点放置在扫描仪的虚线上，要求圆点的中心穿过虚线。
在此之上，还需要考虑整个组件的复用，即每个圆点看作一个数据，这个数据可以添加和删除，并可视化的以圆点的形式自定义的零散分布在虚线上。

## 难点
- 使用less循环渲染圆形虚线
- 如何实现指针转动
- 如何使圆点的分布零散
- 如何获取每个圆点对应的位置:要求能自动计算位置，中心对应虚线。

## 实现过程
### 选定页面，画出五层背景圆形虚线
这里使用less的知识点：Loop循环设定每个圆圈的样式。
首先把可以确定的相同样式提出为：
```
    @theme-color: #FFFFFF;
    .basic-cycle {
        position: absolute; // 因为各个圆是要重叠加的，所以使用绝对布局，通过z-index分布
        border: 1px dashed @theme-color;
        border-radius: 50%;
    }
```
不得不说less真的十分方便，在写完这段代码之后，之后想使用相同的样式代码直接调用
```
    .basic-cycle
```
就可以了，这样极大的减少了代码的重复性编写。

然后就可以循环设定（渐增）圆的直径和z-index了
```
  @core-diameter: 400px;
  @z-index: 999;
  @increase: 150;
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

    .generate-cycle(4); // call the generate-cycle() with params:(@n:4)
```
这里的代码使用了less中的loop知识点，详情可以看：http://lesscss.cn/features/#loops-feature。
主要是中间有一个中心圆，其直径为400px，之后按照直径150px的单位递增； 中心圆的z-index为999，之后以单位10递减。
这里的渲染出来的output如下：
```
 .cycle-1 {
    position: absolute;
    border: 1px dashed #FFFFFF;
    border-radius: 50%;
    z-index: 989;
    width: 550px;
    height: 550px;
 }
 .cycle-2 {
    position: absolute;
    border: 1px dashed #FFFFFF;
    border-radius: 50%;
    z-index: 979;
    width: 700px;
    height: 700px;
 }

 ....
```

最后，HTML代码（VUE）with JS
```
<div v-for="(cycle,index) in cycles" :key="index" :class="'cycle-'+ cycle "></div>

<script>
 export default {
    data() {
      return {
        cycles: [1, 2, 3, 4]
        }
    }
}
</script>
```
关于less比较好的文章：
- https://blog.csdn.net/m0_38099607/article/details/72953929
- 处理浏览器兼容：https://www.jianshu.com/p/02d8ce57c2b6

### 第二步 实现指针转动
参考：https://blog.csdn.net/wp1603710463/article/details/51176378
- 使用知识点：animation动画的使用；参考：http://www.w3school.com.cn/cssref/pr_animation.asp
- 需要注意的是，animation需要不同浏览器的适配，所以我单独写了一个函数：
```
 // animation for all browser
  .z-animation(@animation) {
    animation: @animation; // other browser
    -webkit-animation: @animation; // chrome and safari
  }
```
- 指针旋转代码：
```
  // pointer with rotate
    .pointer {
      z-index: 10;
      background: url('../../static/pointer.png') no-repeat;
      width: 1016px; // 最大的div宽度，覆盖整个图形
      height: 1016px;
      .z-animation(loop 6s linear 0s infinite) // 这里是关键，定义一个名为loop，周期为6s, 线性运动（出入速度一致），延迟0s，无线循环的动画
    }

// definite the start and end state of loop；设定运动起始点和结束点：deg度
    @-webkit-keyframes loop {
      from {
        -webkit-transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
      }
    }
```

### 最后，实现各个数据点的零散分布，和定位计算
#### 零散分布
大致思路是这样的：将一个圆分为八等份，角度以45度为单位增加：如第一个点到x轴为0度（平行），第二个点为45度，第三个点为90度，之后135度，180，225，270，315，360（等于0）.
那么零散分布的问题就可以简化为，将这个点自定义的放置在这八个点的哪个位置，这样我们对点的分布就可控多了。

#### 定位计算
首先回忆两个最简单的数学式子：
```
x = r * cos(θ) // 根据偏转度数计算圆上的横坐标
y = r * sin(θ) // 根据偏转度数计算圆上的纵坐标
(x, y) = (r * cos(θ), r * sin(θ)) // 简化：求圆上的坐标公式
```

然而，知道了这个坐标还是不能让点这个div的中心居于边界线上，而且我们是以整个圆div的左上角进行定位的；所以还需要进行进一步计算：
```
 left = x + radius // x轴上相对圆div左上角的偏移量
 top = radius - y // y轴上相对圆div左上角的偏移量
```
到这，我们将包含点的div的左上角和圆边界对齐了，接下来，各减去包含点的div边长的一般即将该div的中心和圆边界对齐了。
```
 let left = x + radius - 70
 let top = radius - y -70
```

全部代码如下；
```
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
         ....]

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
```

改写html代码：
```
<div v-for="(cycle,index) in cycles" :key="index" :class="'cycle-'+ cycle ">
        <div class="dot-contain" v-for="(item,index) in items" v-if="item.cycle === cycle" :key="index" :style="{'left':item.left+'px','top':item.top+'px'}">
          <div class="dot-hint">
            <div class="dot-title"> {{ item.name }}</div>
          </div>
          <div class="trans-dot">
            <div class="core-dot"></div>
            <div class="mid-dot"></div>
          </div>
        </div>
    </div>
```
