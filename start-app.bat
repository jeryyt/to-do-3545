@echo off
echo Starting Todo App...
echo.

echo Starting Server on port 5000...
start "Todo Server" cmd /k "cd server && npm start"

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Starting Client on port 3000...
start "Todo Client" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause > nul
