const Histories = require('../../models/records/histories');
const moment = require('moment');

exports.create = (req, res, next) => {
    const history = new Histories({
        type: req.body.type,
        description: req.body.description,
        created: req.body.created,
        patient: req.body.patient
    });
    history.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                history: {
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
    const history = new Histories({
        _id: req.body.id,
        type: req.body.type,
        description: req.body.description,
        created: req.body.created_date,
        patient: req.body.patient_id
    });
    Histories.updateOne({ _id: req.params.id }, //pass doctor role for restriction
      history
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
    const historyQuery = Histories.find({ 'patient': req.query.patient }).sort({'created': 'desc'});

    let fetchedRecord;
    if (pageSize && currentPage) {
      historyQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    historyQuery
        .then(documents => {
            fetchedRecord = documents;
            return Histories.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                histories: fetchedRecord,
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
  Histories.findById(req.params.id).then(history => {
            if (history) {
                res.status(200).json(history);
            } else {
                res.status(404).json({ message: 'history not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getCurrent = (req, res, next) => {
  const today = moment().startOf('day');
  //addpatient id
  Histories.find({
    patient: req.params.patientId,
          created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
      })
      .then(history => {
          if (history) {
              res.status(200).json(history);
          } else {
              res.status(404).json({ message: 'history not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.getLast = (req, res, next) => {
  Histories.find({ 'patient': req.params.patientId })
      .limit(2)
      .sort({ 'created': 'desc' })
      .then(history => {
          if (history) {
              res.status(200).json(history);
          } else {
              res.status(404).json({ message: 'history not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.delete = (req, res, next) => {
  Histories.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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
