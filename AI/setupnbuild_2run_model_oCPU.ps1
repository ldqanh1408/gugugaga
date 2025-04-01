# setup_and_build.ps1

$adminCheck = [System.Security.Principal.WindowsIdentity]::GetCurrent()
$adminRole = [System.Security.Principal.WindowsPrincipal]::new($adminCheck)
if (-not $adminRole.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Please run the script as Administrator!"
    exit
}

# Check and install Chocolatey if not installed
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey not installed. Installing Chocolatey..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey is already installed."
}

# Check if CMake is installed
if (-not (Get-Command cmake -ErrorAction SilentlyContinue)) {
    Write-Host "CMake not installed. Installing CMake via Chocolatey..."
    choco install cmake -y
} else {
    Write-Host "CMake is already installed."
}

# Check if Ninja is installed
if (-not (Get-Command ninja -ErrorAction SilentlyContinue)) {
    Write-Host "Ninja not installed. Installing Ninja via Chocolatey..."
    choco install ninja -y
} else {
    Write-Host "Ninja is already installed."
}

# Clone llama.cpp repository if not already cloned
$repoDir = ".\llama.cpp"
if (-not (Test-Path $repoDir)) {
    Write-Host "Cloning llama.cpp repository..."
    git clone https://github.com/ggerganov/llama.cpp.git
} else {
    Write-Host "llama.cpp repository already exists, skipping clone."
}

# Build the llama.cpp project
Write-Host "Building the llama.cpp project..."

Push-Location $repoDir

# Create build directory if not exists
if (-not (Test-Path ".\build")) {
    New-Item -ItemType Directory -Path ".\build" | Out-Null
}

Push-Location ".\build"

Write-Host "Configuring project with CMake and Ninja..."
cmake .. -G Ninja

Write-Host "Building project..."
cmake --build .

Pop-Location
Pop-Location

Write-Host 'Build complete! You can find the executable in llama.cpp\build\bin'
