if ! command -v mongodump &> /dev/null
then
    echo "❌ MongoDB chưa được cài! Hãy tải MongoDB từ https://www.mongodb.com/try/download/community"
    exit 1
fi

mongodump --db Diary --out ./backup
    