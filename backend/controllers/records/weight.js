const Weight = require('../../models/records/weight');
const moment = require('moment');

exports.create = (req, res, next) => {
    const weight = new Weight({
        weight: req.body.weight,
        created: req.body.created,
        patient: req.body.patient
    });
    weight.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                weight: {
                    ...createdRecord,
                    id: createdRecord._id,
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.update = (req, res, next) => {
    const weight = new Weight({
        _id: req.body.id,
        weight: req.body.weight,
        created: req.body.created_date,
        patient: req.body.patient_id
    });
    Weight.updateOne({ _id: req.params.id }, //pass doctor role for restriction
            weight
        ).then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Update successful!' });
            } else {
                res.status(401).json({ message: 'Not authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getAll = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const weightQuery = Weight.find({ 'patient': req.query.patient }).sort({ 'created': 'desc' });

    let fetchedRecord;
    if (pageSize && currentPage) {
        weightQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    weightQuery
        .then(documents => {
            fetchedRecord = documents;
            return Weight.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                weights: fetchedRecord,
                max: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.get = (req, res, next) => {
    Weight.findById(req.params.id).then(weight => {
            if (weight) {
                res.status(200).json(weight);
            } else {
                res.status(404).json({ message: 'weight not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getCurrent = (req, res, next) => {
  // { 'patient': req.params.patientId }
    const today = moment().startOf('day');

    Weight.find({
      patient: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .then(weight => {
            if (weight) {
                res.status(200).json(weight);
            } else {
                res.status(404).json({ message: 'weight not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getLast = (req, res, next) => {
  Weight.find({ 'patient': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .then(weight => {
          if (weight) {
              res.status(200).json(weight);
          } else {
              res.status(404).json({ message: 'weight not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.delete = (req, res, next) => {
    Weight.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Deletion successfull!' });
            } else {
                res.status(401).json({ message: 'Not Authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};
