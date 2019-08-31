const IncomingForm = require('formidable').IncomingForm
const Upload = require('../models/upload');
const moment = require('moment');

exports.getAll = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const fileQuery = Upload.find({ 'patient': req.query.patient });

  let fetchedRecord;
  if (pageSize && currentPage) {
    fileQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  fileQuery
      .then(documents => {
          fetchedRecord = documents;
          return Upload.countDocuments();
      })
      .then(count => {
          res.status(200).json({
              message: 'Fetched successfully!',
              files: fetchedRecord,
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
  console.log(req.params);
  Upload.findById(req.params.id).then(file => {
          if (file) {
              res.status(200).json(file);
          } else {
              res.status(404).json({ message: 'file not found' });
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

  Upload.find({
          created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
      })
      .then(file => {
          if (file) {
              res.status(200).json(file);
          } else {
              res.status(404).json({ message: 'file not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

/**
 * @param complaintId
 * @since v1
 */
exports.getByComplaint = (req, res, next) => {
  Upload.find({
        complaintId: req.params.complaintId
      })
      .then(file => {
          if (file) {
              res.status(200).json(file);
          } else {
              res.status(404).json({ message: 'file not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.upload = (req, res, next) => {
  var form = new IncomingForm();
  form.uploadDir = 'attachments';
  form.keepExtensions = true;
  form.type = 'multipart';
  form.maxFieldsSize = 20 * 1024 * 1024; //10mb
  form.maxFileSize = 200 * 1024 * 1024;
  form.hash = true;
  form.multiples = false;
  form.on('field', function(name, value) {
    // console.log(name + ': ' + value);
  });

  form.on('file', (name, file) => {
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
  });

  form.on('error', (err) => {
    console.log(err);
  });

  form.on('end', () => {
    res.json()
  });

  form.parse(req, function(err, fields, files) {
    // console.log(req.body);
    // console.log(fields.patient);
    // console.log(files.file.path);
    const url = req.protocol + '://' + req.get('host');
    const upload = new Upload({
      path: url + '/' + files.file.path,
      name: files.file.name,
      type: files.file.type,
      patient: fields.patient,
      clientId: fields.clientId,
      complaintId: fields.complaintId
    });
    upload.save();

  });
};


exports.delete = (req, res, next) => {
  Upload.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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
