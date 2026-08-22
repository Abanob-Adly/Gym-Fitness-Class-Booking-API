import { Types } from "mongoose";
import { ClassSession } from "../models/classSession.model";

const getTrainerDashboardStats = async (trainerId: string | Types.ObjectId) => {
  const targetTrainerId =
    typeof trainerId === "string" ? new Types.ObjectId(trainerId) : trainerId;

  const stats = await ClassSession.aggregate([
    {
      $match: {
        trainerId: targetTrainerId,
        isDeleted: false,
      },
    },
    {
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
        busiestClasses: [
          { $sort: { bookedSlots: -1 } },
          { $limit: 5 },
          {
            $project: {
              title: 1,
              capacity: 1,
              bookedSlots: 1,
              startTime: 1,
              attendanceRate: {
                $cond: [
                  { $eq: ["$capacity", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$bookedSlots", "$capacity"] },
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

  const metrics = stats[0]?.metrics[0] || {
    totalSessions: 0,
    totalCapacity: 0,
    totalBookedSlots: 0,
  };
  const busiestClasses = stats[0]?.busiestClasses || [];
  const overallAttendanceRate =
    metrics.totalCapacity > 0
      ? (metrics.totalBookedSlots / metrics.totalCapacity) * 100
      : 0;

  return {
    totalSessions: metrics.totalSessions,
    totalCapacity: metrics.totalCapacity,
    totalBookedSlots: metrics.totalBookedSlots,
    overallAttendanceRate: parseFloat(overallAttendanceRate.toFixed(2)),
    busiestClasses,
  };
};

export { getTrainerDashboardStats };
