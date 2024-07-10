const Appointment = require("../models/Appointment");

// Get all appointments
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
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
