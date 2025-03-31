@echo off
set "BASE_DIR=%~dp0"

start "Llama Server" cmd /k "%BASE_DIR%llama.cpp\build\bin\llama-server.exe -m %BASE_DIR%"NAME_MODEL" --gpu-layers xx --threads yy --port 8080"
start "Chroma Service" cmd /k python "%BASE_DIR%chatbot_api.py"
