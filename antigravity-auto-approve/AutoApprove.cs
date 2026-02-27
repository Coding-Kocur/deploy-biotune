using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Threading;
using System.Text;

namespace AntigravityAutoApprove
{
    public class AutoApproveContext : ApplicationContext
    {
        private NotifyIcon trayIcon;
        private System.Windows.Forms.Timer scanTimer;
        private bool isEnabled = true;
        private DateTime lastTrigger = DateTime.MinValue;

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

        [DllImport("user32.dll")]
        private static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, int dwExtraInfo);

        [DllImport("user32.dll")]
        private static extern bool SetCursorPos(int X, int Y);

        [DllImport("user32.dll")]
        private static extern bool GetCursorPos(out POINT lpPoint);

        [DllImport("user32.dll")]
        private static extern IntPtr GetFocus();

        [DllImport("user32.dll")]
        private static extern IntPtr SetFocus(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, IntPtr lpdwProcessId);

        [DllImport("user32.dll")]
        private static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

        [DllImport("kernel32.dll")]
        private static extern uint GetCurrentThreadId();

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        [StructLayout(LayoutKind.Sequential)]
        public struct POINT { public int X; public int Y; }

        private const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        private const uint MOUSEEVENTF_LEFTUP = 0x0004;
        private const uint MOUSEEVENTF_WHEEL = 0x0800;

        // Antigravity's EXACT Accept button colors (from screenshot analysis)
        // Blue Accept button: approximately RGB(59, 130, 246) - Tailwind blue-500
        // Green Accept button: approximately RGB(34, 197, 94) - Tailwind green-500

        public AutoApproveContext()
        {
            trayIcon = new NotifyIcon()
            {
                Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath),
                ContextMenuStrip = CreateContextMenu(),
                Visible = true,
                Text = "Auto-Approve: ON"
            };

            trayIcon.DoubleClick += (s, e) => ToggleEnabled();

            scanTimer = new System.Windows.Forms.Timer();
            scanTimer.Interval = 600;
            scanTimer.Tick += ScanTimer_Tick;
            scanTimer.Start();

            ShowBalloon("Auto-Approve ON", "Precise button detection active");
        }

        private ContextMenuStrip CreateContextMenu()
        {
            var menu = new ContextMenuStrip();
            menu.Items.Add("Toggle ON/OFF", null, (s, e) => ToggleEnabled());
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add("Exit", null, (s, e) => { trayIcon.Visible = false; Application.Exit(); });
            return menu;
        }

        private void ToggleEnabled()
        {
            isEnabled = !isEnabled;
            trayIcon.Text = isEnabled ? "Auto-Approve: ON" : "Auto-Approve: OFF";
            ShowBalloon(isEnabled ? "ON" : "OFF", isEnabled ? "Auto scanning" : "Disabled");
        }

        private void ShowBalloon(string title, string text)
        {
            trayIcon.BalloonTipTitle = title;
            trayIcon.BalloonTipText = text;
            trayIcon.ShowBalloonTip(1500);
        }

        private bool IsAcceptButtonBlue(Color c)
        {
            // STRICT BUTTON DETECTION - Only VS Code/Antigravity blue buttons
            // Button blue is approximately RGB(59, 130, 246) or similar
            // With Night Light: Blue reduced but still dominant
            
            // Requirements:
            // 1. Blue component must be reasonably bright (> 100)
            // 2. Blue must be strictly DOMINANT (not just present)
            // 3. Good saturation (blue - min > 40)
            
            int min = Math.Min(c.R, Math.Min(c.G, c.B));
            int saturation = c.B - min;
            
            return c.B > 100 &&                 // Blue is bright
                   c.B > c.R + 30 &&            // Blue clearly dominates Red
                   c.B > c.G + 10 &&            // Blue dominates Green
                   saturation > 40;             // Good color saturation
        }

        private bool IsAcceptButtonGreen(Color c)
        {
            // STRICT GREEN BUTTON DETECTION
            // Green buttons have G clearly dominant
            
            int min = Math.Min(c.R, Math.Min(c.G, c.B));
            int saturation = c.G - min;
            
            return c.G > 120 &&                 // Green is bright
                   c.G > c.R + 40 &&            // Green clearly dominates Red
                   c.G > c.B + 40 &&            // Green dominates Blue
                   saturation > 50;             // Good saturation
        }

        private void ClickAtAndReturn(int x, int y)
        {
            POINT originalPos;
            GetCursorPos(out originalPos);

            IntPtr foregroundWnd = GetForegroundWindow();
            IntPtr focusedElement = IntPtr.Zero;
            
            uint foregroundThread = GetWindowThreadProcessId(foregroundWnd, IntPtr.Zero);
            uint currentThread = GetCurrentThreadId();
            bool attached = false;
            
            if (foregroundThread != currentThread)
                attached = AttachThreadInput(currentThread, foregroundThread, true);
            
            if (attached || foregroundThread == currentThread)
                focusedElement = GetFocus();

            SetCursorPos(x, y);
            Thread.Sleep(30);
            mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
            Thread.Sleep(30);
            mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
            Thread.Sleep(100);

            SetCursorPos(originalPos.X, originalPos.Y);

            if (foregroundWnd != IntPtr.Zero)
            {
                SetForegroundWindow(foregroundWnd);
                Thread.Sleep(50);
                
                if (focusedElement != IntPtr.Zero)
                {
                    if (!attached && foregroundThread != currentThread)
                        attached = AttachThreadInput(currentThread, foregroundThread, true);
                    if (attached || foregroundThread == currentThread)
                        SetFocus(focusedElement);
                }
            }
            
            if (attached)
                AttachThreadInput(currentThread, foregroundThread, false);
        }

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

        [StructLayout(LayoutKind.Sequential)]
        public struct RECT
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }

        private void SafeClickSequence(IntPtr hwnd, int buttonX, int buttonY)
        {
            POINT originalPos;
            GetCursorPos(out originalPos);

            // SIMPLE: Just click the button directly, no scrolling
            SetCursorPos(buttonX, buttonY);
            Thread.Sleep(50);
            mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
            Thread.Sleep(30);
            mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
            Thread.Sleep(50);

            // Restore cursor position
            SetCursorPos(originalPos.X, originalPos.Y);
        }

        private void ScanTimer_Tick(object sender, EventArgs e)
        {
            if (!isEnabled) return;
            
            // Debounce slightly to avoid rapid-fire issues
            if ((DateTime.Now - lastTrigger).TotalMilliseconds < 800) return;

            IntPtr hwnd = GetForegroundWindow();
            if (hwnd == IntPtr.Zero) return;

            StringBuilder sb = new StringBuilder(256);
            GetWindowText(hwnd, sb, 256);
            string title = sb.ToString().ToLower();

            if (!title.Contains("antigravity") && !title.Contains("code") && !title.Contains("cursor"))
                return;

            // FIRST: Try to find the Accept button
            Point? buttonCenter = FindAcceptButton(hwnd);
            
            // If button NOT found, check if we need to scroll (scrollbar not at bottom)
            if (!buttonCenter.HasValue && NeedsScrollDown(hwnd))
            {
                // Scroll down using keyboard (Page Down) - NO cursor movement
                SendScrollDown(hwnd);
                Thread.Sleep(200);
                buttonCenter = FindAcceptButton(hwnd);
            }
            
            if (buttonCenter.HasValue)
            {
                lastTrigger = DateTime.Now;
                SafeClickSequence(hwnd, buttonCenter.Value.X, buttonCenter.Value.Y);
            }
        }

        [DllImport("user32.dll")]
        private static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
        
        private const uint WM_KEYDOWN = 0x0100;
        private const uint WM_KEYUP = 0x0101;
        private const int VK_NEXT = 0x22; // Page Down key

        private void SendScrollDown(IntPtr hwnd)
        {
            // Use mouse wheel at chat area - need brief cursor move but very fast
            RECT windowRect;
            if (!GetWindowRect(hwnd, out windowRect)) return;
            
            POINT originalPos;
            GetCursorPos(out originalPos);
            
            // Target: Center of chat panel (rightmost ~350px)
            int chatX = windowRect.Right - 175;
            int chatY = windowRect.Top + ((windowRect.Bottom - windowRect.Top) / 2);
            
            // FAST: Move, scroll, restore - minimal visible movement
            SetCursorPos(chatX, chatY);
            // Scroll DOWN (negative value = scroll down, reveals content below)
            mouse_event(MOUSEEVENTF_WHEEL, 0, 0, unchecked((uint)-600), 0); // Large scroll
            SetCursorPos(originalPos.X, originalPos.Y);
            // Total time: ~0ms visible cursor movement
        }

        private bool NeedsScrollDown(IntPtr hwnd)
        {
            // Check if there's a scrollbar and it's not at the bottom
            // We do this by looking at the bottom-right corner of the chat area
            // If we see scrollbar track color (not thumb), we need to scroll
            try
            {
                RECT windowRect;
                if (!GetWindowRect(hwnd, out windowRect)) return false;
                
                int winWidth = windowRect.Right - windowRect.Left;
                int winHeight = windowRect.Bottom - windowRect.Top;
                
                using (Bitmap bmp = new Bitmap(50, 100))
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    // Capture bottom-right corner (scrollbar area)
                    int captureX = windowRect.Right - 50;
                    int captureY = windowRect.Bottom - 150; // 150px from bottom
                    g.CopyFromScreen(captureX, captureY, 0, 0, bmp.Size);
                    
                    // Look for scrollbar track (dark gray) vs thumb (lighter)
                    // Scrollbar track in dark theme is usually around RGB(40-60, 40-60, 40-60)
                    // Scrollbar thumb is usually lighter RGB(80-120, 80-120, 80-120)
                    
                    int trackPixels = 0;
                    int thumbPixels = 0;
                    
                    // Check the rightmost 20px (scrollbar width)
                    for (int y = 0; y < 100; y += 5)
                    {
                        for (int x = 30; x < 50; x += 5)
                        {
                            Color c = bmp.GetPixel(x, y);
                            // Dark gray = track (needs scroll)
                            if (c.R >= 30 && c.R <= 70 && c.G >= 30 && c.G <= 70 && c.B >= 30 && c.B <= 70)
                                trackPixels++;
                            // Lighter gray = thumb (already at bottom)
                            else if (c.R >= 80 && c.R <= 140 && c.G >= 80 && c.G <= 140 && c.B >= 80 && c.B <= 140)
                                thumbPixels++;
                        }
                    }
                    
                    // If we see more track than thumb at the bottom area, need to scroll
                    return trackPixels > thumbPixels + 5;
                }
            }
            catch
            {
                return false;
            }
        }

        private Point? FindAcceptButton(IntPtr hwnd)
        {
            try
            {
                // GET WINDOW BOUNDS - Only scan within this window
                RECT windowRect;
                if (!GetWindowRect(hwnd, out windowRect))
                    return null;

                int winWidth = windowRect.Right - windowRect.Left;
                int winHeight = windowRect.Bottom - windowRect.Top;
                
                if (winWidth < 100 || winHeight < 100)
                    return null;

                using (Bitmap bmp = new Bitmap(winWidth, winHeight))
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    // Capture ONLY the window area
                    g.CopyFromScreen(windowRect.Left, windowRect.Top, 0, 0, bmp.Size);

                    int step = 8;
                    
                    // Scan within window bounds (relative coordinates)
                    for (int y = 0; y < winHeight; y += step)
                    {
                        for (int x = 0; x < winWidth; x += step)
                        {
                            Color c = bmp.GetPixel(x, y);
                            
                            if (IsAcceptButtonBlue(c) || IsAcceptButtonGreen(c))
                            {
                                // RIGHTMOST 400px ONLY (the chat panel):
                                // This is where Accept, Retry, and error dialog buttons appear
                                int minX = winWidth - 400;  // Only rightmost 400px
                                int minY = 50;               // Skip just the title bar
                                int maxY = winHeight - 50;   // Include error dialogs near bottom
                                
                                if (x > minX && y > minY && y < maxY && IsSolidButtonBlock(bmp, x, y, 50, 16, winWidth, winHeight))
                                {
                                    return new Point(windowRect.Left + x + 25, windowRect.Top + y + 8);
                                }
                            }
                        }
                    }

                    return null;
                }
            }
            catch
            {
                return null;
            }
        }

        private bool IsSolidButtonBlock(Bitmap bmp, int startX, int startY, int width, int height, int maxW, int maxH)
        {
            int matchCount = 0;
            int totalChecked = 0;

            for (int dy = 0; dy < height; dy += 3)
            {
                for (int dx = 0; dx < width; dx += 3)
                {
                    int nx = startX + dx;
                    int ny = startY + dy;
                    
                    if (nx >= 0 && nx < maxW && ny >= 0 && ny < maxH)
                    {
                        totalChecked++;
                        Color c = bmp.GetPixel(nx, ny);
                        if (IsAcceptButtonBlue(c) || IsAcceptButtonGreen(c))
                            matchCount++;
                    }
                }
            }

            // VERY HIGH THRESHOLD: 75%
            // Real buttons are SOLID colored - almost every pixel matches.
            // Images have VARIED colors - only some pixels match.
            // 75% ensures we only click truly solid button blocks.
            return totalChecked > 0 && matchCount > (totalChecked * 0.75);
        }
    }

    static class Program
    {
        [STAThread]
        static void Main()
        {
            using (Mutex mutex = new Mutex(false, "Global\\AntigravityAutoApproveMutex"))
            {
                if (!mutex.WaitOne(0, false)) return;
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new AutoApproveContext());
            }
        }
    }
}
