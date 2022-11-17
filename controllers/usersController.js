const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = reuire('bcrypt')


// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (res, req) => { //use lean to basically give json files
    const users = await User.find().select('password').lean()
    if (!users?.length) {
        return res.statusCode(400).json({ message: 'no user found'})
    }
    res.json(users)
})

// @desc Create USers
// @route GET /users
// @access Private

const createNewUser = asyncHandler(async (res, req) => {
    const { username, password, roles } = req.body

    //confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.statusCode(400).json({ message: 'All fields are Required'})
    }

    //check duplicates
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.statusCode(409).json({ message: 'Duplicate username'})
    }

    // has password
    const hashedPwd = await bcrypt.hash(password, 10)// salt rounds

    const userObject = { username, "password": hashedPwd, roles}

    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: 'New user ${username} created' })

    } else {
        res.status(400).json({ message: 'Invalid User Data' })
    }
})

// @desc Update USer
// @route Patch /users
// @access Private

const updateUser = asyncHandler(async (res, req) => {
    const { id, username, roles, active, password } = req.body

    //confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
   }

   //check dup
   const duplicate = await User.findOne({ username }).lean().exec()
   //allow updates
   if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).jjson({ message: 'Duplicate Username'})
   }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updateUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`})

})



// @desc Update USer
// @route Patch /users
// @access Private

const deleteUser = asyncHandler(async (res, req) => {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({ message: 'USer ID required' })

        }

        const notes = await Note.findOne({ user: id }).lean().exec()
        if (notes?.length) {
            return res.status(400).json({ message: ' USer has asigned notes' })
        }

        const user = await User.findById(id).exec()

        if (!user) {
            return res.status(400).json({ message: 'USer not Found' })

        }
        const result = await user.deleteOne()

        const reply = `Username ${result.username} with ID ${result._id} deleted`

        res.json(reply)
    })



module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser

}
