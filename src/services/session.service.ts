import { ClassSession } from '../models/classSession.model';
import { Booking } from '../models/booking.model';
import { ApiError } from '../utils/ApiError';

export const createSessionService = async (sessionData: any) => {
  return await ClassSession.create(sessionData);
};

export const updateSessionService = async (id: string, updateData: any, trainerId: string) => {
  const session = await ClassSession.findById(id);

  if (!session) throw new ApiError(404, "Session not found");
  if (session.trainerId.toString() !== trainerId.toString()) throw new ApiError(403, "You are not authorized to update this session");

  return await ClassSession.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteSessionService = async (id: string, trainerId: string) => {
  const session = await ClassSession.findById(id);
  const activeBookings = await Booking.countDocuments({ session: id, status: 'booked' });

  if (!session) throw new ApiError(404, "Session not found");
  if (session.trainerId.toString() !== trainerId.toString()) throw new ApiError(403, "You are not authorized to delete this session");
  if (activeBookings > 0) throw new ApiError(400, "Cannot delete session with active confirmed bookings");

  session.isDeleted = true;
  await session.save();
};
export const getSessionByIdService = async (sessionId: string) => {
  const session = await ClassSession.findById(sessionId);
  return session;
};
export const getAllSessionsService = async (queryData: any) => {
  const { page = '1', limit = '10' } = queryData;
  const skip = (Number(page) - 1) * Number(limit);

  const sessions = await ClassSession.find({ isDeleted: false })
    .skip(skip)
    .limit(Number(limit))
    .sort({ startTime: 1 });

  const totalItems = await ClassSession.countDocuments({ isDeleted: false });

  return {
    sessions,
    pagination: { 
      page: Number(page), 
      limit: Number(limit), 
      totalPages: Math.ceil(totalItems / Number(limit)), 
      totalItems 
    }
  };
};