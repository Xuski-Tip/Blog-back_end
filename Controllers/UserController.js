import jwt from 'jsonwebtoken'
import bcript from 'bcrypt'

import UserModal from '../models/User.js'


export const register = async (req, res) => {
    try { 
        const password = req.body.password;
        const salt = await bcript.genSalt(10)
        const hash = await bcript.hash(password, salt)
        const doc = new UserModal({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
    
        })
        const user = await doc.save()
        const token = jwt.sign( {
            _id: user._id,
        }, 
        'secret123', 
        {
            expiresIn: '30d',
        })
        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userData,
            token
        })
    }

    catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}
export const login = async (req, res) => {
    try {
        const user = await UserModal.findOne({email: req.body.email})

        if(!user) {
            return res.status(404).json({
                massage: 'Пользователь не найден'
            });
        }
        const isValidPass = await bcript.compare(req.body.password, user._doc.passwordHash)
        if(!isValidPass) {
            return res.status(400).json({
                massage: 'Неверный логин или пороль'
            });
        }
        const token = jwt.sign( {
            _id: user._id,
        }, 
        'secret123', 
        {
            expiresIn: '30d',
        })
        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userData,
            token
        })  
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваца'
        })
    }
}
export const getMe = async (req, res)=> {
    try {
        const user = await UserModal.findById(req.userId)
        if(!user) {
            return res.status(404).json({
                massage: "Пользователь не найден"
            })
        }
        const {passwordHash, ...userData} = user._doc
        res.json(userData)  
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}