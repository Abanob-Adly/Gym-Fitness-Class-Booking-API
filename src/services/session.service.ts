import { ClassSession } from "../models/classSession.model";
import { User } from "../models/user.model";
import { Booking } from "../models/booking.model";
import { ApiError } from "../utils/ApiError";
import { QueryFilter, Types } from "mongoose";

interface CreateSessionInput {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
}
interface SessionQuery {
  search?: string;
  trainerId?: string;
  trainerName?: string;
  date?: string;
  availableOnly?: string;
  page?: string;
  limit?: string;
}
type UpdateSessionInput = Partial<CreateSessionInput>;

const createSessionService = async (
  sessionData: CreateSessionInput,
  trainerId: Types.ObjectId,
) => {
  return await ClassSession.create({
    ...sessionData,
    trainerId: trainerId,
  });
};

const updateSessionService = async (
  id: string,
  updateData: UpdateSessionInput,
  trainerId: Types.ObjectId,
) => {
  const session = await ClassSession.findById(id);

  if (!session) throw new ApiError(404, "Session not found");
  if (session.trainerId.toString() !== trainerId.toString()) {
    throw new ApiError(403, "You are not authorized to update this session");
  }

  return await ClassSession.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteSessionService = async (id: string, trainerId: Types.ObjectId) => {
  const session = await ClassSession.findById(id);
  if (!session) throw new ApiError(404, "Session not found");

  if (session.trainerId.toString() !== trainerId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this session");
  }

  const activeBookings = await Booking.countDocuments({
    session: id,
    status: "booked",
  });

  if (activeBookings > 0) {
    throw new ApiError(400, "Cannot delete session with active bookings");
  }

  session.isDeleted = true;
  await session.save();
};

const getSessionByIdService = async (sessionId: string) => {
  const session = await ClassSession.findOne({
    _id: sessionId,
    isDeleted: false,
  });
  if (!session) throw new ApiError(404, "Session not found");
  return session;
};

const getAllSessionsService = async (queryData: SessionQuery) => {
  const {
    search,
    trainerId,
    trainerName,
    date,
    availableOnly,
    page = "1",
    limit = "10",
  } = queryData;

  const query: QueryFilter<typeof ClassSession> = { isDeleted: false };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (trainerId) {
    query.trainerId = trainerId;
  } else if (trainerName) {
    const matchingTrainers = await User.find({
      name: { $regex: trainerName, $options: "i" },
      role: "trainer",
    }).select("_id");

    const trainerIds = matchingTrainers.map((trainer) => trainer._id);
    query.trainerId = { $in: trainerIds };
  }

  if (date) {
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(searchDate.getDate() + 1);

    query.startTime = { $gte: searchDate, $lt: nextDay };
  }

  if (availableOnly === "true") {
    query.$expr = { $lt: ["$bookedSlots", "$capacity"] };
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const sessions = await ClassSession.find(query)
    .skip(skip)
    .limit(limitNumber)
    .sort({ startTime: 1 });

  const totalItems = await ClassSession.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limitNumber);

  return {
    sessions,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalItems,
    },
  };
};

export {
  createSessionService,
  updateSessionService,
  deleteSessionService,
  getSessionByIdService,
  getAllSessionsService,
};
