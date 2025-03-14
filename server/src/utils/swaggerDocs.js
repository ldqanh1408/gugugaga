// ================= BACKUP =============================


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
 * /api/v1/chats/{chatId}/messages:
 *   post:
 *     summary: Thêm một tin nhắn mới vào chat
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chat cần thêm tin nhắn
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: object
 *                 required:
 *                   - role
 *                   - text
 *                 properties:
 *                   role:
 *                     type: string
 *                     description: Vai trò của người gửi tin nhắn
 *                     enum: ["user", "assistant", "system"]
 *                     example: "user"
 *                   text:
 *                     type: string
 *                     description: Nội dung tin nhắn (tối đa 2000 ký tự)
 *                     maxLength: 2000
 *                     example: "Xin chào, bạn khỏe không?"
 *     responses:
 *       200:
 *         description: Thêm tin nhắn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: ["user", "assistant", "system"]
 *                     text:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             example:
 *               success: true
 *               message: "Thêm tin nhắn thành công"
 *       
 *       400:
 *         description: Thiếu hoặc sai thông tin đầu vào
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
 *                 message: "Vui lòng cung cấp đầy đủ thông tin message (role và text)"
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
 *                 message: "Không tìm thấy chat với ID đã cung cấp"
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
 *                 message: "Lỗi server khi thêm tin nhắn"
 *                 error: "Database connection failed"
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
