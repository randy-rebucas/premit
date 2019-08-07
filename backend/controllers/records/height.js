const Height = require('../../models/records/height');

exports.create = (req, res, next) => {
    const height = new Height({
        height: req.body.height,
        created: req.body.created_date,
        patient: req.body.patient_id
    });
    height.save().then(created => {
            res.status(201).json({
                message: 'Successfully added',
                height: {
                    ...created,
                    id: created._id,
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Failed!'
            });
        });
};

exports.update = (req, res, next) => {
    const height = new Height({
        _id: req.body.id,
        height: req.body.height,
        created: req.body.created_date,
        patient: req.body.patient_id
    });
    Height.updateOne({ _id: req.params.id }, //pass doctor role for restriction
            height
        ).then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Update successful!' });
            } else {
                res.status(401).json({ message: 'Not authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Unable to update this record!'
            });
        });
};

exports.getAll = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const heightQuery = Height.find();

    let fetchedRecord;
    if (pageSize && currentPage) {
        heightQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    heightQuery
        .then(documents => {
            fetchedRecord = documents;
            return Height.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                heights: fetchedRecord,
                max: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching failed!'
            });
        });
};

exports.get = (req, res, next) => {
    Height.findById(req.params.id).then(height => {
            if (height) {
                res.status(200).json(height);
            } else {
                res.status(404).json({ message: 'height not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching failed!'
            });
        });
};

exports.delete = (req, res, next) => {
    Height.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Deletion successfull!' });
            } else {
                res.status(401).json({ message: 'Not Authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching failed!'
            });
        });
};