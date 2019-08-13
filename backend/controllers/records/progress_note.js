const Note = require('../../models/records/progress_note');

exports.create = (req, res, next) => {
    const note = new Note({
      note: req.body.note,
        created: req.body.created,
        patient: req.body.patient
    });
    note.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                note: {
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
    const note = new Note({
        _id: req.body.id,
        note: req.body.note,
        created: req.body.created_date,
        patient: req.body.patient_id
    });
    Note.updateOne({ _id: req.params.id }, //pass doctor role for restriction
      note
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
    const noteQuery = Note.find({ 'patient': req.query.patient });

    let fetchedRecord;
    if (pageSize && currentPage) {
      noteQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    noteQuery
        .then(documents => {
            fetchedRecord = documents;
            return Note.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                notes: fetchedRecord,
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
  Note.findById(req.params.id).then(note => {
            if (note) {
                res.status(200).json(note);
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
  Note.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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
