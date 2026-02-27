$WshShell = New-Object -comObject WScript.Shell

# 1. Startup Folder (Runs on boot)
$StartupPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\Antigravity Auto-Approve.lnk"
$Shortcut = $WshShell.CreateShortcut($StartupPath)
$Shortcut.TargetPath = "C:\Users\stani\.gemini\antigravity\scratch\antigravity-auto-approve\AutoApprove.exe"
$Shortcut.Description = "Auto-approves Antigravity prompts"
$Shortcut.WorkingDirectory = "C:\Users\stani\.gemini\antigravity\scratch\antigravity-auto-approve"
$Shortcut.Save()

# 2. Start Menu Programs (Visible in Search/Menu)
$ProgramsPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Antigravity Auto-Approve.lnk"
$Shortcut2 = $WshShell.CreateShortcut($ProgramsPath)
$Shortcut2.TargetPath = "C:\Users\stani\.gemini\antigravity\scratch\antigravity-auto-approve\AutoApprove.exe"
$Shortcut2.Description = "Launch Auto-Approve App"
$Shortcut2.WorkingDirectory = "C:\Users\stani\.gemini\antigravity\scratch\antigravity-auto-approve"
$Shortcut2.Save()

Write-Host "Shortcuts created in Startup AND Start Menu Programs"
