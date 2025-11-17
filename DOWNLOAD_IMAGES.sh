#!/bin/bash
# Download and optimize all Unsplash images - Run this on your LOCAL machine
# Usage: bash DOWNLOAD_IMAGES.sh

echo "=================================================="
echo "DOWNLOADING IMAGES FOR URBAN WAYS WEBSITE"
echo "=================================================="
echo ""

mkdir -p assets/images
cd assets/images

# Array of all images (photo_id:width)
images=(
    "photo-1503387762-592deb58ef4e:1920"
    "photo-1600607687939-ce8a6c25118c:1920"
    "photo-1566073771259-6a8506099945:1920"
    "photo-1486406146926-c627a92ad1ab:1920"
    "photo-1524813686514-a57563d77965:1920"
    "photo-1556911220-bff31c812dba:1920"
    "photo-1618221195710-dd6b41faaea6:1920"
    "photo-1616486338812-3dadae4b4ace:1920"
    "photo-1541888946425-d81bb19240f5:1920"
    "photo-1558904541-efa843a96f01:1200"
    "photo-1600210492486-724fe5c67fb0:1200"
    "photo-1586023492125-27b2c045efd7:1200"
    "photo-1556912167-f556f1f39faa:1200"
    "photo-1615873968403-89e068629265:1200"
    "photo-1513519245088-0e12902e35ca:1200"
    "photo-1505693416388-ac5ce068fe85:1200"
    "photo-1558002038-1055907df827:1200"
    "photo-1463320726281-696a485928c7:1200"
    "photo-1554224311-beee4f201d8d:800"
    "photo-1560518883-ce09059eeffa:1920"
    "photo-1454165804606-c3d57bc86b40:1200"
    "photo-1552321554-5fefe8c9ef14:1200"
    "photo-1460472178825-e5240623afd5:1200"
    "photo-1523726491678-bf852e717f6a:1200"
    "photo-1554224155-6726b3ff858f:1200"
    "photo-1600880292203-757bb62b4baf:1200"
    "photo-1553877522-43269d4ea984:1200"
    "photo-1423666639041-f56000c27a9a:1920"
    "photo-1507003211169-0a1dd7228f2d:1920"
)

count=0
total=${#images[@]}

echo "Downloading $total images..."
echo ""

for img in "${images[@]}"; do
    photo_id="${img%:*}"
    width="${img#*:}"

    count=$((count + 1))

    if [ -f "${photo_id}.jpg" ]; then
        echo "[$count/$total] ✓ Already exists: ${photo_id}.jpg"
    else
        echo -n "[$count/$total] Downloading ${photo_id}... "

        curl -L -s -o "${photo_id}.jpg" \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
            "https://images.unsplash.com/${photo_id}?w=${width}&q=80"

        if [ -f "${photo_id}.jpg" ] && [ -s "${photo_id}.jpg" ]; then
            size=$(ls -lh "${photo_id}.jpg" | awk '{print $5}')
            echo "✓ ${size}"
        else
            echo "✗ FAILED"
        fi
    fi

    sleep 0.3  # Be nice to Unsplash
done

echo ""
echo "=================================================="
echo "DOWNLOAD COMPLETE!"
echo "=================================================="
echo "Downloaded images: $(ls -1 *.jpg 2>/dev/null | wc -l)/$total"
echo "Total size: $(du -sh . 2>/dev/null | awk '{print $1}')"
echo ""
echo "Next steps:"
echo "1. git add assets/images/"
echo "2. git commit -m 'Add optimized images'"
echo "3. git push"
echo ""
