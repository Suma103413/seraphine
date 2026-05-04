import urllib.request, json
res = urllib.request.urlopen('https://picsum.photos/v2/list?page=1&limit=50')
data = json.loads(res.read())
for d in data:
    print(f"{d['id']}: {d['url']}")
