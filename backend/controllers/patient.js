const Patient = require('../models/patient');

exports.createPatient = (req, res, next) => {
  const url = req.protocol + '://' +req.get('host');
  const patient = new Patient({
    firstname: req.body.firstname,
    midlename: req.body.midlename,
    lastname: req.body.lastname,
    contact: req.body.contact,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    address: req.body.address,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  patient.save().then(createdPatient => {
    res.status(201).json({
      message: 'Patient added successfully',
      post: {
        ...createdPatient,
        id: createdPatient._id,
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a patient failed!'
    });
  });
};

exports.updatePatient = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const patient = new Post({
    _id: req.body.id,
    firstname: req.body.firstname,
    midlename: req.body.midlename,
    lastname: req.body.lastname,
    contact: req.body.contact,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    address: req.body.address,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Patient.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    patient
  ).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Update successful!' });
    } else {
      res.status(401).json({ message: 'Not authorized!' });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Unable to update post!'
    });
  });
};

exports.getPatients = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const patientQuery = Patient.find();

  let fetchedPatients;
  if (pageSize && currentPage) {
    patientQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  patientQuery
    .then(documents => {
      fetchedPatients = documents;
      //return Post.count();
      return Patient.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Patient fetched successfully!',
        patients: fetchedPatients,
        maxPatients: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching patient failed!'
      });
    });
};

exports.getPatient = (req, res, next) => {
  Patient.findById(req.params.id).then(patient => {
    if(patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json({message: 'patient not found'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching patients failed!'
    });
  });
};

exports.deletePatient = (req, res, next) => {
  Patient.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: 'Deletion successfull!'});
    } else {
      res.status(401).json({message: 'Not Authorized!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching patients failed!'
    });
  });
};
