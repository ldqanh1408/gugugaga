# Check admin rights
$adminCheck = [System.Security.Principal.WindowsIdentity]::GetCurrent()
$adminRole = [System.Security.Principal.WindowsPrincipal]::new($adminCheck)
if (-not $adminRole.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Please run the script as Administrator!"
    exit
}

# Install Chocolatey if not present
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey not installed. Installing Chocolatey..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey is installed."
}

# Install CMake if not present
if (-not (Get-Command cmake -ErrorAction SilentlyContinue)) {
    Write-Host "CMake not installed. Installing CMake..."
    choco install cmake -y
} else {
    Write-Host "CMake is installed."
}

# Install Ninja if not present
if (-not (Get-Command ninja -ErrorAction SilentlyContinue)) {
    Write-Host "Ninja not installed. Installing Ninja..."
    choco install ninja -y
} else {
    Write-Host "Ninja is installed."
}

# Clone the llama.cpp repository if not present
$repoDir = ".\llama.cpp"
if (-not (Test-Path $repoDir)) {
    Write-Host "Cloning llama.cpp repository..."
    git clone https://github.com/ggerganov/llama.cpp.git
} else {
    Write-Host "llama.cpp repository already exists, skipping clone."
}

Write-Host "Building llama.cpp with CUDA support..."

Push-Location $repoDir

# Create build directory if it does not exist
if (-not (Test-Path ".\build")) {
    New-Item -ItemType Directory -Path ".\build" | Out-Null
}

Push-Location ".\build"

# Tìm kiếm vcvars64.bat trên tất cả các ổ đĩa FileSystem
$vcvarsPath = $null
$drives = Get-PSDrive -PSProvider FileSystem
foreach ($drive in $drives) {
    try {
        $found = Get-ChildItem -Path "$($drive.Root)" -Filter vcvars64.bat -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $vcvarsPath = $found.FullName
            break
        }
    } catch {
        # Bỏ qua lỗi truy cập nếu không có quyền đọc thư mục
    }
}

if (-not $vcvarsPath) {
    Write-Host "Error: vcvars64.bat not found. Please check your Visual Studio installation."
    exit
} else {
    Write-Host "Found vcvars64.bat at: $vcvarsPath"
}

# Tạo file batch tạm thời để thiết lập môi trường MSVC và build dự án
$tempBatchFile = "$env:TEMP\build_llama.bat"
$batchContent = @"
@echo off
rem Thiết lập môi trường Visual Studio và MSVC
call `"$vcvarsPath`" && ^
cmake .. -G Ninja -DCMAKE_BUILD_TYPE=Release -DLLAMA_CUDA=ON && ^
cmake --build .
"@
$batchContent | Set-Content -Path $tempBatchFile -Encoding ASCII

Write-Host "Configuring and building the project via batch file..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$tempBatchFile`"" -NoNewWindow -Wait

# Xóa file batch tạm thời sau khi build xong
Remove-Item $tempBatchFile -Force

Pop-Location
Pop-Location

Write-Host "Build complete! The executable can be found in llama.cpp\build\bin"
