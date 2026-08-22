import { Types } from "mongoose";
import { ClassSession } from "../models/classSession.model";

const getTrainerDashboardStats = async (trainerId: Types.ObjectId) => {
  const stats = await ClassSession.aggregate([
    {
      $match: {
        trainerId: trainerId,
        isDeleted: false,
      },
      $facet: {
        metrics: [
          {
            $group: {
              _id: null,
              totalSessions: { $sum: 1 },
              totalCapacity: { $sum: "$capacity" },
              totalBookedSlots: { $sum: "$bookedSlots" },
            },
          },
        ],
        busisestClasses: [
          { $sort: { bookedSlots: -1 } },
          { $limit: 5 },
          {
            $project: {
              title: 1,
              capacity: 1,
              bookedSlots: 1,
              startTime: 1,
              attendanceRate: {
                $con: [
                  { $eq: ["$capacity", 0] },
                  0,
                  {
                    $multiply: [
                      { $devide: ["$capacity", "$bookedSlots"] },
                      100,
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ]);

  const metrics = stats[0].metrics[0] || {
    totalSessions: 0,
    totalCapacity: 0,
    totalBookedSlots: 0,
  };
  const busisestClasses = stats[0].busisestClasses || [];
  const overallAttendaceRate =
    metrics.totalCapacity > 0
      ? (metrics.totalBookedSlots / metrics.totalCapacity) * 100
      : 0;

  return {
    totalSessions: metrics.totalSessions,
    totalCapacity: metrics.totalCapacity,
    totalBookedSlots: metrics.totalBookedSlots,
    overallAttendaceRate: parseFloat(overallAttendaceRate.toFixed(2)),
    busisestClasses,
  };
};

export { getTrainerDashboardStats };
