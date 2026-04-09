import json
import urllib.request
import re

def scrape_me(url):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode("utf-8")
            
            # Simple regex to get JSON-LD data which MediaExpert usually embeds
            matches = re.finditer(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
            for m in matches:
                data = m.group(1)
                if "Product" in data:
                    print("JSONLD:", data[:500] + "...")
            
            # Find the parameter table directly
            import sys
            sys.stdout.buffer.write(html.encode("utf-8"))
    except Exception as e:
        print(f"Error for {url}: {e}")

# Product IDs from the screenshot link
urls = [
    "https://www.mediaexpert.pl/komputery-i-tablety/laptopy-i-ultrabooki/laptopy/laptop-hp-pavilion-16-ag0015nw-16-wuxga-ips-r5-8540u-16gb-ram-512gb-ssd-windows-11-home",
    "https://www.mediaexpert.pl/share-compare?id=7348194%2C7342578%2C7626671%2C8301207&activeGroup=Laptopy"
]

for u in urls:
    print(f"\n--- Scraping {u} ---")
    scrape_me(u)
