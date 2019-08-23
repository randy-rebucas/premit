const Note = require('../../models/records/progress_note');
const moment = require('moment');

exports.create = (req, res, next) => {
    const note = new Note({
      note: req.body.note,
        created: req.body.created,
        complaintId: req.body.complaintId
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
        complaintId: req.body.complaintId
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
    const noteQuery = Note.find({ 'complaintId': req.query.complaintId }).sort({'created': 'desc'});

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
                res.status(404).json({ message: 'note not found' });
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

  Note.find({
          created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
      })
      .then(note => {
          if (note) {
              res.status(200).json(note);
          } else {
              res.status(404).json({ message: 'note not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.getLast = (req, res, next) => {
  Note.find({ 'patient': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .then(note => {
          if (note) {
              res.status(200).json(note);
          } else {
              res.status(404).json({ message: 'note not found' });
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
