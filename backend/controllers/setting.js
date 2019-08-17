const Setting = require('../models/setting');

exports.createSetting = (req, res, next) => {
    const setting = new Setting({
      license_key: req.body.license,
      clinic_name: req.body.name,
      clinic_owner: req.body.owner,
      clinic_address: req.body.address,
      clinic_url: req.body.url,
      clinic_email: req.body.email,
      prc: req.body.prc,
      ptr: req.body.ptr,
      s2: req.body.s2
    });
    phoneData = req.body.phones;
    for (let index = 0; index < phoneData.length; index++) {
        setting.clinic_phone.push(phoneData[index]);
    }
    hourData = req.body.hours;
    for (let index = 0; index < hourData.length; index++) {
        setting.clinic_hours.push(hourData[index]);
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

exports.update = (req, res, next) => {
  const setting = new Setting({
    _id: req.body.id,
    client_id: req.body.client_id,
    clinic_name: req.body.name,
    clinic_owner: req.body.owner,
    clinic_address: req.body.address,
    clinic_url: req.body.url,
    clinic_email: req.body.email,
    prc: req.body.prc,
    ptr: req.body.ptr,
    s2: req.body.s2
  });
  phoneData = req.body.phones;
  for (let index = 0; index < phoneData.length; index++) {
      setting.clinic_phone.push(phoneData[index]);
  }
  hourData = req.body.hours;
  for (let index = 0; index < hourData.length; index++) {
      setting.clinic_hours.push(hourData[index]);
  }
  Setting.updateOne({ _id: req.params.id },
    setting
      ).then(result => {
          if (result.n > 0) {
              res.status(200).json({ message: 'Settings update successful!' });
          } else {
              res.status(401).json({ message: 'Not authorized!' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: 'Unable to update settings!'
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
    Setting.find({ 'client_id': req.params.key }).then(setting => {
            if (setting) {
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
