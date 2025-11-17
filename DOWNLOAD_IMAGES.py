#!/usr/bin/env python3
"""
LOCAL IMAGE DOWNLOAD SCRIPT - Run this on your local machine

This script downloads all Unsplash images used in the Urban Ways website
and converts them to optimized WebP format for maximum performance.

REQUIREMENTS:
  pip install Pillow requests

USAGE:
  python3 DOWNLOAD_IMAGES.py

This will download 29 images (~15-20MB total) and convert them to optimized
WebP format, reducing total size to ~5-8MB while maintaining visual quality.
"""

import requests
import os
from PIL import Image
import io

# All images with their required dimensions
IMAGES = [
    ('photo-1503387762-592deb58ef4e', 1920, 'Architect reviewing building plans'),
    ('photo-1600607687939-ce8a6c25118c', 1920, 'HERO IMAGE - Modern interior living room'),
    ('photo-1566073771259-6a8506099945', 1920, 'Contemporary interior design'),
    ('photo-1486406146926-c627a92ad1ab', 1920, 'Modern office building'),
    ('photo-1524813686514-a57563d77965', 1920, 'Minimalist interior'),
    ('photo-1556911220-bff31c812dba', 1920, 'Modern kitchen design'),
    ('photo-1618221195710-dd6b41faaea6', 1920, 'Interior design with plants'),
    ('photo-1616486338812-3dadae4b4ace', 1920, 'Contemporary living space'),
    ('photo-1541888946425-d81bb19240f5', 1920, 'Construction site'),
    ('photo-1558904541-efa843a96f01', 1200, 'Service image'),
    ('photo-1600210492486-724fe5c67fb0', 1200, 'Floor to ceiling windows'),
    ('photo-1586023492125-27b2c045efd7', 1200, 'Neutral color interior'),
    ('photo-1556912167-f556f1f39faa', 1200, 'Multi-functional space'),
    ('photo-1615873968403-89e068629265', 1200, 'Modern flooring'),
    ('photo-1513519245088-0e12902e35ca', 1200, 'Statement wall art'),
    ('photo-1505693416388-ac5ce068fe85', 1200, 'Cozy reading nook'),
    ('photo-1558002038-1055907df827', 1200, 'Smart home technology'),
    ('photo-1463320726281-696a485928c7', 1200, 'Indoor plants biophilic'),
    ('photo-1554224311-beee4f201d8d', 800, 'Interior designer portfolio'),
    ('photo-1560518883-ce09059eeffa', 1920, 'Luxury interior'),
    ('photo-1454165804606-c3d57bc86b40', 1200, 'Budget planning'),
    ('photo-1552321554-5fefe8c9ef14', 1200, 'Modern bathroom'),
    ('photo-1460472178825-e5240623afd5', 1200, 'Design factors'),
    ('photo-1523726491678-bf852e717f6a', 1200, 'Cost analysis'),
    ('photo-1554224155-6726b3ff858f', 1200, 'Budget strategies'),
    ('photo-1600880292203-757bb62b4baf', 1200, 'Professional team'),
    ('photo-1553877522-43269d4ea984', 1200, 'Design consultation'),
    ('photo-1423666639041-f56000c27a9a', 1920, 'Modern architecture'),
    ('photo-1507003211169-0a1dd7228f2d', 1920, 'Professional portrait'),
]

OUTPUT_DIR = 'assets/images'
WEBP_QUALITY = 85  # Balance between quality and file size

def download_and_optimize(photo_id, width, description):
    """Download from Unsplash and convert to optimized WebP"""

    url = f'https://images.unsplash.com/{photo_id}?w={width}&q=80'
    output_path = f'{OUTPUT_DIR}/{photo_id}.webp'

    if os.path.exists(output_path):
        size_kb = os.path.getsize(output_path) / 1024
        print(f'✓ Skip (exists): {photo_id}.webp ({size_kb:.1f} KB)')
        return True

    try:
        print(f'Downloading: {description[:40]:<40} ', end='', flush=True)

        # Download with proper headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Referer': 'https://www.urbanways.co.in/',
        }

        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        # Open with Pillow
        img = Image.open(io.BytesIO(response.content))

        # Convert RGBA/P to RGB (WebP optimization)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            if img.mode in ('RGBA', 'LA'):
                background.paste(img, mask=img.split()[-1])
            else:
                background.paste(img)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Save as optimized WebP
        img.save(
            output_path,
            'WEBP',
            quality=WEBP_QUALITY,
            method=6,  # Maximum compression
            lossless=False
        )

        size_kb = os.path.getsize(output_path) / 1024
        original_kb = len(response.content) / 1024
        savings = ((original_kb - size_kb) / original_kb) * 100

        print(f'✓ {size_kb:5.1f} KB (saved {savings:.0f}%)')
        return True

    except Exception as e:
        print(f'✗ ERROR: {str(e)[:40]}')
        return False

def main():
    print('='*70)
    print('URBAN WAYS - IMAGE OPTIMIZATION SCRIPT')
    print('='*70)
    print(f'\nDownloading {len(IMAGES)} images to {OUTPUT_DIR}/\n')

    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Download all images
    success_count = 0
    total_size = 0

    for i, (photo_id, width, description) in enumerate(IMAGES, 1):
        print(f'[{i:2d}/{len(IMAGES)}] ', end='')
        if download_and_optimize(photo_id, width, description):
            success_count += 1
            output_path = f'{OUTPUT_DIR}/{photo_id}.webp'
            if os.path.exists(output_path):
                total_size += os.path.getsize(output_path)

    # Summary
    print('\n' + '='*70)
    print(f'COMPLETED: {success_count}/{len(IMAGES)} images downloaded')
    print(f'Total size: {total_size/1024/1024:.2f} MB')
    print(f'Output directory: {OUTPUT_DIR}/')
    print('='*70)

    if success_count == len(IMAGES):
        print('\n✓ SUCCESS! All images optimized and ready for deployment.')
        print('\nNext steps:')
        print('  1. Commit the assets/images/ directory to git')
        print('  2. Push to GitHub')
        print('  3. Your website will now load 60-70% faster!')
    else:
        print(f'\n⚠ WARNING: {len(IMAGES) - success_count} images failed to download.')
        print('Please check your internet connection and try again.')

if __name__ == '__main__':
    main()
