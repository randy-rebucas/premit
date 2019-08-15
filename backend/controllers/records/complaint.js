const Complaint = require('../../models/records/complaint');

exports.create = (req, res, next) => {
    const complaint = new Complaint({
      complaint: req.body.complaint,
        created: req.body.created,
        patient: req.body.patient
    });
    complaint.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                complaint: {
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
    const complaint = new Complaint({
        _id: req.body.id,
        complaint: req.body.complaint,
        created: req.body.created_date,
        patient: req.body.patient_id
    });
    Complaint.updateOne({ _id: req.params.id }, //pass doctor role for restriction
      complaint
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
    const complaintQuery = Complaint.find({ 'patient': req.query.patient }).sort({'created': 'desc'});

    let fetchedRecord;
    if (pageSize && currentPage) {
      complaintQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    complaintQuery
        .then(documents => {
            fetchedRecord = documents;
            return Complaint.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                complaints: fetchedRecord,
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
  Complaint.findById(req.params.id).then(complaint => {
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

exports.delete = (req, res, next) => {
  Complaint.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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
