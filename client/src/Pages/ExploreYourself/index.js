const ExploreYourselfPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateInput = () => {
    if (!title?.trim()) {
      toast.error("Vui lòng nhập tiêu đề thư");
      return false;
    }
    if (!content?.trim()) {
      toast.error("Vui lòng nhập nội dung thư");
      return false;
    }
    if (!selectedDate) {
      toast.error("Vui lòng chọn ngày nhận thư");
      return false;
    }
    return true;
  };

  const handleSendMail = async () => {
    try {
      if (!validateInput()) return;
      
      setIsLoading(true);
      setError(null);
      
      const payload = await getPayLoad();
      if (!payload?._id) {
        throw new Error("Không thể xác thực người dùng");
      }

      const mailData = {
        title: title.trim(),
        content: content.trim(),
        sendDate: new Date(),
        receiveDate: selectedDate,
      };

      const result = await addFutureMail(payload._id, mailData);
      
      if (result.success) {
        setTitle("");
        setContent("");
        setSelectedDate(null);
        toast.success("Gửi thư thành công!");
      } else {
        throw new Error(result.message || "Có lỗi xảy ra khi gửi thư");
      }
    } catch (error) {
      console.error("Lỗi khi gửi thư:", error);
      setError(error.message);
      toast.error(error.message || "Có lỗi xảy ra khi gửi thư. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // UI render code...
  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSendMail();
      }}>
        // ...existing form code...
        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? "loading" : ""}
        >
          {isLoading ? "Đang gửi..." : "Gửi thư"}
        </button>
      </form>
    </div>
  );
};