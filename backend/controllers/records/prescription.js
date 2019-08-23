const Prescription = require('../../models/records/prescription');
const moment = require('moment');

exports.create = (req, res, next) => {

    const prescription = new Prescription({
      created: req.body.created,
      complaintId: req.body.complaintId
    });

    prescriptionData = req.body.prescriptions;
    for (let index = 0; index < prescriptionData.length; index++) {
      prescription.prescriptions.push(prescriptionData[index]);
    }

    prescription.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                prescription: {
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
    const prescription = new Prescription({
      _id: req.body.id,
      created: req.body.created,
      complaintId: req.body.complaintId
    });
    prescriptionData = req.body.prescriptions;
    for (let index = 0; index < prescriptionData.length; index++) {
      prescription.prescriptions.push(prescriptionData[index]);
    }

    Prescription.updateOne(
      { _id: req.params.id }, //pass doctor role for restriction
      prescription
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
    const prescriptionQuery = Prescription.find({ 'complaintId': req.query.complaintId }).sort({'created': 'desc'});

    let fetchedRecord;
    if (pageSize && currentPage) {
      prescriptionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    prescriptionQuery
        .then(documents => {
            fetchedRecord = documents;
            return Prescription.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                prescriptions: fetchedRecord,
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
  Prescription.findById(req.params.id).then(prescription => {
            if (prescription) {
                res.status(200).json(prescription);
            } else {
                res.status(404).json({ message: 'prescription not found' });
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

  Prescription.find({
          created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
      })
      .then(prescription => {
          if (prescription) {
              res.status(200).json(prescription);
          } else {
              res.status(404).json({ message: 'prescription not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.getLast = (req, res, next) => {
  Prescription.find({ 'patient': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .then(prescription => {
          if (prescription) {
              res.status(200).json(prescription);
          } else {
              res.status(404).json({ message: 'prescription not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.delete = (req, res, next) => {
  Prescription.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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
