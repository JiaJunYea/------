import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import Bus from '../models/bus.js'
import express from 'express'
import * as userController from '../controllers/user.js'
const router = express.Router()

export default router

export const create = async (req, res) => {
  try {
    await User.create({
      username: req.body.username,
      role: req.body.role,
      password: req.body.password,
    })
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log('controllers/user.js create')
    console.error(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '使用者已存在',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    const users = await User.find()
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: '使用者列表取得成功',
      users,
    })
  } catch (error) {
    console.log('controllers/user.js getAll')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const login = async (req, res) => {
  try {
  const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days'})
  req.user.tokens.push(token)
  await req.user.save()
  res.status(StatusCodes.OK).json({
    success: true,
    message: '登入成功',
    user: {
      username: req.user.username,
      role: req.user.role,
      password: req.user.password,
      token,
    },
  })
  } catch (error) {
    console.log('controllers/user.js login')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const profile = (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    user: {
      username: req.user.username,
      role: req.user.role,
      password: req.user.password,
    },
  })
}

export const refresh = async (req, res) => {
  try {
    const i = req.user.tokens.indexOf(req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[i] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      token,
    })
  } catch (error) {
    console.log('controllers/user.js refresh')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log('controllers/user.js logout')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const bus = async (req, res) => {
  try {
    // 驗證 busplate 和 busmodel 必填
    if (!req.body.busplate || !req.body.busmodel) {
      throw new Error('BUS INFO REQUIRED')
    }

    // 檢查是否已經收藏過這台公車
    const i = req.user.bus.findIndex(
      (item) =>
        item.busplate === req.body.busplate &&
        item.busmodel === req.body.busmodel
    )

    let message;
    if (i > -1) {
      // 已收藏，移除
      req.user.bus.splice(i, 1)
      message = '已移除收藏公車'
    } else {
      // 未收藏，加入
      req.user.bus.push({
        busplate: req.body.busplate,
        busmodel: req.body.busmodel,
      })
      message = '已加入收藏公車'
    }

    await req.user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message,
      result: req.user.bus,
    })
  } catch (error) {
    console.error(error)
    if (error.message === 'BUS INFO REQUIRED') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '請提供公車車號和車型',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, 'cart')
      .populate('cart.product')
      .orFail(new Error('USER NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: user.cart,
    })
  } catch (error) {
    if (error.message === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '使用者 ID 格式錯誤',
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

export const changerole = async (req, res) => {
    try {
    console.log('====', req.body._id)


    const user = await User.findByIdAndUpdate(
      req.body._id, 
      {
        role: req.body.role
      },
      {
        new: true,
        runValidators: true,
      },
    ).orFail(new Error('USER NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '會員更新成功',
      user,
    })
  } catch (error) {
    console.log('controllers/product.js update')
    console.error(error)
    if (error.message === 'PRODUCT ID') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的使用者 ID',
      })
    } else if (error.message === 'PRODUCT NOT FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '使用者不存在',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

export const del = async (req, res) => {
    try {
    const user = await User.deleteOne({username: req.body.deluser})
      .orFail(new Error('USER NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '會員刪除成功',
      user,
    })
  } catch (error) {
    console.log('controllers/product.js update')
    console.error(error)
    if (error.message === 'PRODUCT ID') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的使用者 ID',
      })
    } else if (error.message === 'PRODUCT NOT FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '使用者不存在',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}