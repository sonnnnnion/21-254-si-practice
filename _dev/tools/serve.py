# static server with a deep accept queue (the default queue of 5 drops some of the site's 10 parallel data fetches)
import sys, functools, http.server
class S(http.server.ThreadingHTTPServer): request_queue_size = 128
port, root = int(sys.argv[1]), sys.argv[2]
S(("127.0.0.1", port), functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)).serve_forever()
