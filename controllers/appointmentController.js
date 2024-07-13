const Appointment = require("../models/Appointment");
const mongoose = require('mongoose');

exports.getAppointments = async (req, res, next) => {
  try {
    // Initialize filter with userId
    let filter = { userId: new mongoose.Types.ObjectId(req.userData.userId) };
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default limit of 10 items per page

    // Calculate skip based on page and limit
    const skip = (page - 1) * limit;

    // Filter by title if provided
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: 'i' };
    }

    // Query appointments with pagination and sorting
    const totalAppointments = await Appointment.countDocuments(filter);

    const totalPages = Math.ceil(totalAppointments / limit);

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, startTime: -1 }) // Sort by date and startTime (desc)
      .skip(skip) // Skip records
      .limit(limit) // Limit number of records per page
      .populate('userId', 'name email');

    const response = {
      currentPage: page,
      totalPages: totalPages,
      appointments: appointments,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res, next) => {
  try {
    const { title, date, startTime, endTime, status } = req.body;
    const userId = req.userData.userId; // assuming you store userId in req.userData from authentication middleware

    const newAppointment = new Appointment({
      title,
      date,
      startTime,
      endTime,
      status,
      userId,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update an existing appointment
exports.updateAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { title, date, startTime, endTime, status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        $set: {
          title,
          date,
          startTime,
          endTime,
          status,
        },
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.appointmentId;

    await Appointment.findByIdAndDelete(appointmentId);

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
