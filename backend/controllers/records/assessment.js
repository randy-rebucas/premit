const Assessment = require('../../models/records/assessment');
const moment = require('moment');

exports.create = (req, res, next) => {
    const assessment = new Assessment({
        created: req.body.created,
        complaintId: req.body.complaintId,
        patientId: req.body.patientId
    });
    assessmentData = req.body.diagnosis;
    for (let index = 0; index < assessmentData.length; index++) {
        assessment.diagnosis.push(assessmentData[index]);
    }
    treatmentData = req.body.treatments;
    for (let index = 0; index < treatmentData.length; index++) {
        assessment.treatments.push(treatmentData[index]);
    }
    assessment.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                assessment: {
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

    const assessment = new Assessment({
        _id: req.body.id,
        created: req.body.created,
        complaintId: req.body.complaintId,
        patientId: req.body.patientId
    });
    assessmentData = req.body.diagnosis;
    for (let index = 0; index < assessmentData.length; index++) {
        assessment.diagnosis.push(assessmentData[index]);
    }
    treatmentData = req.body.treatments;
    for (let index = 0; index < treatmentData.length; index++) {
        assessment.treatments.push(treatmentData[index]);
    }
    Assessment.updateOne({ _id: req.params.id }, //pass doctor role for restriction
            assessment
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
    const assessmentQuery = Assessment.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    let fetchedRecord;
    if (pageSize && currentPage) {
        assessmentQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    assessmentQuery
        .then(documents => {
            fetchedRecord = documents;
            return Assessment.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                assessments: fetchedRecord,
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
    Assessment.findById(req.params.id).then(complaint => {
            if (complaint) {
                res.status(200).json(complaint);
            } else {
                res.status(404).json({ message: 'complaint not found' });
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

    Assessment.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .then(assessment => {
            if (assessment) {
                res.status(200).json(assessment);
            } else {
                res.status(404).json({ message: 'assessment not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getLast = (req, res, next) => {
  Assessment.find({ 'patient': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .then(assessment => {
          if (assessment) {
              res.status(200).json(assessment);
          } else {
              res.status(404).json({ message: 'assessment not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.getByComplaint = (req, res, next) => {
  const today = moment().startOf('day');
    Assessment.find({
          complaintId: req.params.complaintId,
          created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
        })
        .limit(1)
        .then(assessment => {
            if (assessment) {
                res.status(200).json(assessment);
            } else {
                res.status(404).json({ message: 'assessment not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.delete = (req, res, next) => {
    Assessment.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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
