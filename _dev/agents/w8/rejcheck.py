import sys
# allow only rejected hunks that touch the two registry lines
bad=[l for l in open(sys.argv[1]) if l[:1] in "+-" and not l.startswith(("+++","---")) and "Methods, step by step" not in l and '"m-chain": 7' not in l]
if bad: print("REAL REJECT:", *bad[:5], sep="\n"); sys.exit(1)
print("registry-only reject: ok")
