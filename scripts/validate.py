import json,sys
L=lambda f:json.load(open("data/"+f))
st={s["id"] for s in L("stages.json")};tools=L("tools.json");ids=[t["id"] for t in tools];bad=[]
if len(ids)!=len(set(ids)):bad.append("duplicate tool ids")
for t in tools:
    i=t["id"]
    if t["stage"] not in st:bad.append(i+": unknown stage")
    if not t["url"].startswith("https://"):bad.append(i+": url")
    if t["status"] not in ("active","caution","sunsetting"):bad.append(i+": status")
    if t["confidence"] not in ("researched","partly-researched","general-knowledge"):bad.append(i+": confidence")
    for k in ("tradeoffs","long_term"):
        if not t.get(k):bad.append(i+": missing "+k)
    if not t.get("watch_out"):bad.append(i+": missing watch_out")
    if t["confidence"]!="general-knowledge" and (not t["sources"] or not t["last_checked"]):bad.append(i+": researched but no sources or date")
have={t["stage"] for t in tools if t["status"]=="active"}
for i in L("idea-types.json"):
    for s in i["stages"]:
        if s not in st:bad.append(i["id"]+": unknown stage "+s)
        elif s not in have:bad.append(i["id"]+": no active tools for "+s)
print("\n".join(bad) or "ok: %d tools, %d stages"%(len(tools),len(st)));sys.exit(1 if bad else 0)
