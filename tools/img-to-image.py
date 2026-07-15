import os, re

files = [
    'apps/web/src/app/page.tsx',
    'apps/web/src/app/login/page.tsx',
    'apps/web/src/app/register/page.tsx',
    'apps/web/src/app/dashboard/page.tsx',
    'apps/web/src/app/seller/layout.tsx',
    'apps/web/src/app/admin/layout.tsx',
    'apps/web/src/components/DashboardLayout.tsx',
    'apps/web/src/components/MarketplaceCards.tsx',
    'apps/web/src/app/sellers/[slug]/client.tsx',
    'apps/web/src/app/seller/store/page.tsx',
    'apps/web/src/app/products/[slug]/client.tsx',
    'apps/web/src/app/favorites/page.tsx',
    'apps/web/src/app/profile/page.tsx',
    'apps/web/src/app/cart/page.tsx',
    'apps/web/src/app/admin/sellers/page.tsx',
    'apps/web/src/app/seller/products/page.tsx',
]

root = r'E:\SADEAN'
for f in files:
    path = os.path.join(root, f)
    if not os.path.exists(path):
        print(f'SKIP: {f}')
        continue
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    if '<img ' not in content:
        print(f'SKIP: {f}')
        continue
    lines = content.split('\n')
    
    # Add import
    has_image_import = any("from 'next/image'" in l or 'from "next/image"' in l for l in lines)
    if not has_image_import:
        insert_at = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                insert_at = i + 1
        lines.insert(insert_at, "import Image from 'next/image';")
    
    content = '\n'.join(lines)
    content = content.replace('<img ', '<Image ')
    
    # Remove duplicate Image imports
    lines2 = content.split('\n')
    seen = False
    clean = []
    for line in lines2:
        stripped = line.strip()
        if stripped == "import Image from 'next/image';":
            if not seen:
                seen = True
                clean.append("import Image from 'next/image';")
        else:
            clean.append(line)
    
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(clean))
    print(f'OK: {f}')
