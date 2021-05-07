// xhsframework/component/RichInput/RichInput.js
const qiniuApi = require("../../network/xhsQiniuApi.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    project_content: {
      type: [],
      value: []
    },
    concatvideoMaxTime: {
      type: Number,
      value: 60
    },
    placeholder: {
      type: String,
      value: '请输入'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageMaxSize: 2,
    videoMxTime: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delemessage: function (event) {
      var index = event.currentTarget.dataset.index
      var list = this.data.project_content
      list.splice(index, 1)
      this.setData({
        project_content: list
      })
      this.triggerEvent("listData", {
        data: list
      })
    },
    topmove: function (event) {
      var index = event.currentTarget.dataset.index
      var list = this.data.project_content
      if (index == 0) {
        return
      }
      var cache = list[index]
      var cachetop = list[index - 1]
      list.splice(index - 1, 2, cache, cachetop)
      this.setData({
        project_content: list
      })
      this.triggerEvent("listData", {
        data: list
      })
    },
    downmove: function (event) {
      var index = event.currentTarget.dataset.index
      var list = this.data.project_content
      if (index == list.length - 1) {
        return
      }
      var cache = list[index]
      var cachedown = list[index + 1]
      list.splice(index, 2, cachedown, cache)
      this.setData({
        project_content: list
      })
      this.triggerEvent("listData", {
        data: list
      })
    },
    addmessage: function () {
      var list = this.data.project_content

      if (list.length > 0 && list[list.length - 1].content == null) {
        list.splice(list.length - 1, 1)
      }
      list = list.concat({
        type: 'text',
        content: null
      })
      this.setData({
        project_content: list
      })
      this.triggerEvent("listData", {
        data: list
      })
    },
    bindinput: function (event) {
      var index = event.currentTarget.dataset.index
      var content = event.detail.value
      var list = this.data.project_content
      list[index].content = content

      this.triggerEvent("listData", {
        data: list
      })
      this.setData({
        project_content: list
      })

    },
    addimage: function () {
      const that = this
      var list = this.data.project_content
      if (list.length > 0 && !list[list.length - 1].content) {
        list.splice(list.length - 1, 1)
      }
      wx.chooseImage({
        count: 9,
        success(result) {
          for (let index = 0; index < result.tempFiles.length; index++) {
            console.log('result',result);
            console.log('result.tempFiles.length',result.tempFiles.length);
            wx.showLoading({
              title: '加载中...',
            })
            if (result.tempFiles[index].size > that.data.imageMaxSize * 1024 * 1024) {
              wx.hideLoading({
                success: (res) => {},
              })
              wx.showToast({
                icon: 'none',
                title: '上传图片不能大于' + that.data.imageMaxSize + 'M',
              })
              return
            }
            qiniuApi.uploadFile(result.tempFiles[index].path, "image").then(res => {
              list = list.concat({
                type: 'image',
                content: res
              })
              that.setData({
                project_content: list
              })
              that.triggerEvent("listData", {
                data: list
              })
              wx.hideLoading({
                success: (res) => {},
              })
            }).catch(err => {
              wx.hideLoading({
                success: (res) => {},
              })
            }) 
          }
        }
      })
    },
    addVideo: function () {
      const that = this
      var list = this.data.project_content
      if (list.length > 0 && !list[list.length - 1].content) {
        list.splice(list.length - 1, 1)
      }

      wx.chooseVideo({
        count: 1,
        maxDuration: that.data.videoMaxTime,
        success(result) {
          wx.showLoading({
            title: '加载中...',
          })

          if (result.duration > that.data.videoMxTime * 60) {
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              icon: 'none',
              title: '上传视频不能大于' + that.data.videoMxTime + '分钟',
            })

            return
          }
          qiniuApi.uploadFile(result.tempFilePath, "video").then(res => {
            list = list.concat({
              type: 'video',
              content: res
            })
            that.setData({
              project_content: list
            })
            that.triggerEvent("listData", {
              data: list
            })
            wx.hideLoading({
              success: (res) => {},
            })
          }).catch(err => {
            console.log(err)
            wx.hideLoading({
              success: (res) => {},
            })
          })

        }
      })
    }
  }
})