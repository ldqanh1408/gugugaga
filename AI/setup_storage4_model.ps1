# Kiểm tra quyền admin
$adminCheck = [System.Security.Principal.WindowsIdentity]::GetCurrent()
$adminRole = [System.Security.Principal.WindowsPrincipal]::new($adminCheck)
if (-not $adminRole.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Please run the script as Administrator!"
    exit
}

# Kiểm tra nếu Python đã được cài đặt
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python not found. Downloading and installing..."
    Invoke-WebRequest -Uri "https://www.python.org/ftp/python/3.12.2/python-3.12.2-amd64.exe" -OutFile "python_installer.exe"
    Start-Process -FilePath "python_installer.exe" -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1" -NoNewWindow -Wait
    Remove-Item "python_installer.exe" -Force
}

# Kiểm tra lại Python sau khi cài đặt
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python installation failed. Please install Python manually."
    exit
}

# Kiểm tra phiên bản pip trước khi cập nhật
$installedPipVersion = python -m pip --version

# Thực hiện cập nhật pip và lưu kết quả
$pipUpdateResult = python -m pip install --upgrade pip | Select-String -Pattern "Successfully installed pip-([\d\.]+)"

# Kiểm tra nếu cập nhật thành công
if ($pipUpdateResult -and $pipUpdateResult.Matches.Count -gt 0) {
    $latestPipVersion = $pipUpdateResult.Matches[0].Groups[1].Value
    Write-Host "Upgrading pip from $installedPipVersion to $latestPipVersion..."
} else {
    Write-Host "pip is already up to date: $installedPipVersion"
}


# Danh sách các thư viện cần cài
$packages = @("fastapi", "uvicorn", "pydantic", "requests", "pymongo", "chromadb", "sentence-transformers")

# Kiểm tra và cài đặt các thư viện nếu chưa có
foreach ($package in $packages) {
    $isInstalled = python -m pip show $package
    if ($isInstalled) {
        Write-Host "$package is already installed, skipping..."
    } else {
        Write-Host "Installing $package..."
        python -m pip install $package
    }
}

# Kiểm tra mô hình SentenceTransformer trước khi tải
$embeddingModelPath = "$env:USERPROFILE\.cache\huggingface\transformers\all-MiniLM-L6-v2"
if (-not (Test-Path $embeddingModelPath)) {
    Write-Host "Downloading SentenceTransformer model..."
    python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
} else {
    Write-Host "SentenceTransformer model is already downloaded, skipping..."
}

Write-Host "Installation complete!"
