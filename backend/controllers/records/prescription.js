const Prescription = require('../../models/records/prescription');

exports.create = (req, res, next) => {

    const prescription = new Prescription({
      complaint: req.body.complaint,
      created: req.body.created,
      patient: req.body.patient
    });
    prescriptionData = req.body.prescriptions;
    for (let index = 0; index < prescriptionData.length; index++) {
      prescription.prescriptions.push(prescriptionData[index]);
    }

    prescription.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                prescription: {
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
    const prescription = new Prescription({
      created: req.body.created,
      patient: req.body.patient
    });
    var new_array = [];
    prescriptionData = req.body.prescriptions;
    for (let index = 0; index < prescriptionData.length; index++) {
      new_array.push(prescriptionData[index].maintenableFlg);
      new_array.push(prescriptionData[index].maintenableFlg);
      new_array.push(prescriptionData[index].medicine);
      new_array.push(prescriptionData[index].preparation);
      new_array.push(prescriptionData[index].sig);
      new_array.push(prescriptionData[index].quantity);
    }
    prescription.prescriptions.push(new_array);
    // prescription.prescriptions.findByIdAndUpdate({ _id: req.params.id })
    Prescription.updateOne(
      { _id: req.params.id }, //pass doctor role for restriction
      // { "$set": { "requirement.$[outer].update.$[inner].number": 100000 } },
      // {
      //   "arrayFilters": [
      //     { "outer._id": mongoose.Types.ObjectId(req.params.versionID) },
      //     { "inner._id": mongoose.Types.ObjectId(req.params.versionNumID) }
      //   ]
      // },
      prescription
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
    const prescriptionQuery = Prescription.find({ 'patient': req.query.patient }).sort({'created': 'desc'});

    let fetchedRecord;
    if (pageSize && currentPage) {
      prescriptionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    prescriptionQuery
        .then(documents => {
            fetchedRecord = documents;
            return Prescription.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                prescriptions: fetchedRecord,
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
  Prescription.findById(req.params.id).then(prescription => {
            if (prescription) {
                res.status(200).json(prescription);
            } else {
                res.status(404).json({ message: 'prescription not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.delete = (req, res, next) => {
  Prescription.deleteOne({ _id: req.params.id }) //pass doctors role for restriction
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
