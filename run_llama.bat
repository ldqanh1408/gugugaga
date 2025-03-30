@echo off
start "Llama Server" cmd /k "E:\Repos\gagagugu\llama.cpp\build\bin\llama-server.exe -m E:\Repos\gagagugu\zephyr-7b-alpha.Q4_K_M.gguf --gpu-layers 40 --port 8090"