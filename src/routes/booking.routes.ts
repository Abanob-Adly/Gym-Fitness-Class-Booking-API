    import {Router} from "express";
    import {createBooking, cancelBooking, getMemberBookings, getSessionRoster}from "../controllers/booking.controller";
    import { protect, restrictTo } from "../middlewares/auth.middleware" ;

    /**
     * @swagger
     * tags:
     *   name: Bookings
     *   description: Class session booking management endpoints
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     CreateBookingInput:
     *       type: object
     *       required:
     *         - sessionId
     *       properties:
     *         sessionId:
     *           type: string
     *           description: ID of the class session to book
     *       example:
     *         sessionId: 64f1c2e5b5d6c9a1f8e4b123
     *     BookingResponse:
     *       type: object
     *       properties:
     *         success:
     *           type: boolean
     *         message:
     *           type: string
     *         data:
     *           $ref: '#/components/schemas/Booking'
     *     BookingListResponse:
     *       type: object
     *       properties:
     *         success:
     *           type: boolean
     *         message:
     *           type: string
     *         data:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/Booking'
     */

    const bookingRouter = Router();

    /**
     * @swagger
     * /api/bookings:
     *   post:
     *     tags: [Bookings]
     *     summary: Book a spot in a class session (member only)
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateBookingInput'
     *     responses:
     *       201:
     *         description: Booking created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BookingResponse'
     *       400:
     *         description: Session ID is required
     *       401:
     *         description: Not authenticated
     *       403:
     *         description: Not permitted (member role required)
     *       404:
     *         description: Session not found
     *       500:
     *         description: Some server error!
     */
    // member can book a spot in a session
    bookingRouter.post("/",protect,restrictTo("member"),createBooking);

    /**
     * @swagger
     * /api/bookings/{bookingId}/cancel:
     *   patch:
     *     tags: [Bookings]
     *     summary: Cancel a booked session (member only)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: bookingId
     *         schema:
     *           type: string
     *         required: true
     *         description: ID of the booking to cancel
     *     responses:
     *       200:
     *         description: Booking cancelled successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BookingResponse'
     *       401:
     *         description: Not authenticated
     *       403:
     *         description: Not permitted (member role required)
     *       404:
     *         description: Booking not found
     *       500:
     *         description: Some server error!
     */
    // member can cancel a booked session
    bookingRouter.patch("/:bookingId/cancel",protect,restrictTo("member"),cancelBooking);

    /**
     * @swagger
     * /api/bookings/my-bookings:
     *   get:
     *     tags: [Bookings]
     *     summary: Get the logged-in member's booking history
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Booking history fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BookingListResponse'
     *       401:
     *         description: Not authenticated
     *       403:
     *         description: Not permitted (member role required)
     *       500:
     *         description: Some server error!
     */
    // member can view his bookings
    bookingRouter.get("/my-bookings",protect,restrictTo("member"),getMemberBookings)

    /**
     * @swagger
     * /api/bookings/{sessionId}/roster:
     *   get:
     *     tags: [Bookings]
     *     summary: Get the list of bookings for a session (trainer only)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: sessionId
     *         schema:
     *           type: string
     *         required: true
     *         description: ID of the session to fetch the roster for
     *     responses:
     *       200:
     *         description: Session roster fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/BookingListResponse'
     *       401:
     *         description: Not authenticated
     *       403:
     *         description: Not permitted (trainer role required)
     *       404:
     *         description: Session not found
     *       500:
     *         description: Some server error!
     */
    // trainer can view bookings for his session
    bookingRouter.get("/:sessionId/roster",protect,restrictTo("trainer"),getSessionRoster)

    export default bookingRouter;