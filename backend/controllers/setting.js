const Setting = require('../models/setting');

exports.createSetting = (req, res, next) => {
    const setting = new Setting({
        section: req.body.section
    });
    configData = req.body.config;
    for (let index = 0; index < configData.length; index++) {
        setting.config.push(configData[index]);
    }

    setting.save().then(createdSetting => {
            res.status(201).json({
                message: 'Setting added successfully',
                setting: {
                    ...createdSetting,
                    id: createdSetting._id,
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating a setting failed!'
            });
        });
};

exports.getSettings = (req, res, next) => {
    const settingQuery = Setting.find();

    let fetchedSettings;

    settingQuery
        .then(documents => {
            fetchedSettings = documents;
            return Setting.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Setting fetched successfully!',
                settings: fetchedSettings
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching pasettingtient failed!'
            });
        });
};

exports.getSetting = (req, res, next) => {
    Setting.find({ 'key': req.params.key }).then(setting => {
            if (setting) {
                console.log(setting);
                res.status(200).json(setting);
            } else {
                res.status(404).json({ message: 'setting not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching settings failed!'
            });
        });
};

exports.deleteSettings = (req, res, next) => {
    Setting.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Deletion successfull!' });
            } else {
                res.status(401).json({ message: 'Not Authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching patients failed!'
            });
        });
};