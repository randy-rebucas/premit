const Setting = require('../models/setting');

exports.createSetting = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const setting = new Setting({
        key: req.body.key,
        value: req.body.value,
        section: req.body.section
    });
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
                message: 'Fetching patient failed!'
            });
        });
};

exports.deleteSettings = (req, res, next) => {
    Patient.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
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
