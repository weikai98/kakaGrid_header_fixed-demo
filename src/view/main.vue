<template>
  <div
    class="page"
    @scroll="onScoll"
  >
    <div
      class="page-grid_0"
      id="grid_0"
      style="height: 40px; width: 100%"
    ></div>
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
    },
    {
      field: 'level',
      caption: '等级'
    }
  ]
  import kakaGrid from '../../lib/kakaGrid'

  export default {
    data () {
      return {
        grid_0: null,
        grid: {
          grid_1: null,
          grid_2: null,
          grid_3: null,
        },
        offsetMap: {
          grid_1: null,
          grid_2: null,
          grid_3: null,
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
      const header = {
        headers_1: getHeader(column),
        headers_2: getHeader([...column, {
          field: 'part',
          caption: '部位'
        }]),
        headers_3: getHeader([...column, {
          field: 'progress',
          caption: '形象进度项'
        }, {
          field: 'part',
          caption: '部位'
        },])
      }

      const gridKeys = Object.keys(this.grid)

      this.initHeaderGrid({ headers: header.headers_1, el: '#grid_0' })

      gridKeys.forEach((key, i) => {
        this.records[`${key}_records`] = Array.from({ length: 50 }, (v, i) => ({ name: '张三' + i, age: i * 2, sex: 'nan', level: i }))
        this.getWrapperHeight({ records: this.records[`${key}_records`], gridHeight: `${key}_height` })
      })
      this.$nextTick(() => {
        gridKeys.forEach((key, i) => {
          this.initGrid({ grid: `${key}`, el: `#${key}`, headers: header[`headers_${i + 1}`] })
          this.refreshGrid({ grid: `${key}`, records: this.records[`${key}_records`] })
          this.computedOffsetTop({ grid: `${key}` })
        })
      })
    },
    methods: {
      initHeaderGrid (options) {
        this.grid_0 = new kakaGrid.ListGrid({
          theme: {
            defaultRowHeight: 40,
            highlightBorderColor: 'transparent'
          },
          parentElement: document.querySelector(options.el),
          header: options.headers,
        })
      },
      initGrid (options) {
        this.grid[options.grid] = new kakaGrid.ListGrid({
          theme: {
            defaultRowHeight: 40,
            highlightBorderColor: 'transparent'
          },
          parentElement: document.querySelector(options.el),
          header: options.headers,
        })
      },
      refreshGrid (options) {
        if (this.grid[options.grid]) {
          this.grid[options.grid].records = options.records
          this.grid[options.grid].invalidate()
        }
      },
      computedOffsetTop (options) {
        const gridNode = document.querySelector(`#${options.grid}`)
        this.offsetMap[`${options.grid}`] = gridNode.offsetTop
      },
      getWrapperHeight ({ records, gridHeight }) {
        const pageNode = document.querySelector('.page')
        const pageClientHeight = pageNode.clientHeight
        const headerHeight = 48 + 16
        // 默认单元格 高度 40 
        const height = records.length * 40 + headerHeight
        this.height[gridHeight] = height + 'px'
      },
      onScoll (e) {
        const keys = Object.keys(this.offsetMap)
        const offsetTopArr = Object.values(this.offsetMap)

        const scrollTop = e.target.scrollTop
        const index = offsetTopArr.findIndex((v, i) => (scrollTop >= v && (offsetTopArr[i + 1] && (offsetTopArr[i + 1] > scrollTop))) || !offsetTopArr[i + 1])
        // keys[index]
        this.grid_0.header = this.grid[keys[index]].header
        // this.grid[keys[index]].hiddenHeader = true
        // this.grid[keys[index]].invalidate()
        this.grid_0.invalidate()
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
    &-grid_0 {
      position: fixed;
      top: 0;
      z-index: 999;
    }
    &-grid_1 {
      width: 80%;
    }
    &-grid_2 {
      width: 80%;
    }
    &-grid_3 {
      width: 80%;
    }
  }
</style>