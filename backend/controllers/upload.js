const IncomingForm = require('formidable').IncomingForm
const Upload = require('../models/upload');

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

exports.upload = (req, res, next) => {
  //console.log(req.body);

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
    // console.log(file.path);
    // console.log(file.size);
    // console.log(file.name);
    // console.log(file.type);
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
      clientId: fields.clientId
    });
    upload.save();

  });
};
