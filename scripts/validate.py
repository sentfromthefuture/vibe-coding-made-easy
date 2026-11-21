import json,sys
L=lambda f:json.load(open("data/"+f))
st={s["id"] for s in L("stages.json")};tools=L("tools.json");ids=[t["id"] for t in tools];bad=[]
if len(ids)!=len(set(ids)):bad.append("duplicate tool ids")
for t in tools:
    if t["stage"] not in st:bad.append(t["id"]+": unknown stage")
    if not t["url"].startswith("https://"):bad.append(t["id"]+": url")
have={t["stage"] for t in tools}
for i in L("idea-types.json"):
    for s in i["stages"]:
        if s not in st:bad.append(i["id"]+": unknown stage "+s)
        elif s not in have:bad.append(i["id"]+": no tools for "+s)
print("\n".join(bad) or "ok: %d tools, %d stages"%(len(tools),len(st)));sys.exit(1 if bad else 0)
