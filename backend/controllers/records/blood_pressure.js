const BloodPressure = require('../../models/records/blood_pressure');
const moment = require('moment');

exports.create = (req, res, next) => {
    const bp = new BloodPressure({
        systolic: req.body.systolic,
        diastolic: req.body.diastolic,
        heartrate: req.body.heartrate,
        created: req.body.created,
        patient: req.body.patient
    });
    bp.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                bp: {
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
    const bp = new BloodPressure({
        _id: req.body.id,
        systolic: req.body.systolic,
        diastolic: req.body.diastolic,
        heartrate: req.body.heartrate,
        created: req.body.created_date,
        patient: req.body.patient_id
    });
    BloodPressure.updateOne({ _id: req.params.id }, //pass doctor role for restriction
            bp
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
    const bpQuery = BloodPressure.find({ 'patient': req.query.patient }).sort({ 'created': 'desc' });

    let fetchedRecord;
    if (pageSize && currentPage) {
        bpQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    bpQuery
        .then(documents => {
            fetchedRecord = documents;
            return BloodPressure.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                bps: fetchedRecord,
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
    BloodPressure.findById(req.params.id).then(bp => {
            if (bp) {
                res.status(200).json(bp);
            } else {
                res.status(404).json({ message: 'bp not found' });
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

    BloodPressure.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .then(bp => {
            if (bp) {
                res.status(200).json(bp);
            } else {
                res.status(404).json({ message: 'bp not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.delete = (req, res, next) => {
    BloodPressure.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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