import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    // 驗證 busplate 和 busmodel 必填
    if (!req.body.busplate || !req.body.busmodel) {
      throw new Error('BUS INFO REQUIRED')
    }

    // 找到使用者
    const user = await User.findById(req.user._id).orFail(new Error('USER NOT FOUND'))

    // 檢查是否已經收藏過這台公車
    const i = user.bus.findIndex(
      (item) =>
        item.busplate === req.body.busplate &&
        item.busmodel === req.body.busmodel
    )

    let message
    if (i > -1) {
      // 已收藏，移除
      user.bus.splice(i, 1)
      message = '已移除收藏公車'
    } else {
      // 未收藏，加入
      user.bus.push({
        busplate: req.body.busplate,
        busmodel: req.body.busmodel,
      })
      message = '已加入收藏公車'
    }

    await user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message,
      result: user.bus,
    })
  } catch (error) {
    console.error(error)
    if (error.message === 'BUS INFO REQUIRED') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '請提供公車車號和車型',
      })
    } else if (error.message === 'USER NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '使用者不存在',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}