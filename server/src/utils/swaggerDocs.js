

/**
 * @swagger
 * api/v1/backup/export/dump:
 *   get:
 *     summary: Tạo file dump (backup) của cơ sở dữ liệu MongoDB
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Backup database được khởi tạo (không đảm bảo hoàn thành)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "backup success"
 *       500:
 *         description: Lỗi server khi tạo dump
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "Lỗi khi tạo file dump."
 */

/**
 * @swagger
 * /api/v1/backup/import/dump:
 *   get:
 *     summary: Khôi phục (restore) cơ sở dữ liệu từ file dump
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Restore dữ liệu được khởi tạo (không đảm bảo hoàn thành)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "✅ Restore dữ liệu thành công!"
 *       500:
 *         description: Lỗi server khi restore dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "❌ Lỗi khi restore dữ liệu: mongorestore command failed"
 */




// ================= Journals =============================

/**
 * @swagger
 * /api/v1/journals/{journalId}/consecutive-days:
 *   get:
 *     summary: Lấy số ngày liên tiếp có ghi chép trong nhật ký
 *     description: Kiểm tra số ngày liên tiếp mà người dùng đã ghi chép trong journal.
 *     tags:
 *       - Journal
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhật ký cần kiểm tra
 *         example: "660abc123def456ghi789jkl"
 *     responses:
 *       200:
 *         description: Trả về số ngày ghi chép liên tiếp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 consecutiveDays:
 *                   type: integer
 *                   description: Số ngày liên tiếp có ghi chép
 *                   example: 5
 *       404:
 *         description: Không tìm thấy nhật ký
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy journal"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi server khi lấy số ngày liên tiếp"
 */


/**
 * @swagger
 * /api/v1/journals/{journalId}/notes:
 *   get:
 *     summary: Lấy notes của một journal
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journal cần lấy notes
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Lấy notes thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - mood
 *                   - header
 *                   - text
 *                 properties:
 *                   mood:
 *                     type: string
 *                     enum: ["happy", "sad", "neutral", "excited", "angry"]
 *                     example: "happy"
 *                   header:
 *                     type: string
 *                     example: "Ngày tuyệt vời!"
 *                   text:
 *                     type: string
 *                     example: "Hôm nay tôi cảm thấy rất vui..."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-11T10:00:00Z"
 *             example:
 *               - mood: "happy"
 *                 header: "Ngày tuyệt vời!"
 *                 text: "Hôm nay tôi cảm thấy rất vui..."
 *                 createdAt: "2025-03-11T10:00:00Z"
 *               - mood: "sad"
 *                 header: "Ngày buồn"
 *                 text: "Mọi thứ không như mong đợi..."
 *                 createdAt: "2025-03-11T12:00:00Z"
 *       400:
 *         description: Thiếu journalId trong request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Vui lòng cung cấp journalId"
 *       404:
 *         description: Không tìm thấy journal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Không tìm thấy journal với ID đã cung cấp"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 message: "Lỗi server khi lấy notes"
 *                 error: "Database connection failed"
 */


/**
 * @swagger
 * /api/v1/journal/{journalId}/note/{noteId}:
 *   patch:
 *     summary: Cập nhật một ghi chú trong journal
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của journal chứa note
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của note cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: object
 *                 required:
 *                   - mood
 *                   - header
 *                   - text
 *                 properties:
 *                   mood:
 *                     type: string
 *                     enum: ["happy", "sad", "neutral", "excited", "angry"]
 *                     example: "happy"
 *                   header:
 *                     type: string
 *                     example: "Một ngày đẹp trời"
 *                   text:
 *                     type: string
 *                     example: "Hôm nay tôi có một ngày tuyệt vời..."
 *     responses:
 *       200:
 *         description: Sửa note thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy journal hoặc note
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/v1/journal/{journalId}/notes:
 *   post:
 *     summary: Thêm ghi chú mới vào journal
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của journal cần thêm note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: object
 *                 required:
 *                   - mood
 *                   - header
 *                   - text
 *                 properties:
 *                   mood:
 *                     type: string
 *                     enum: ["happy", "sad", "neutral", "excited", "angry"]
 *                     example: "happy"
 *                   header:
 *                     type: string
 *                     example: "Một ngày đẹp trời"
 *                   text:
 *                     type: string
 *                     example: "Hôm nay tôi có một ngày tuyệt vời..."
 *     responses:
 *       201:
 *         description: Thêm note thành công
 *       400:
 *         description: Thiếu dữ liệu đầu vào
 *       404:
 *         description: Không tìm thấy journal
 *       500:
 *         description: Lỗi máy chủ
 */


/**
 * @swagger
 * /api/v1/journals/{journalId}/notes/{noteId}:
 *   delete:
 *     summary: Xóa một note trong journal
 *     description: Xóa một note dựa trên journalId và noteId
 *     tags:
 *       - Journal
 *     parameters:
 *       - name: journalId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Journal chứa note
 *       - name: noteId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Note cần xóa
 *     responses:
 *       200:
 *         description: Xóa note thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã xóa thành công"
 *       400:
 *         description: Thiếu thông tin hoặc ID không hợp lệ
 *       404:
 *         description: Không tìm thấy Journal hoặc Note
 *       500:
 *         description: Lỗi máy chủ
 */



/**
 * @swagger
 * /api/v1/journals/{journalId}/entries:
 *   get:
 *     summary: Lấy danh sách ngày có ghi chú trong journal
 *     tags: [Journal]
 *     description: |
 *       API này trả về danh sách các ngày có ghi chú (`note`) trong một journal nhất định.
 *       Ngày trả về theo định dạng `YYYY-MM-DD`, không lặp lại.
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journal cần lấy danh sách ngày có ghi chú.
 *     responses:
 *       200:
 *         description: Trả về danh sách ngày có ghi chú.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "2024-03-11"
 *       404:
 *         description: Không tìm thấy journal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy journal"
 *       500:
 *         description: Lỗi máy chủ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ, thử lại sau"
 */



// ================= Chat =============================

/**
 * @swagger
 * /api/v1/chats/{chatId}/messages/{messageId}:
 *   delete:
 *     summary: Xóa một message trong chat
 *     tags: 
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc trò chuyện
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example: 
 *                  success: true
 *                  message: Xóa message thành công
 *       400:
 *         description: Thiếu thông tin đầu vào
 *       404:
 *         description: Không tìm thấy chat hoặc message
 *       500:
 *         description: Lỗi máy chủ
 */



/**
 * @swagger
 * /api/v1/chats/{chatId}/messages/{messageId}:
 *   patch:
 *     summary: Cập nhật nội dung của một message trong chat
 *     tags: 
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc trò chuyện
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: object
 *                 example: 
 *                   text: "Chào bạn"
 *                   role: "ai"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Thiếu thông tin hoặc dữ liệu cập nhật rỗng
 *       404:
 *         description: Không tìm thấy chat hoặc message
 *       500:
 *         description: Lỗi máy chủ
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - role
 *         - text
 *       properties:
 *         role:
 *           type: string
 *           enum: [user, ai]
 *           description: Vai trò của tin nhắn
 *           example: "user"
 *         text:
 *           type: string
 *           description: Nội dung tin nhắn
 *           minLength: 1
 *           maxLength: 2000
 *           example: "Xin chào, bạn khỏe không?"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tin nhắn được tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tin nhắn được cập nhật
 */


/**
 * @swagger
 * /api/v1/chats/{chatId}/messages:
 *   post:
 *     summary: Thêm tin nhắn vào cuộc trò chuyện
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc trò chuyện
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 $ref: "#/components/schemas/Message"
 *     responses:
 *       200:
 *         description: Tin nhắn đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   $ref: "#/components/schemas/Message"
 *       400:
 *         description: Dữ liệu không hợp lệ (thiếu chatId hoặc thông tin tin nhắn)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 400
 *                     message:
 *                       type: string
 *                       example: "Vui lòng cung cấp đầy đủ thông tin message (role và text)"
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 404
 *                     message:
 *                       type: string
 *                       example: "Không tìm thấy chat với ID đã cung cấp"
 *       500:
 *         description: Lỗi server khi thêm tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 500
 *                     message:
 *                       type: string
 *                       example: "Lỗi server khi thêm tin nhắn"
 *                     details:
 *                       type: string
 *                       example: "Error stack trace or more information"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của cuộc trò chuyện
 *           example: "6610d1f9c6b1b2a3d4e5f6g7"
 *         userId:
 *           type: string
 *           description: ID của người dùng sở hữu cuộc trò chuyện
 *           example: "660abc123def456ghi789jkl"
 *         messages:
 *           type: array
 *           description: Danh sách tin nhắn trong cuộc trò chuyện (tối đa 1000 tin nhắn)
 *           maxItems: 1000
 *           items:
 *             $ref: "#/components/schemas/Message"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cuộc trò chuyện được tạo
 *           example: "2025-03-31T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cuộc trò chuyện được cập nhật gần nhất
 *           example: "2025-03-31T15:00:00.123Z"
 */


/**
 * @swagger
 * /api/v1/chats/{chatId}/messages:
 *   get:
 *     summary: Lấy danh sách tin nhắn của một chat
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chat cần lấy tin nhắn
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Lấy tin nhắn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *             example:
 *               success: true
 *               messages:
 *                 - content: "Xin chào"
 *                   createdAt: "2025-03-11T10:00:00Z"
 *       400:
 *         description: Thiếu hoặc sai chatId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Vui lòng cung cấp chatId hợp lệ"
 *       401:
 *         description: Người dùng chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Người dùng chưa xác thực"
 *       403:
 *         description: Người dùng không có quyền truy cập chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Bạn không có quyền truy cập chat này"
 *       404:
 *         description: Không tìm thấy chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Chat không tồn tại"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Lỗi server khi lấy tin nhắn"
 *                 error: "Database connection failed"
 */


// ================= Authentication =============================

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     description: Xóa token khỏi cookie để đăng xuất người dùng.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 *       400:
 *         description: Lỗi khi đăng xuất
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra khi đăng xuất"
 */



/**
 * @swagger
 * /api/v1/get-token:
 *   get:
 *     summary: Lấy token từ cookie
 *     description: API này lấy token của người dùng từ cookie nếu có.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       404:
 *         description: Không tìm thấy token trong cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token not found"
 *                 token:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */


/**
 * @swagger
 * /api/v1/check-auth:
 *   get:
 *     summary: Kiểm tra trạng thái đăng nhập
 *     description: API này xác minh xem người dùng có đăng nhập hay không bằng cách kiểm tra token trong cookie.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Người dùng đã đăng nhập hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "660a7f9b4e0a7b001c3f5f8a"
 *                     userName:
 *                       type: string
 *                       example: "john_doe"
 *                     journalId:
 *                       type: string
 *                       example: "660b7e1a4e0a7b001c3f5f9b"
 *                     chatId:
 *                       type: string
 *                       example: "660b7f9c4e0a7b001c3f5fa1"
 *       401:
 *         description: Người dùng chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Chưa đăng nhập"
 */


/**
 * @swagger
 * /api/v1/change-password:
 *   post:
 *     summary: Đổi mật khẩu người dùng
 *     description: API này cho phép người dùng đổi mật khẩu bằng cách nhập mật khẩu hiện tại và mật khẩu mới.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đổi mật khẩu thành công"
 *       400:
 *         description: Thiếu thông tin hoặc không tìm thấy user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Thiếu thông tin"
 *       401:
 *         description: Người dùng chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chưa đăng nhập"
 *       404:
 *         description: Mật khẩu không khớp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu không khớp"
 */


/**
 * @swagger
 * /api/v1/me:
 *   get:
 *     summary: Lấy thông tin người dùng từ token
 *     description: API dùng để xác thực người dùng dựa trên token được lưu trong cookie.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "660abc123def456ghi789jkl"
 *                 journalId:
 *                   type: string
 *                   example: "660xyz123uvw456rst789opq"
 *                 chatId:
 *                   type: string
 *                   example: "660chat123uvw456rst789xyz"
 *                 userName:
 *                   type: string
 *                   example: "john_doe"
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chưa đăng nhập"
 */



/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - userName
 *               - password
 *             properties:
 *               account:
 *                 type: string
 *                 example: "newuser123"
 *               userName:
 *                 type: string
 *                 example: "New User"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */



/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - password
 *             properties:
 *               account:
 *                 type: string
 *                 example: "newuser123"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token được lưu vào cookie  (có thể get bằng api)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *       400:
 *         description: Sai tài khoản hoặc mật khẩu
 *       500:
 *         description: Lỗi máy chủ
 */


// ========================= USERS ==============================

/**
 * @swagger
 * /api/v1/user/upload-profile/{userId}:
 *   post:
 *     summary: Cập nhật hồ sơ người dùng
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickName:
 *                 type: string
 *                 example: "john_doe"
 *               userName:
 *                 type: string
 *                 example: "johndoe123"
 *               bio:
 *                 type: string
 *                 example: "Fullstack developer"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1995-08-21"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               phone:
 *                 type: string
 *                 example: "+84123456789"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Hồ sơ đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "✅ Hồ sơ đã được cập nhật thành công."
 *                 profile:
 *                   type: object
 *                   properties:
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     nickName:
 *                       type: string
 *                       example: "john_doe"
 *                     userName:
 *                       type: string
 *                       example: "johndoe123"
 *                     bio:
 *                       type: string
 *                       example: "Fullstack developer"
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: "1995-08-21"
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                       example: "male"
 *                     phone:
 *                       type: string
 *                       example: "+84123456789"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *       404:
 *         description: Người dùng không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "❌ Người dùng không tồn tại."
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */



/**
 * @swagger
 * /api/v1/user/load-profile/{userId}:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin hồ sơ người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   type: object
 *                   properties:
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     nickName:
 *                       type: string
 *                       example: "john_doe"
 *                     userName:
 *                       type: string
 *                       example: "johndoe123"
 *                     bio:
 *                       type: string
 *                       example: "Fullstack developer"
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: "1995-08-21"
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                       example: "male"
 *                     phone:
 *                       type: string
 *                       example: "+84123456789"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     avatarPreview:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Người dùng không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "❌ Người dùng không tồn tại."
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     description: Trả về danh sách tất cả người dùng trong hệ thống.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67d26a67661876dfc30438ad"
 *                       account:
 *                         type: string
 *                         example: "Ka"
 *                       password:
 *                         type: string
 *                         example: "$2b$10$IreAuOQS3Ohg/g4S0aoJT.7mHHS5eki..gRt2COOpUYWPDXi/BCS2"
 *                       userName:
 *                         type: string
 *                         example: "Ka"
 *                       chatId:
 *                         type: string
 *                         example: "67d26a67661876dfc30438ab"
 *                       journalId:
 *                         type: string
 *                         example: "67d26a67661876dfc30438ac"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-13T05:17:27.395Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-13T05:17:27.395Z"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       404:
 *         description: Không có người dùng nào trong hệ thống.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Danh sách rỗng"
 *       500:
 *         description: Lỗi server khi lấy danh sách người dùng.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi server"
 */






/**
 * @swagger
 * /api/v1/users/{userId}:
 *   delete:
 *     summary: Xóa người dùng
 *     description: Xóa một người dùng dựa trên userId.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID của người dùng cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "✅ Xóa người dùng thành công."
 *       404:
 *         description: Người dùng không tồn tại.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "❌ Người dùng không tồn tại."
 *       500:
 *         description: Lỗi server khi xóa người dùng.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi server khi xóa người dùng."
 */
