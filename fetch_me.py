import urllib.request
import re

url = "https://www.mediaexpert.pl/share-compare?id=7348194%2C7342578%2C7626671%2C8301207&activeGroup=Laptopy"
req = urllib.request.Request(
    url,
    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
)

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode("utf-8")
        matches = re.finditer(r"Laptop ([^<]+)", html)
        for m in matches:
            if "HP" in m.group(1) or "ACER" in m.group(1) or "ASUS" in m.group(1) or "LENOVO" in m.group(1):
                print(m.group(1)[:200])
except Exception as e:
    print(e)
