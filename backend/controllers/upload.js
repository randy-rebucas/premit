const IncomingForm = require('formidable').IncomingForm

exports.upload = (req, res, next) => {
  var form = new IncomingForm();
  form.uploadDir = 'attachments';
  form.keepExtensions = true;
  form.type = 'multipart';
  form.maxFieldsSize = 20 * 1024 * 1024;
  form.maxFileSize = 200 * 1024 * 1024;
  form.hash = true;
  form.on('file', (name, file) => {
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
    // console.log(file);
    console.log(file.path);
  //   size: 1261541,
  // path:
  //  'C:\\Users\\Randy\\AppData\\Local\\Temp\\upload_43b4bb7ea1f94efc94ead49a5ef1e135',
  // name: '889210.png',
  // type: 'image/png',
  });

  form.on('error', (err) => {
    console.log(err);
  });

  form.on('end', () => {
    res.json()
  });

  form.parse(req);
};
