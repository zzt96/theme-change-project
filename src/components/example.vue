<template>
  <div class="body">
    <div class="theme">
      <div id="tabs">
        <div class="hint">
          here is custom nav-bar
        </div>
        <div id="tabs-header">
          <div v-for="item in this.tabs" :key="item.index" class="tabs-item">
            {{ item.item }}
          </div>
        </div>
        <div id="tabs-content"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabs: [
          {item: "hello"},
          {item: "my"},
          {item: "friend"}
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  @tabs-width: 100%;
  @tabs-height: 48px;
  .theme(@backgd: #fd9827) {
      .flex-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      height: 1200px;
      #tabs {
        width: @tabs-width;
        margin: 62px auto;
        .hint{
          color: @backgd;
          font-size: large;
          margin-bottom: 20px;
        }
        #tabs-header {
          .flex-row();
          background-color: @backgd;
          height: @tabs-height;
          .tabs-item {
            width: 200px;
            color: #f4f4f4;
            cursor: pointer;
            font-size: large;
            height: @tabs-height;
            .flex-row;
            &:hover {
              background-color: lighten(@backgd, 10%);
            }
          }
        }
      }
  }
  .body{
  .theme(#5a191b)
  }


</style>
