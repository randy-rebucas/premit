const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ip = require("ip");

const User = require('../models/user');
const Setting = require('../models/setting');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                last_ip: ip.address(),
                license_key: (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase(),
            });
            user.save()
                .then(result => {
                  const setting = new Setting({
                    client_id: result._id,
                    clinic_owner: result.firstname + ' ' + result.lastname
                  });
                  setting.save().then(createdSetting => {
                    res.status(201).json({
                        message: 'User created!',
                        result: result
                    });
                  })
                  .catch(error => {
                      res.status(500).json({
                          message: error
                      });
                  });

                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials!'
                    });
                });
        });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failedno result'
                });
            }
            const token = jwt.sign({ email: fetchedUser.email, license: fetchedUser.license_key, userId: fetchedUser._id },
                process.env.JWT_KEY, { expiresIn: '12h' }
            );
            console.log(token);

            res.status(200).json({
                token: token,
                expiresIn: 43200, //3600,
                userId: fetchedUser._id,
                userEmail: fetchedUser.email,
                userLicense: fetchedUser.license_key
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: 'Invalid authentication credentials!'
            });
        });
}

exports.getAll = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const query = User.find().sort({ 'created_at': 'desc' });

    let fetchedRecord;
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    query
        .then(documents => {
            fetchedRecord = documents;
            return User.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                users: fetchedRecord,
                max: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};
