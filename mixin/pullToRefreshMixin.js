/**
 ** 引入mixinPullToRefresh的页面
 * 需要自定义如下data或computed
 * data
 *   apis 列表请求所对应的api名称数组
 *   initPageNum pageNum的初始页码
 *   listKeyName 返回对象的list的键名
 *   pageCount 返回对象的pageCount的键名
 * computed
 *   params 自定义的请求参数
 *  components
 *   run-loading 加载组件（mpvue存在bug）
 * */
import {LOADING_STATE_ENUM} from "../enum";

export default {
    components: {
        // runLoading
    },
    data () {
        return {
            loadingState: LOADING_STATE_ENUM.NO_SHOW, // 0:不可见 1:正在加载 2:全部加载完毕 3:异常
            pageIndex: 0,
            apis: [],
            initPageNum: 0, // pageNum的初始页码
            listKeyName: 'data',
            pageCountKeyName: 'pageCount'
        }
    },
    computed: {
        pages () {
            let result = []
            for (let i = 0; i < this.apis.length; i++) {
                result.push({
                    pageNum: this.initPageNum, // 当前页
                    pageSize: 10, // 一页多少条数据
                    pageCount: 10, // 一共多少页
                    list: []
                })
            }
            return result
        },
        activePage () {
            return this.pages[this.pageIndex]
        },
        activeApi () {
            return this.apis[this.pageIndex]
        }
    },
    methods: {
        async fetchList (isRefresh = true) {
            if (isRefresh) {
                this.activePage.pageNum = this.initPageNum
                this.activePage.pageCount = 0
            } else {
                this.activePage.pageNum += 1
                if (this.activePage.pageNum > this.activePage.pageCount) {
                    // todo 数据已经请求到了最后一页
                    this.loadingState = LOADING_STATE_ENUM.ALL_OVER
                    this.activePage.pageNum -= 1
                    return
                }
            }
            let params = {
                pageNum: this.activePage.pageNum,
                pageSize: this.activePage.pageSize,
                ...this.params
            }
            // 开始请求
            // console.log('请求列表的参数', params)
            this.loadingState = 1
            try {
                const result = await api[this.activeApi](params)
                // console.log(this.activeApi, result)
                this.activePage.list = isRefresh ? result[this.listKeyName] : [...this.activePage.list, ...result[this.listKeyName]]
                this.activePage.pageCount = result[this.pageCountKeyName]
                this.loadingState = this.activePage.pageNum < this.activePage.pageCount ? LOADING_STATE_ENUM.NO_SHOW : LOADING_STATE_ENUM.ALL_OVER // 0:不可见 1:正在加载 2:全部加载完毕 3:异常
            } catch (e) {
                // console.log(e)
                this.loadingState = LOADING_STATE_ENUM.ERROR
            }
        }
    },
    async onPullDownRefresh () { // 下拉刷新
        // console.log('下拉刷新')
        await this.fetchList()
        wx.stopPullDownRefresh()
    },
    async onReachBottom () { // 上拉加载
        // console.log('上拉加载')
        await this.fetchList(false)
    },
    async mounted () {
        await sleep(50)
        wx.startPullDownRefresh()
    }
}
