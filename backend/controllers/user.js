const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ip = require("ip");

const Person = require('../models/person');
const User = require('../models/user');
const Setting = require('../models/setting');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const person = new Person({
            firstname: req.body.firstname,
            lastname: req.body.lastname
          });
          person.save()
            .then(personResult => {
              console.log(personResult);
              const user = new User({
                email: req.body.email,
                password: hash,
                lastIp: ip.address(),
                licenseKey: (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase(),
                personId: personResult._id
              });
              user.save()
              .then(userResult => {
                console.log(userResult);
                const setting = new Setting({
                  client_id: userResult._id
                });
                setting.save().then(createdSetting => {
                  res.status(201).json({
                      message: 'User created!',
                      result: userResult
                  });
                })
                .catch(error => {
                    res.status(500).json({
                        message: error.message
                    });
                });
              })
              .catch(err => {
                res.status(500).json({
                    message: err.message
                });
              });
            })
          .catch(err => {
              res.status(500).json({
                  message: err.message
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
                    message: 'Auth failed no result'
                });
            }
            const token = jwt.sign({ email: fetchedUser.email, license: fetchedUser.licenseKey, userId: fetchedUser._id },
                process.env.JWT_KEY, { expiresIn: '12h' }
            );
            console.log(token);

            res.status(200).json({
                token: token,
                expiresIn: 43200, //3600,
                userId: fetchedUser._id,
                userEmail: fetchedUser.email,
                userLicense: fetchedUser.licenseKey
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
    const query = User.find().sort({ 'createdAt': 'desc' });

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
