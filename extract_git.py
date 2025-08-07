import zlib
import os

# Decomprime l'oggetto git commit
with open('.git/objects/2e/ec9880e2f26fd459705a3b54263ba7e52dd8f1', 'rb') as f:
    compressed = f.read()
    
decompressed = zlib.decompress(compressed)
content = decompressed.decode('utf-8', errors='ignore')

# Salva in un file
with open('commit_content.txt', 'w', encoding='utf-8') as f:
    f.write(content)

print("Content saved to commit_content.txt")


