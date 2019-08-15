const RespiratoryRate = require('../../models/records/respiratory_rate');

exports.create = (req, res, next) => {
    const respiratoryrate = new RespiratoryRate({
        respiratoryrate: req.body.respiratoryrate,
        created: req.body.created,
        patient: req.body.patient
    });
    respiratoryrate.save().then(createdRecord => {
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
    const respiratoryrate = new RespiratoryRate({
        _id: req.body.id,
        respiratoryrate: req.body.respiratoryrate,
        created: req.body.created_date,
        patient: req.body.patient_id
    });
    RespiratoryRate.updateOne({ _id: req.params.id }, //pass doctor role for restriction
            respiratoryrate
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
    const resrateQuery = RespiratoryRate.find({ 'patient': req.query.patient }).sort({'created': 'desc'});

    let fetchedRecord;
    if (pageSize && currentPage) {
        resrateQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    resrateQuery
        .then(documents => {
            fetchedRecord = documents;
            return RespiratoryRate.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                rprs: fetchedRecord,
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
    RespiratoryRate.findById(req.params.id).then(respiratoryrate => {
            if (respiratoryrate) {
                res.status(200).json(respiratoryrate);
            } else {
                res.status(404).json({ message: 'respiratory rate not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.delete = (req, res, next) => {
    RespiratoryRate.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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
