@echo off
set "BASE_DIR=%~dp0"

start "Llama Server" cmd /k "%BASE_DIR%llama.cpp\build\bin\llama-server.exe -m %BASE_DIR%your_model.gguf --gpu-layers xx --threads yy --port 8080"
start "Chatbot API" cmd /k python "%BASE_DIR%chatbot_api.py"
