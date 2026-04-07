
import sys
from playwright.sync_api import sync_playwright
import time

def run():
    print("Initializing Playwright...")
    with sync_playwright() as p:
        print("Launching Chromium (headed)...")
        # Launch with default args + ignore verification errors if any
        browser = p.chromium.launch(headless=False, args=["--start-maximized"])
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()
        
        print("Navigating to Wikamp (edu.p.lodz.pl)...")
        try:
            page.goto("https://edu.p.lodz.pl/")
        except Exception as e:
            print(f"Error navigating: {e}")

        print("BROWSER READY. Please log in and navigate to your test.")
        print("Type 'screenshot <name>' to capture the screen for me.")
        print("Type 'exit' to close browser.")
        sys.stdout.flush()

        while True:
            try:
                line = sys.stdin.readline()
                if not line:
                    break
                
                cmd = line.strip()
                if cmd == "exit":
                    break
                elif cmd.startswith("screenshot"):
                    parts = cmd.split()
                    filename = parts[1] if len(parts) > 1 else "cal_screenshot.png"
                    try:
                        page.screenshot(path=filename)
                        print(f"SCREENSHOT_SAVED: {filename}")
                    except Exception as e:
                        print(f"SCREENSHOT_ERROR: {e}")
                elif cmd.startswith("goto"):
                    parts = cmd.split(" ", 1)
                    if len(parts) > 1:
                        url = parts[1]
                        page.goto(url)
                        print(f"NAVIGATED: {url}")
                else:
                    if cmd:
                        print(f"UNKNOWN_COMMAND: {cmd}")
                
                sys.stdout.flush()
                
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"ERROR: {e}")

        browser.close()

if __name__ == "__main__":
    run()
