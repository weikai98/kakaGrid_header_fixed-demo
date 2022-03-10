<template>
  <div class="page">
    <div
      class="page-grid_1"
      :style="{height: height.grid_1_height}"
      id="grid_1"
    ></div>
    <div
      class="page-grid_2"
      :style="{height: height.grid_2_height}"
      id="grid_2"
    ></div>
    <div
      class="page-grid_3"
      :style="{height: height.grid_3_height}"
      id="grid_3"
    ></div>
  </div>
</template>

<script>
  import getHeader from './header'

  const column = [
    {
      field: 'name',
      caption: '名称'
    },
    {
      field: 'age',
      caption: '年龄'
    },
    {
      field: 'sex',
      caption: '性别'
    }, {
      field: 'level',
      caption: '等级'
    }
  ]
  import kakaGrid from '../../lib/kakaGrid'

  export default {
    data () {
      return {
        grid: {
          grid_1: null,
          grid_2: null,
          grid_3: null,
        },
        offsetMap: {
          grid_1_scroll: null,
          grid_2_scroll: null,
          grid_3_scroll: null,
        },
        records: {
          grid_1_records: [],
          grid_2_records: [],
          grid_3_records: [],
        },
        height: {
          grid_1_height: '100%',
          grid_2_height: '100%',
          grid_3_height: '100%'
        }
      }
    },
    mounted () {
      const headers = getHeader(column)
      const gridKeys = Object.keys(this.grid)
      gridKeys.forEach((key, i) => {
        this.records[`${key}_records`] = Array.from({ length: Math.random(1) * 50 }, (v, i) => ({ name: '张三' + i, age: i * 2, sex: 'nan', level: i }))
        this.getWrapperHeight({ records: this.records[`${key}_records`], gridHeight: `${key}_height` })
        this.initGrid({ grid: `${key}`, el: `#${key}`, headers })
      })
      this.$nextTick(() => {
        gridKeys.forEach(key => {
          this.refreshGrid({ grid: this[key], records: this.records[`${key}_records`] })
          this.computedOffsetTop({ grid: `${key}` })
        })
      })
    },
    methods: {
      initGrid (options) {
        this[options.grid] = new kakaGrid.ListGrid({
          theme: {
            defaultRowHeight: 40
          },
          parentElement: document.querySelector(options.el),
          header: options.headers
        })
        this[options.grid].addEventListener(kakaGrid.ListGrid.EVENT_TYPE.SCROLL, (e) => {
          const gridNode = document.querySelector(`#${options.grid}`)
          const pageNode = document.querySelector('.page')
          console.log(gridNode.offsetTop, pageNode.scrollTop)
          // 当前 grid 距离 父级元素顶部的距离 - 视口顶部距离父级元素的滚动距离 
          if (gridNode.offsetTop !== pageNode.scrollTop) {
            pageNode.scrollTop = this.offsetMap[`${options.grid}_scroll`]
          }
        })
      },
      refreshGrid (options) {
        if (options.grid) {
          options.grid.records = options.records
          options.grid.invalidate()
        }
      },
      computedOffsetTop (options) {
        const gridNode = document.querySelector(`#${options.grid}`)
        this.offsetMap[`${options.grid}_scroll`] = gridNode.offsetTop
      },
      getWrapperHeight ({ records, gridHeight }) {
        const pageNode = document.querySelector('.page')
        const pageClientHeight = pageNode.clientHeight
        const headerHeight = 48 + 16
        // 默认单元格 高度 40 
        const height = records.length * 40 + headerHeight
        if (pageClientHeight > height) {
          // 
          this.height[gridHeight] = `${(height / pageClientHeight) * 100}%`
        } else {
          this.height[gridHeight] = '100%'
        }
      }
    }
  }
</script>

<style lang="less">
  .page {
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    // background: #ddd;
    & .kaka-grid .grid-scrollable .ps__thumb-x {
      display: none;
    }
    &-grid_1 {
      width: 50%;
    }
    &-grid_2 {
      width: 50%;
    }
    &-grid_3 {
      width: 50%;
    }
  }
</style>